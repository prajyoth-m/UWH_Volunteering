import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Event } from 'src/app/models/event';
import { EventDate } from 'src/app/models/event-date';
import { Session } from 'src/app/models/session';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-complete-event',
  templateUrl: './complete-event.page.html',
  styleUrls: ['./complete-event.page.scss'],
})
export class CompleteEventPage implements OnInit {
  @Input() controller: ModalController;
  @Input() event: Event;
  constructor(
    private firebase: FirebaseService,
    public alertController: AlertController
  ) {}

  ngOnInit() {}
  dismissModal() {
    this.controller.dismiss();
  }
  async completeEvent() {
    if (
      this.event.registeredUsers.filter((usr) => usr.contributed).length > 0
    ) {
      this.event.isCompleted = true;
      this.firebase.updateEvent(this.event.id, this.event);
    } else {
      const alert = await this.alertController.create({
        header: 'No Users Marked as Contributed?',
        message:
          'Event cannot be closed without marking any user as contributed!',
        buttons: ['Ok'],
      });

      await alert.present();
    }
  }
  filterUserSess(user: User): EventDate[] {
    const filteredEvents = user.events
      ? user.events.find((e) => e.id === this.event.id)
      : undefined;
    if (filteredEvents) {
      return filteredEvents.sessions;
    } else {
      return new Array();
    }
  }
}
