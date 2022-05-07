import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.page.html',
  styleUrls: ['./first-login.page.scss'],
})
export class FirstLoginPage implements OnInit {
  displayName: string;
  phoneNumber: string;
  photo: string;
  email: string;
  currentUser: any;
  error: boolean;
  waitForPhone: boolean;
  verifier: RecaptchaVerifier;
  constructor(
    private firebase: FirebaseService,
    private router: Router,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.currentUser = this.firebase.auth.currentUser;
    this.displayName = this.currentUser.displayName;
    this.phoneNumber = this.currentUser.phoneNumber
      ? this.currentUser.phoneNumber.replace('+91', '')
      : '';
    this.email = this.currentUser.email;
    this.photo = this.currentUser.photoURL;
    this.verifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
      },
      this.firebase.auth
    );
  }

  updateProfile() {
    if (this.phoneNumber ) {
      this.waitForPhone = true;

      const phoneProvider = new PhoneAuthProvider(this.firebase.auth);
      phoneProvider
        .verifyPhoneNumber('+91' + this.phoneNumber, this.verifier)
        .then(async (res) => {
          this.error = false;
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
                      if (!this.error) {
                        this.waitForPhone = false;
                        this.router.navigateByUrl('/home');
                      }
                    })
                    .catch(async (err) => {
                      let errMsg = '';
                      switch (err.code) {
                        case 'auth/account-exists-with-different-credential':
                          errMsg =
                            'An account already exists with the provided phone number.';
                          break;

                        default:
                          errMsg =
                            'Updating mobile number failed with error code: ' +
                            err.code;
                          break;
                      }
                      const errAlert = await this.alertController.create({
                        cssClass: 'my-custom-class',
                        header: 'Error occured while updating!',
                        message: errMsg,
                        buttons: ['OK'],
                      });
                      await errAlert.present();
                    });
                },
              },
            ],
          });
          alert.present();
        })
        .catch((e) => {
          console.error(e);
          this.error = true;
          this.waitForPhone = false;
          this.router.navigateByUrl('/login');
        });
    }
    if (this.displayName) {
      this.firebase
        .updateUserProfile(this.displayName, this.photo)
        .then((res) => {
          if (!this.error && !this.waitForPhone) {
            this.router.navigateByUrl('/home');
          }
        });
    }
    try {
      this.firebase.createNewUser(
        this.email,
        this.photo,
        this.firebase.auth.currentUser.uid,
        this.displayName,
        this.phoneNumber
      );
    } catch (e) {
      console.error(e);
    }
  }
}
