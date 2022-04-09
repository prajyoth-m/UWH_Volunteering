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
  password: string;
  confirmPass: string;
  currentUser: any;
  error: boolean;
  constructor(private firebase: FirebaseService, private router: Router) {
    this.currentUser = firebase.auth.currentUser;
  }

  ngOnInit() {}

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
      this.firebase.updateUserProfile(this.displayName, null).then((res) => {
        if (!this.error) {
          this.router.navigateByUrl('/home');
        }
      });
    }
  }
}
