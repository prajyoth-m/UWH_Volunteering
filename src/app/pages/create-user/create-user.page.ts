import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
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
  loading: any;
  constructor(
    private router: Router,
    private firebase: FirebaseService,
    public alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.photoURL = '../../../assets/create_user.jpg';
  }

  async ngOnInit() {
    this.loading = await this.loadingController.create({
      cssClass: 'loader',
      message: 'Please wait while we fetch your login details...',
    });
    await this.loading.present();
    getRedirectResult(this.firebase.auth)
      .then((data) => {
        this.loading.dismiss();
        const user = data.user;
        this.navigate(user);
      })
      .catch((e) => {
        this.loading.dismiss();
        console.error(e);
      });
  }

  navigate(user: any) {
    if (!user.displayName || !user.phoneNumber) {
      this.router.navigateByUrl('/first-login');
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  redirectLogin() {
    this.router.navigateByUrl('/login');
  }
  async addPhoto() {
    const alert = await this.alertController.create({
      inputs: [{ name: 'photo', type: 'text', placeholder: 'Enter Photo URL' }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
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
    this.firebase.doGoogleLogin();
  }
  facebookLink() {
    this.firebase.doFacebookLogin();
  }
  twitterLink() {
    this.firebase.doTwitterLogin();
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
