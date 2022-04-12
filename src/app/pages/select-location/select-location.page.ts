import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventLocation } from 'src/app/models/event-location';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.page.html',
  styleUrls: ['./select-location.page.scss'],
})
export class SelectLocationPage implements OnInit {
  @Input() controller: ModalController;
  location: EventLocation;
  constructor() {
    this.location = new EventLocation();
  }

  ngOnInit() {}
  closeModal() {
    this.controller.dismiss(this.location);
  }
}
