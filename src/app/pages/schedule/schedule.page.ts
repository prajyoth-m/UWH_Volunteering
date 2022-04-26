import { Component, OnInit, ViewChild } from '@angular/core';
import { Event } from 'src/app/models/event';
import { FirebaseService } from 'src/app/services/firebase.service';
import { IonList, ModalController } from '@ionic/angular';
import { ExitEventPage } from '../exit-event/exit-event.page';
import { EventDate } from 'src/app/models/event-date';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  events: Array<Event>;
  constructor(
    private firebase: FirebaseService,
    private modalController: ModalController
  ) {

  }

  ngOnInit() {
    this.refresh();
  }

  ionViewWillEnter() {

  }

  refresh() {
    this.events = new Array<Event>();
    this.firebase
      .getUserByID(this.firebase.auth.currentUser.uid)
      .then((snap) => {
        snap.data().events.forEach((element) => {
          const eventID = element.id;
          const sessionsData = element.sessions;
          this.firebase.getEventByID(eventID).then(eventData=>{
            const eventDat = eventData.data();
            const eventSnap = new Event();
            eventSnap.id = eventID;
            Object.assign(eventSnap,eventDat);
            eventSnap.dates = sessionsData;
            this.events.push(eventSnap);
          });
        });
      });
  }

  async presentModal(event: Event) {
    //TODO create a popup form asking why leaving
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

  async removeSession(sessionData: EventDate,eventID: string) {
    const selectedEvent = this.events.find(e=>e.id===eventID);
    const filteredSess = selectedEvent.dates.filter(e=>e.date!==sessionData.date);
    selectedEvent.dates = filteredSess;
    const filteredEvents = this.events.filter(e=>e.id!==eventID);
    this.events = new Array<Event>();
    this.events.push(...filteredEvents);
    this.events.push(selectedEvent);

    //TODO commit data to firebase
  }
}
