import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  events: Array<Event>;
  constructor(private firebase: FirebaseService) {}

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
          const eventID = element;
          this.firebase.getEventByID(eventID).then((eventSnap) => {
            const eventIn = new Event();
            Object.assign(eventIn, eventSnap.data());
            this.events.push(eventIn);
          });
        });
      });
  }

  presentModal(event: Event) {
    //TODO create a popup form asking why leaving
  }
}
