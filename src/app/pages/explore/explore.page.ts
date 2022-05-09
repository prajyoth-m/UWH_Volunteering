import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Event } from 'src/app/models/event';
import { EventDate } from 'src/app/models/event-date';
import { User } from 'src/app/models/user';
import { Session } from 'src/app/models/session';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ContributeModalPage } from '../contribute-modal/contribute-modal.page';
import { sendEmailVerification } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  events: Array<Event>;
  modal: HTMLElement;
  registeredEvents: Array<Session>;
  completedEvents: Array<Event>;
  upcomingEvents: Array<Event>;
  upcomingView: boolean;
  verifiedAccount: boolean;
  isVolunteer: boolean;
  constructor(
    private firebase: FirebaseService,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.verifiedAccount = this.firebase.auth.currentUser.emailVerified;
    this.upcomingView = true;
  }

  ionViewWillEnter() {
    this.refresh();
    this.events = this.upcomingEvents;
  }
  triggerEmail() {
    sendEmailVerification(this.firebase.auth.currentUser);
  }
  refresh() {
    this.events = new Array();
    this.registeredEvents = new Array();
    this.completedEvents = new Array();
    this.upcomingEvents = new Array();
    this.firebase
      .getUserByID(this.firebase.auth.currentUser.uid)
      .then((snap) => {
        this.registeredEvents.push(...snap.data().events);
        this.isVolunteer = snap.data().role === 'volunteer';
      })
      .then((res) => {
        this.firebase.getEvents().then((snap) => {
          snap.forEach((doc) => {
            const event = new Event();
            event.id = doc.id;
            Object.assign(event, doc.data());
            event.location.lat = doc.data().location._lat;
            event.location.long = doc.data().location._long;
            if (this.registeredEvents.find((ev) => ev.id === doc.id)) {
              const registeredEvts = new Array<EventDate>();
              registeredEvts.push(
                ...this.registeredEvents.find((ev) => ev.id === doc.id).sessions
              );
              event.dates.forEach((date) => {
                if (
                  registeredEvts.find(
                    (reg) => reg.date.seconds === date.date.seconds
                  )
                ) {
                  date.isRegistered = true;
                } else {
                  date.isRegistered = false;
                }
              });
              event.sessions = registeredEvts.length + '';
            } else {
              event.sessions = undefined;
            }
            event.registrationCount = doc
              .data()
              .registeredUsers.filter((user) => user.approved).length;
            if (event.isCompleted) {
              this.completedEvents.push(event);
            } else {
              this.upcomingEvents.push(event);
            }
          });
        });
      });
  }
  segmentChanged(event: any) {
    if (event.detail.value === 'CompletedEvents') {
      this.events = this.completedEvents;
      this.upcomingView = false;
    } else {
      this.events = this.upcomingEvents;
      this.upcomingView = true;
    }
  }
  async presentModal(event) {
    const modal = await this.modalController.create({
      component: ContributeModalPage,
      cssClass: 'contribute-modal',
      componentProps: {
        controller: this.modalController,
        contributeEvent: event,
      },
      breakpoints: [0, 0.5, 0.75, 1],
      initialBreakpoint: 0.5,
    });
    await modal.present();
    await modal.onDidDismiss().then((res) => {
      this.refresh();
      const evt = { detail: { value: 'UpcomingEvents' } };
      this.segmentChanged(evt);
      // Create the event
      const cstevnt = new CustomEvent('subscriptions');

      // Dispatch/Trigger/Fire the event
      document.dispatchEvent(cstevnt);
    });
  }

  removeUser(userData: User, eventID: string, eventName: string) {
    this.events.forEach((event) => {
      if (event.id === eventID) {
        event.registeredUsers.forEach((user) => {
          if (user.id === userData.id) {
            user.rejectionReason = 'removed';
          }
        });
      }
    });

    const currSession = new Session();
    currSession.id = eventID;
    currSession.name = eventName;
    currSession.users = new Array<User>();
    currSession.users.push(
      ...this.events
        .find((e) => e.id === eventID)
        .registeredUsers.filter((e) => e.rejectionReason !== 'removed')
    );
    if (currSession.users.length !== 0) {
      this.firebase
        .updateUserEvents(currSession, this.firebase.auth.currentUser.uid)
        .then((res) => {
          // Create the event
          const cstevnt = new CustomEvent('subscriptions');

          // Dispatch/Trigger/Fire the event
          document.dispatchEvent(cstevnt);
        });
    }
  }

  removeSession(sessionData: EventDate, eventID: string, eventName: string) {
    this.events.forEach((event) => {
      if (event.id === eventID) {
        event.dates.forEach((date) => {
          if (date.date.seconds === sessionData.date.seconds) {
            date.isRegistered = false;
            event.sessions = parseInt(event.sessions, 10) - 1 + '';
          }
        });
      }
    });

    const currSession = new Session();
    currSession.id = eventID;
    currSession.name = eventName;
    currSession.sessions = new Array<EventDate>();
    currSession.sessions.push(
      ...this.events
        .find((e) => e.id === eventID)
        .dates.filter((e) => e.isRegistered)
    );
    if (currSession.sessions.length === 0) {
      this.firebase
        .removeUserEvent(eventID, this.firebase.auth.currentUser.uid)
        .then((res) => {
          // Create the event
          const cstevnt = new CustomEvent('subscriptions');

          // Dispatch/Trigger/Fire the event
          document.dispatchEvent(cstevnt);
        });
    } else {
      this.firebase
        .updateUserEvents(currSession, this.firebase.auth.currentUser.uid)
        .then((res) => {
          // Create the event
          const cstevnt = new CustomEvent('subscriptions');

          // Dispatch/Trigger/Fire the event
          document.dispatchEvent(cstevnt);
        });
    }
  }
  openInMaps(event: Event) {
    const mapsLink =
      'https://www.google.com/maps/dir/?api=1&destination=' +
      event.location.lat +
      ',' +
      event.location.long;
    console.log(event.location.lat + ',' + event.location.long);
    window.open(mapsLink, '_blank');
  }
}
