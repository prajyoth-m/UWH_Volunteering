import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  PhoneAuthProvider,
  RecaptchaVerifier,
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
  confirmPassword: string;
  passwordMissmatch: boolean;
  loading: any;
  verifier: RecaptchaVerifier;
  phoneNumberInvalid: boolean;
  constructor(
    private router: Router,
    private firebase: FirebaseService,
    public alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.photoURL = 'assets/create_user.jpg';
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
    this.verifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
      },
      this.firebase.auth
    );
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
  verifyPhone() {
    const phoneProvider = new PhoneAuthProvider(this.firebase.auth);
    phoneProvider
      .verifyPhoneNumber('+91' + this.phone, this.verifier)
      .then(async (res) => {
        this.phoneNumberInvalid = false;
        const alert = await this.alertController.create({
          inputs: [{ name: 'otp', type: 'number', placeholder: 'Enter OTP' }],
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
                const cred = PhoneAuthProvider.credential(res, alertData.otp);
                this.firebase
                  .updateUserPhoneNumber(cred)
                  .then(() => {
                    console.log('successfully updated');
                    if (!this.phoneNumberInvalid) {
                      this.router.navigateByUrl('/home');
                    }
                  })
                  .catch(async (err) => {
                    this.showError(err.code);
                  });
              },
            },
          ],
        });
        alert.present();
      })
      .catch((e) => {
        console.error(e);
        this.phoneNumberInvalid = true;
      });
  }
  async showError(errorCode: string) {
    let errMsg = '';
    let isRedirect = false;
    switch (errorCode) {
      case 'auth/account-exists-with-different-credential':
        errMsg = 'An account already exists with the provided phone number.';
        isRedirect = true;
        break;
      case 'auth/weak-password':
        errMsg =
          'Password is weak choose a combination of special characters and numbers to make it strong.';
        break;
      case 'auth/email-already-in-use':
        errMsg =
          'An account with email <strong>' +
          this.email +
          '</strong> already exists! <br/><br/> Please signin using that ID or use a new one.' +
          '<br/><br/> If you have forgotten your password or want to reset your id click on the below link';
        break;
      default:
        errMsg = 'Updating failed with error code: ' + errorCode;
        break;
    }
    const errAlert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error occured while updating!',
      message: errMsg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if (isRedirect) {
              this.router.navigateByUrl('/first-login');
            }
          },
        },
      ],
    });
    await errAlert.present();
  }
  registerUser() {
    if (this.password === this.confirmPassword) {
      this.passwordMissmatch = false;
      createUserWithEmailAndPassword(
        this.firebase.auth,
        this.email,
        this.password
      )
        .then((res) => {
          sendEmailVerification(res.user);
          this.firebase.createNewUser(
            this.email,
            this.photoURL,
            res.user.uid,
            this.displayName,
            this.phone.toString().substring(0, 3) === '+91'
              ? this.phone
              : '+91' + this.phone
          );
          this.verifyPhone();
        })
        .catch((err) => {
          this.showError(err.code);
        });
    } else {
      this.passwordMissmatch = true;
    }
  }
}
