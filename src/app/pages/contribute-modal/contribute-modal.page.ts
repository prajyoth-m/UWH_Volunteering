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
  }
  dismissModal() {
    this.controller.dismiss();
  }
  addSession(eventDate: EventDate) {
    this.sessions.sessions.push(eventDate);
  }
  removeSession(eventDate: EventDate) {
    this.sessions.sessions = this.sessions.sessions.filter(
      (e) => e.date !== eventDate.date
    );
  }
  submit() {
    this.firebase.updateUserEvents(
      this.sessions,
      this.firebase.auth.currentUser.uid
    );
    this.controller.dismiss();
  }
}
