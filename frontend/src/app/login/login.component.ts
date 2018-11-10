import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthService,
  FacebookLoginProvider
} from 'angular-6-social-login-v2';

import { RequestsService } from '../requests.service';
import { AppConfig } from '../config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  private ngrok_url = "https://cors.io/?https://7ace55d4.ngrok.io/";
  public prod: boolean = false;

  constructor(private router: Router,
    private socialAuthService: AuthService,
    private request: RequestsService) {

  }

  ngOnInit() {


  }

  public socialSignIn(socialPlatform: string): void {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + " sign in data : ", userData);
        sessionStorage.setItem("user_id", userData.id);
      }
    );
  }

  public signIn(): void {
    let name = (<HTMLInputElement>document.getElementById("name")).value;
    let email = (<HTMLInputElement>document.getElementById("email")).value;
    if (name=="" || email == ""){
      alert("Enter both name and email");
      return;
    }
    this.login(name, email);
  }

  public login(user_name: string, user_id: string): void {
    let url = this.ngrok_url + "login/{\"user_id\":\"" + user_id + "\",\"name\":\"" + user_name + "\"}";
    this.request.request(url).then(() => {
      sessionStorage.setItem("user_id", user_id);
      this.router.navigate(['workspace']);
    }).catch((error) => {
      console.log("Login failed");
    });

  }

}
