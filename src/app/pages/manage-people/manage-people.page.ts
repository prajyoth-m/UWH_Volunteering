import { Component, OnInit } from '@angular/core';
import { getDoc } from '@firebase/firestore';
import { DocumentReference } from 'firebase/firestore';
import { Badge } from 'src/app/models/badge';
import { Event } from 'src/app/models/event';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-manage-people',
  templateUrl: './manage-people.page.html',
  styleUrls: ['./manage-people.page.scss'],
})
export class ManagePeoplePage implements OnInit {
  users: Array<User>;
  role: string;
  constructor(private firebase: FirebaseService) {}
  refresh() {
    this.users = new Array<User>();
    this.firebase.getUsers().then((snap) => {
      snap.forEach((data) => {
        const userData = data.data();
        const user = new User();
        Object.assign(user, userData);
        user.id = data.id;
        user.badges = new Array();
        userData.badges.forEach((badge) => {
          this.firebase.getBadgeByID(badge).then((badgeSnap) => {
            const badgeData = badgeSnap.data();
            const nweBadge = new Badge();
            nweBadge.name = badgeData.name;
            nweBadge.photo = badgeData.photo;
            user.badges.push(nweBadge);
          });
        });
        user.events = new Array();
        userData.events.forEach((event) => {
          this.firebase.getEventByID(event).then((eventSnap) => {
            const newEvent = new Event();
            Object.assign(newEvent, eventSnap.data());
            user.events.push(newEvent);
          });
        });
        this.users.push(user);
      });
    });
  }

  ngOnInit() {
    this.refresh();
    this.firebase.getRole(this.firebase.auth.currentUser.email).then((snap) => {
      this.role = snap.docs.values().next().value.data().role.toLowerCase();
    });
  }

  deleteUser(userID: string) {
    this.firebase.deleteUser(userID).then((res) => {
      this.refresh();
    });
  }
}
