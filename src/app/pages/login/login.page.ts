import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;

  constructor(private firebase: FirebaseService,private router: Router,) {}

  ngOnInit() {}

  doLogin() {
    this.firebase
      .doLogin(this.email, this.password)
      .then((data) => {
        this.router.navigateByUrl('/home');
      })
      .catch((e) => {
        console.log('Login failed');
        console.log(e.message);
      });
      console.log(this.firebase.auth.currentUser);
  }
}
