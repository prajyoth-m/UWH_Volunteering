import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth';
import { Router } from '@angular/router';

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
  constructor(private firebase: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.firebase.auth.currentUser;
    this.displayName = this.currentUser.displayName;
    this.phoneNumber = this.currentUser.phoneNumber
      ? this.currentUser.phoneNumber.replace('+91', '')
      : '';
    this.email = this.currentUser.email;
    this.photo = this.currentUser.photoURL;
  }

  updateProfile() {
    if (this.phoneNumber) {
      const verifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
        },
        this.firebase.auth
      );
      const phoneProvider = new PhoneAuthProvider(this.firebase.auth);
      phoneProvider
        .verifyPhoneNumber('+91' + this.phoneNumber, verifier)
        .then((res) => {
          this.error = false;
          const code = window.prompt('Enter the OTP');
          const cred = PhoneAuthProvider.credential(res, code);
          this.firebase.updateUserPhoneNumber(cred).then((resp) => {
            if (!this.displayName && !this.error) {
              this.router.navigateByUrl('/home');
            }
          });
        })
        .catch((e) => {
          console.error(e);
          this.error = true;
        });
    }
    if (this.displayName) {
      this.firebase.updateUserProfile(this.displayName, this.photo).then((res) => {
        if (!this.error) {
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
