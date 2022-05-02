import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {
  photoURL: string;
  visiblep: boolean;
  visiblecp: boolean;
  googleLinked: boolean;
  facebookLinked: boolean;
  twitterLinked: boolean;
  email: string;
  displayName: string;
  phone: string;
  password: string;
  constructor(
    private router: Router,
    private firebase: FirebaseService,
    public alertController: AlertController
  ) {
    this.photoURL = '../../../assets/create_user.jpg';
  }

  ngOnInit() {}
  redirectLogin() {
    this.router.navigateByUrl('/login');
  }
  async addPhoto() {
    //TODO commit photo to firebase user profile
    const alert = await this.alertController.create({
      inputs: [{ name: 'photo', type: 'text', placeholder: 'Enter Photo URL' }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          },
        },
        {
          text: 'Ok',
          handler: (alertData) => {
            this.photoURL = alertData.photo;
          },
        },
      ],
    });
    alert.present();
  }
  googleLink() {
    //TODO link account with google
  }
  facebookLink() {
    //TODO link account with facebook
  }
  twitterLink() {
    //TODO link account with twitter
  }
  registerUser() {
    createUserWithEmailAndPassword(
      this.firebase.auth,
      this.email,
      this.password
    ).then((res) => {
      sendEmailVerification(res.user);
      this.firebase.createNewUser(
        this.email,
        this.photoURL,
        res.user.uid,
        this.displayName,
        this.phone.substring(0, 3) === '+91' ? this.phone : '+91' + this.phone
      );
    });
  }
}
