import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AddEventPage } from '../add-event/add-event.page';
import { Event } from 'src/app/models/event';
import { RegisteredPeoplePage } from '../registered-people/registered-people.page';
import { EventEditorPage } from '../event-editor/event-editor.page';

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
    this.refresh(false);
  }

  async addEventModal() {
    const modal = await this.modalController.create({
      component: AddEventPage,
      cssClass: 'add-event-modal',
      componentProps: {
        controller: this.modalController,
      },
      breakpoints: [0, 0.5, 0.75, 1],
      initialBreakpoint: 0.5,
    });
    modal.onDidDismiss().then((res) => {
      this.refresh(false);
    });
    return await modal.present();
  }
  deleteEvent(eventID: string) {
    this.firebase.deleteEvent(eventID).then((res) => {
      this.refresh(false);
    });
  }

  refresh(fetchNew: boolean) {
    this.events = new Array();
    this.firebase.getEvents().then((snap) => {
      snap.forEach((doc) => {
        const event = new Event();
        event.id = doc.id;
        Object.assign(event, doc.data());
        event.behindDate =
          event.dates.filter((el) => el.date.toDate() < new Date()).length > 0;
        this.events.push(event);
      });
    });
  }
  async registeredPeople(eventDetails: Event) {
    const peopleModal = await this.modalController.create({
      component: RegisteredPeoplePage,
      cssClass: 'registered-people-modal',
      componentProps: {
        controller: this.modalController,
        contributeEvent: eventDetails,
      },
      breakpoints: [0, 0.5, 0.75, 1],
      initialBreakpoint: 0.5,
    });
    peopleModal.onDidDismiss().then((res) => {
      this.refresh(true);
    });
    return await peopleModal.present();
  }
  async editEvent(eventEdit: Event) {
    const peopleModal = await this.modalController.create({
      component: EventEditorPage,
      cssClass: 'edit-event-modal',
      componentProps: {
        controller: this.modalController,
        event: eventEdit,
      },
      breakpoints: [0, 0.5, 0.75, 1],
      initialBreakpoint: 0.5,
    });
    peopleModal.onDidDismiss().then((res) => {
      this.refresh(true);
    });
    return await peopleModal.present();
  }
}
