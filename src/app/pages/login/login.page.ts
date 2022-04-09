import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { getRedirectResult } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  errorMessage: string;
  loading: any;

  constructor(
    private firebase: FirebaseService,
    private router: Router,
    private loadingController: LoadingController
  ) {

  }

  async ngOnInit() {
    this.loading = await this.loadingController.create({
      cssClass: 'loader',
      message: 'Please wait while we fetch your login details...',
    });
    this.presentLoading();
    getRedirectResult(this.firebase.auth)
      .then((data) => {
        this.loading.dismiss();
        const user = data.user;
        this.navigate(user);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  doLogin() {
    this.firebase
      .doLogin(this.email, this.password)
      .then((data) => {
        const user = data.user;
        this.navigate(user);
      })
      .catch((e) => {
        console.error(e);
        this.errorMessage = 'Incorrect email or password provided!';
      });
  }
  inputChange() {
    this.errorMessage = undefined;
  }
  googleLogin() {
    this.firebase.doGoogleLogin();
  }
  facebookLogin() {
    this.firebase.doFacebookLogin();
  }
  twitterLogin() {
    this.firebase.doTwitterLogin();
  }

  navigate(user: any) {
    if (!user.displayName || !user.phoneNumber) {
      this.router.navigateByUrl('/first-login');
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  async presentLoading() {
    await this.loading.present();
  }
}
