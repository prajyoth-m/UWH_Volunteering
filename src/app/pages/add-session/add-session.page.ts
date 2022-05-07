import { Component, Input, OnInit } from '@angular/core';
import { Timestamp } from '@firebase/firestore';
import { ModalController } from '@ionic/angular';
import { EventDate } from 'src/app/models/event-date';

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.page.html',
  styleUrls: ['./add-session.page.scss'],
})
export class AddSessionPage implements OnInit {
  @Input() controller: ModalController;
  @Input() sessionEdit: EventDate;
  date: string;
  icon: string;
  desc: string;
  link: string;
  session: EventDate;
  constructor() {
    this.session = new EventDate();
  }

  ngOnInit() {
    if (this.sessionEdit) {
      this.date =this.sessionEdit.date.toDate().toISOString(); //DD-MMM-YY HH:mm
      console.log(this.date);
      this.icon = this.sessionEdit.icon;
      this.link = this.sessionEdit.link;
      this.desc = this.sessionEdit.description;
    }
  }
  closeModal() {
    this.controller.dismiss(this.session);
  }

  submit() {
    this.session.description = this.desc;
    this.session.icon = this.icon;
    this.session.link = this.link;
    this.session.date = Timestamp.fromDate(new Date(this.date));
    this.closeModal();
  }
}
