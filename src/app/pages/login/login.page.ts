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
  errorMessage: string;

  constructor(private firebase: FirebaseService, private router: Router) {}

  ngOnInit() {}

  doLogin() {
    this.firebase
      .doLogin(this.email, this.password)
      .then((data) => {
        const user = data.user;
        if (!user.displayName || !user.phoneNumber) {
          this.router.navigateByUrl('/first-login');
        } else {
          this.router.navigateByUrl('/home');
        }
      })
      .catch((e) => {
        console.error(e);
        this.errorMessage = 'Incorrect email or password provided!';
      });
  }
  inputChange() {
    this.errorMessage = undefined;
  }
}
