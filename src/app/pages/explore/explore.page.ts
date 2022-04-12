import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Event } from 'src/app/models/event';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ContributeModalPage } from '../contribute-modal/contribute-modal.page';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  events: Array<Event>;
  modal: HTMLElement;
  constructor(
    private firebase: FirebaseService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.events = new Array();
    this.firebase.getEvents().then((snap) => {
      snap.forEach((doc) => {
        const event = new Event();
        event.id = doc.id;
        Object.assign(event,doc.data());
        this.events.push(event);
      });
    });
  }

  async presentModal(event) {
    const modal = await this.modalController.create({
      component: ContributeModalPage,
      cssClass: 'contribute-modal',
      componentProps: { controller: this.modalController, contributeEvent: event },
      breakpoints: [0, 0.2, 0.5, 1],
      initialBreakpoint: 0.2,
    });
    return await modal.present();
  }
}
