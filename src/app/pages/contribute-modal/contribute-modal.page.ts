import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Event } from 'src/app/models/event';

@Component({
  selector: 'app-contribute-modal',
  templateUrl: './contribute-modal.page.html',
  styleUrls: ['./contribute-modal.page.scss'],
})
export class ContributeModalPage implements OnInit {
  @Input() controller: ModalController;
  @Input() contributeEvent: Event;
  constructor() {}

  ngOnInit() {}
  dismissModal() {
    this.controller.dismiss();
  }
}
