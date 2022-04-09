import { Component } from '@angular/core';
import { Auth } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  currentUser: Auth['currentUser'];
  constructor(private firebase: FirebaseService) {
    this.currentUser = firebase.auth.currentUser;
  }
}
