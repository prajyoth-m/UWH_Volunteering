import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Event } from 'src/app/models/event';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AddSessionPage } from '../add-session/add-session.page';
import { SelectLocationPage } from '../select-location/select-location.page';

@Component({
  selector: 'app-event-editor',
  templateUrl: './event-editor.page.html',
  styleUrls: ['./event-editor.page.scss'],
})
export class EventEditorPage implements OnInit {
  @Input() controller: ModalController;
  @Input() event: Event;
  languages: string;
  constructor(
    private firebase: FirebaseService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}
  closeModal() {
    this.controller.dismiss();
  }
  async addSessionModal() {
    const addSessionModel = await this.modalController.create({
      component: AddSessionPage,
      cssClass: 'add-event-modal',
      componentProps: {
        controller: this.modalController,
      },
    });
    addSessionModel.onDidDismiss().then(async (data) => {
      this.event.dates.push(data.data);
    });
    return await addSessionModel.present();
  }
  commitEvent() {
    this.event.sessions = this.event.dates.length.toString();
    this.firebase.updateEvent(this.event.id, this.event).then(() => {
      this.controller.dismiss();
    });
  }
  removeSession(idx: number) {
    if (idx > -1) {
      this.event.dates.splice(idx, 1);
    }
  }
  splitLanguages() {
    this.event.preferredLanguages = this.languages.split(',');
  }
  async addLocationModal() {
    const modal = await this.modalController.create({
      component: SelectLocationPage,
      cssClass: 'add-event-modal',
      componentProps: {
        controller: this.modalController,
      },
    });
    modal.onDidDismiss().then(async (data) => {
      this.event.location = data.data;
    });
    return await modal.present();
  }
  async editSession(idx: number) {
    const addSessionModel = await this.modalController.create({
      component: AddSessionPage,
      cssClass: 'edit-session-modal',
      componentProps: {
        controller: this.modalController,
        sessionEdit: this.event.dates[idx],
      },
    });
    addSessionModel.onDidDismiss().then(async (data) => {
      this.event.dates[idx] = data.data;
    });
    return await addSessionModel.present();
  }
}
