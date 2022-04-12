import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Event } from 'src/app/models/event';
import { EventDate } from 'src/app/models/event-date';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AddSessionPage } from '../add-session/add-session.page';
import { SelectLocationPage } from '../select-location/select-location.page';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
  @Input() controller: ModalController;
  eventDetails: Event;
  languages: string;
  modal: any;
  addSessionModel: any;
  constructor(
    private firebase: FirebaseService,
    private modalController: ModalController
  ) {
    this.eventDetails = new Event();
    this.eventDetails.dates = new Array<EventDate>();
  }

  async ngOnInit() {}

  closeModal() {
    this.controller.dismiss();
  }
  async addLocationModal() {
    this.modal = await this.modalController.create({
      component: SelectLocationPage,
      cssClass: 'add-event-modal',
      componentProps: {
        controller: this.modalController,
      },
    });
    this.modal.onDidDismiss().then(async (data) => {
      this.eventDetails.location = data.data;
    });
    return await this.modal.present();
  }
  async addSessionModal() {
    this.addSessionModel = await this.modalController.create({
      component: AddSessionPage,
      cssClass: 'add-event-modal',
      componentProps: {
        controller: this.modalController,
      },
    });
    this.addSessionModel.onDidDismiss().then(async (data) => {
      this.eventDetails.dates.push(data.data);
    });
    return await this.addSessionModel.present();
  }
  splitLanguages() {
    this.eventDetails.preferredLanguages = this.languages.split(',');
  }
  removeSession(idx: number) {
    if (idx > -1) {
      this.eventDetails.dates.splice(idx, 1);
    }
  }
  addEvent() {
    this.eventDetails.sessions = this.eventDetails.dates.length.toString();
    this.firebase.createEvent(this.eventDetails);
    this.closeModal();
  }
}
