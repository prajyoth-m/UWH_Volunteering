import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { Event } from 'src/app/models/event';
import { EventDate } from 'src/app/models/event-date';
import { Session } from 'src/app/models/session';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-contribute-modal',
  templateUrl: './contribute-modal.page.html',
  styleUrls: ['./contribute-modal.page.scss'],
})
export class ContributeModalPage implements OnInit {
  @Input() controller: ModalController;
  @Input() contributeEvent: Event;
  sessions: Session;
  constructor(private firebase: FirebaseService) {
    this.sessions = new Session();
    this.sessions.sessions = new Array();
  }

  ngOnInit() {
    this.sessions.id = this.contributeEvent.id;
    this.sessions.name = this.contributeEvent.name;
    this.sessions.sessions = Array();
    this.contributeEvent.dates.forEach((date) => {
      if (date.isRegistered) {
        this.sessions.sessions.push(date);
      }
    });
  }
  dismissModal() {
    this.controller.dismiss();
  }
  addSession(eventDate: EventDate) {
    console.log(this.getAllUserSessions());
    this.sessions.sessions.push(eventDate);
  }
  getAllUserSessions() {
    return this.firebase
      .getUserByID(this.firebase.auth.currentUser.uid)
      .then((snap) => {
        const data = snap.data();
        return data.events.map((event) => {
          const session = new EventDate();
          Object.assign(session, event.sessions);
          return session;
        });
      });
  }
  removeSession(eventDate: EventDate) {
    this.sessions.sessions = this.sessions.sessions.filter(
      (e) => e.date !== eventDate.date
    );
    console.log(this.sessions.sessions);
  }
  submit() {
    this.firebase.updateUserEvents(
      this.sessions,
      this.firebase.auth.currentUser.uid
    );
    this.controller.dismiss();
  }
}
