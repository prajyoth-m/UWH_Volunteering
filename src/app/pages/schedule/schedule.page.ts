import { Component, OnInit, ViewChild } from '@angular/core';
import { Event } from 'src/app/models/event';
import { FirebaseService } from 'src/app/services/firebase.service';
import { IonList, ModalController } from '@ionic/angular';
import { ExitEventPage } from '../exit-event/exit-event.page';
import { EventDate } from 'src/app/models/event-date';
import { Session } from 'src/app/models/session';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  events: Event[] = [];
  constructor(
    private firebase: FirebaseService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.refresh();
  }

  refresh() {
    this.events = new Array<Event>();
    this.firebase
      .getUserByID(this.firebase.auth.currentUser.uid)
      .then((snap) => {
        snap.data().events.forEach((element) => {
          const eventID = element.id;
          const sessionsData = element.sessions;
          this.firebase.getEventByID(eventID).then((eventData) => {
            const eventDat = eventData.data();
            const eventSnap = new Event();
            eventSnap.id = eventID;
            Object.assign(eventSnap, eventDat);
            eventSnap.dates = sessionsData;
            this.events.push(eventSnap);
          });
        });
      });
  }

  //TODO not being used yet
  async presentModal(event: Event) {
    this.firebase
      .getUserByID(this.firebase.auth.currentUser.uid)
      .then((snap) => {
        const events = snap.data().events;
        const filteredEvent = events.filter((evnt) => evnt.id !== event.id);

        this.firebase.updateUserEvents(
          filteredEvent,
          this.firebase.auth.currentUser.uid
        );
      });
  }

  async removeSession(
    sessionData: EventDate,
    eventID: string,
    eventName: string
  ) {
    const selectedEvent = this.events.find((e) => e.id === eventID);
    const filteredSess = selectedEvent.dates.filter(
      (e) => e.date !== sessionData.date
    );
    selectedEvent.dates = filteredSess;
    const filteredEvents = this.events.filter((e) => e.id !== eventID);
    this.events = new Array<Event>();
    this.events.push(...filteredEvents);
    this.events.push(selectedEvent);

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
  isEventApproved(event: Event): boolean {
    return event.registeredUsers.find(
      (e) => e.id === this.firebase.auth.currentUser.uid
    )
      ? event.registeredUsers.find(
          (e) => e.id === this.firebase.auth.currentUser.uid
        ).approved
      : false;
  }
}
