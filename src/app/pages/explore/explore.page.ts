import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  events: Array<any>;
  constructor(private firebase: FirebaseService) {}

  ngOnInit() {
    this.events = new Array();
    this.firebase.getEvents().then((snap) => {
      snap.forEach((doc) => {
        this.events.push(doc.data());
      });
    });
  }
}
