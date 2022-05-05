import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  currentUser: Auth['currentUser'];
  registeredEvents: number;
  userRole: string;
  displayPic: string;
  constructor(private firebase: FirebaseService, private router: Router) {
    this.currentUser = this.firebase.auth.currentUser;
    if (!this.currentUser) {
      this.router.navigateByUrl('');
    }
    this.displayPic = this.currentUser.photoURL
      ? this.currentUser.photoURL
      : '../../../assets/avatar.svg';
  }
  ngOnInit() {
    // Add an event listener
    document.addEventListener('subscriptions', (e) => {
      console.log(e); // Prints "Example of an event"
      this.refresh();
    });
  }

  ionViewWillEnter() {
    this.refresh();
  }

  refresh() {
    this.registeredEvents = 0;
    this.firebase
      .checkUserExists(this.firebase.auth.currentUser.email)
      .then((snap) => {
        if (snap.empty) {
          this.router.navigateByUrl('/first-login');
        } else {
          this.router.navigateByUrl('/home/explore');
        }
      });
    this.firebase.getRole(this.firebase.auth.currentUser.email).then((snap) => {
      this.userRole = snap.docs.values().next().value.data().role.toLowerCase();
    });
    this.firebase
      .getUserByID(this.firebase.auth.currentUser.uid)
      .then((snap) => {
        snap.data().events.forEach((evnt) => {
          this.registeredEvents += evnt.sessions.length;
        });
      });
  }

  signOut() {
    this.firebase.auth.signOut().then((res) => {
      this.router.navigateByUrl('');
    });
  }
}
