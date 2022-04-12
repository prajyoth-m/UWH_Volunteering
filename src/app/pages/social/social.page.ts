import { Component, OnInit } from '@angular/core';
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
  constructor(private firebase: FirebaseService) {
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
  }
  changeName(){
    this.editName=false;
    //TODO write firebase function
  }
  changeEmail(){
    this.editEmail=false;
    //TODO write firebase function
  }
  changePhone(){
    this.editPhone=false;
    //TODO write firebase function
  }
}
