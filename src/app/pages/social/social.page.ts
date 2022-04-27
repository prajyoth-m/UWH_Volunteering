import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-social',
  templateUrl: './social.page.html',
  styleUrls: ['./social.page.scss'],
})
export class SocialPage implements OnInit {
  userData: User;
  editName: boolean;
  editPhone: boolean;
  editEmail: boolean;
  nameinput: string;
  emailInput: string;
  phoneInput: string;
  constructor(
    private firebase: FirebaseService,
    public alertController: AlertController
  ) {
    this.userData = new User();
    this.userData.events = new Array();
    this.editEmail = false;
    this.editPhone = false;
    this.editName = false;
  }

  ngOnInit() {}
  ionViewWillEnter() {
    this.refresh();
  }
  refresh() {
    this.userData = new User();
    this.userData.events = new Array();
    this.firebase
      .getUserByID(this.firebase.auth.currentUser.uid)
      .then((snap) => {
        const userRef = snap.data();
        Object.assign(this.userData, userRef);
      });
    this.nameinput = this.firebase.auth.currentUser.displayName;
    this.emailInput = this.firebase.auth.currentUser.email;
    this.phoneInput = this.firebase.auth.currentUser.phoneNumber;
  }
  changeName() {
    this.editName = false;
    this.firebase.updateUserProfile(this.nameinput, null);
  }
  changeEmail() {
    this.editEmail = false;
    console.log('change triggered ' + this.emailInput);
    this.firebase
      .updateUserEmail(this.emailInput)
      .then((snap) => {
        console.log(snap);
      })
      .catch(async (err) => {
        console.log(err.code);
        this.showError(err.code);
      });
  }
  changePhone() {
    this.editPhone = false;
    const verifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
      },
      this.firebase.auth
    );
    const phoneProvider = new PhoneAuthProvider(this.firebase.auth);
    phoneProvider
      .verifyPhoneNumber(
        this.phoneInput.substring(0, 3) === '+91'
          ? this.phoneInput
          : '+91' + this.phoneInput,
        verifier
      )
      .then(async (res) => {
        const alert = await this.alertController.create({
          inputs: [{ name: 'otp', type: 'number', placeholder: 'Enter OTP' }],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              },
            },
            {
              text: 'Ok',
              handler: (alertData) => {
                const cred = PhoneAuthProvider.credential(res, alertData.otp);
                this.firebase.updateUserPhoneNumber(cred).then((res) => {
                  console.log('successfully updated');
                  this.refresh();
                });
              },
            },
          ],
        });
        alert.present();
      })
      .catch((e) => {
        console.error(e);
        this.showError(e.code);
      });
  }

  async showError(code: any) {
    let errorMessage = '';
    switch (code) {
      case 'auth/email-already-in-use':
        errorMessage =
          'An account with email <strong>' +
          this.emailInput +
          '</strong> already exists! <br/><br/> Please signin using that ID or use a new one.';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage =
          'An account with phone number <strong>' +
          this.phoneInput +
          '</strong> already exists! <br/><br/> Please signin using that number or use a new one.';
        break;

      default:
        errorMessage = 'An unknown error occoured!';
        break;
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error occured while updating!',
      message: errorMessage,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
