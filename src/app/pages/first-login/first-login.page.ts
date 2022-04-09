import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { RecaptchaVerifier } from 'firebase/auth';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.page.html',
  styleUrls: ['./first-login.page.scss'],
})
export class FirstLoginPage implements OnInit {
  recaptchaVerifier: RecaptchaVerifier;
  displayName: string;
  constructor(private firebase: FirebaseService,) {
    this.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {},
      firebase.auth
    );
  }

  ngOnInit() {}

  updateProfile() {}
}
