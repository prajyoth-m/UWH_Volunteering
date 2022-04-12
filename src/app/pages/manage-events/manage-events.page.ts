import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AddEventPage } from '../add-event/add-event.page';
import { Event } from 'src/app/models/event';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.page.html',
  styleUrls: ['./manage-events.page.scss'],
})
export class ManageEventsPage implements OnInit {
  events: Array<Event>;
  modal: HTMLElement;
  constructor(
    private firebase: FirebaseService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.refresh();
  }

  async addEventModal() {
    const modal = await this.modalController.create({
      component: AddEventPage,
      cssClass: 'add-event-modal',
      componentProps: {
        controller: this.modalController,
      },
      breakpoints: [0, 0.2, 0.5, 1],
      initialBreakpoint: 0.2,
    });
    modal.onDidDismiss().then((res) => {
      this.refresh();
    });
    return await modal.present();
  }
  deleteEvent(eventID: string) {
    this.firebase.deleteEvent(eventID).then((res) => {
      this.refresh();
    });
  }

  refresh() {
    this.events = new Array();
    this.firebase.getEvents().then((snap) => {
      snap.forEach((doc) => {
        const event = new Event();
        event.id = doc.id;
        Object.assign(event, doc.data());
        this.events.push(event);
      });
    });
  }
}
