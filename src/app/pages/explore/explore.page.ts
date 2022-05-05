import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Event } from 'src/app/models/event';
import { EventDate } from 'src/app/models/event-date';
import { Session } from 'src/app/models/session';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ContributeModalPage } from '../contribute-modal/contribute-modal.page';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  events: Array<Event>;
  modal: HTMLElement;
  registeredEvents: Array<Session>;
  constructor(
    private firebase: FirebaseService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.refresh();
  }

  refresh() {
    this.events = new Array();
    this.registeredEvents = new Array();
    this.firebase
      .getUserByID(this.firebase.auth.currentUser.uid)
      .then((snap) => {
        this.registeredEvents.push(...snap.data().events);
      })
      .then((res) => {
        this.firebase.getEvents().then((snap) => {
          snap.forEach((doc) => {
            const event = new Event();
            event.id = doc.id;
            Object.assign(event, doc.data());
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

            this.events.push(event);
          });
        });
      });
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
      // Create the event
      const cstevnt = new CustomEvent('subscriptions');

      // Dispatch/Trigger/Fire the event
      document.dispatchEvent(cstevnt);
    });
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
}
