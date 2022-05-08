import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { Event } from 'src/app/models/event';
import { EventDate } from 'src/app/models/event-date';
import { Session } from 'src/app/models/session';
import { User } from 'src/app/models/user';
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
    this.sessions.sessions.push(eventDate);
  }
  removeSession(eventDate: EventDate) {
    this.sessions.sessions = this.sessions.sessions.filter(
      (e) => e.date !== eventDate.date
    );
  }
  async createUserData() {
    const regUser = new User();
    regUser.approved = false;
    regUser.contributed = false;
    regUser.email = this.firebase.auth.currentUser.email;
    regUser.id = this.firebase.auth.currentUser.uid;
    regUser.name = this.firebase.auth.currentUser.displayName;
    regUser.photoURL = this.firebase.auth.currentUser.photoURL;
    regUser.events = await (
      await this.firebase.getUserByID(this.firebase.auth.currentUser.uid)
    ).data().events;
    regUser.events.find((e) => e.id === this.sessions.id).sessions =
      this.sessions.sessions;
    return regUser;
  }
  submit() {
    this.firebase
      .updateUserEvents(this.sessions, this.firebase.auth.currentUser.uid)
      .then(async () => {
        if (this.contributeEvent.registeredUsers) {
          if (
            !this.contributeEvent.registeredUsers.find(
              (e) => e.id === this.firebase.auth.currentUser.uid
            )
          ) {
            this.contributeEvent.registeredUsers.push(
              await this.createUserData()
            );
          } else {
            this.contributeEvent.registeredUsers.find(
              (e) => e.id === this.firebase.auth.currentUser.uid
            ).events = await (
              await this.createUserData()
            ).events;
          }
        } else {
          this.contributeEvent.registeredUsers = new Array();
          this.contributeEvent.registeredUsers.push(
            await this.createUserData()
          );
        }

        this.firebase
          .updateEvent(this.contributeEvent.id, this.contributeEvent)
          .then(() => {
            this.controller.dismiss();
          });
      });
  }
}
