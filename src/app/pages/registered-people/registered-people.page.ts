import { Component, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Event } from 'src/app/models/event';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-registered-people',
  templateUrl: './registered-people.page.html',
  styleUrls: ['./registered-people.page.scss'],
})
export class RegisteredPeoplePage implements OnInit {
  @Input() controller: ModalController;
  @Input() contributeEvent: Event;
  @Output() finalEvent: Event;

  constructor(
    private firebase: FirebaseService,
    public alertController: AlertController
  ) {}

  ngOnInit() {}
  dismissModal() {
    this.controller.dismiss();
  }
  removeUser(user: User) {
    this.contributeEvent.registeredUsers.find(
      (usr) => usr.id === user.id
    ).approved = false;
  }
  approveUser(user: User) {
    this.contributeEvent.registeredUsers.find(
      (usr) => usr.id === user.id
    ).approved = true;
  }
  commitData() {
    this.firebase
      .updateEvent(this.contributeEvent.id, this.contributeEvent)
      .then((res) => {
        this.controller.dismiss();
      })
      .catch(async (err) => {
        const errAlert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Error occured while updating!',
          message: 'Update Failed with error code ' + err.code,
          buttons: [
            {
              text: 'OK',
            },
          ],
        });
        await errAlert.present();
      });
  }
}
