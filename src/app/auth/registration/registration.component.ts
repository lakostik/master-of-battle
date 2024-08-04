import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormsModule} from "@angular/forms";
import {CommonModule, JsonPipe} from "@angular/common";


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {

  userFirstName = window?.Telegram?.WebApp?.initDataUnsafe?.user?.first_name;
  userLastName = window?.Telegram?.WebApp?.initDataUnsafe?.user?.last_name;
  userId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  user:any;
  step: number = 1;
  nikname:string = '';
  gender:string = 'male'
  usernameError = '';

  constructor(private authService: AuthService,
              private router: Router,
              private _fb: FormBuilder) {
  }

  ngOnInit() {
    console.log('registration page');
  }

  createUser(){
    this.authService.createUserById(this.userId, '',
    this.userFirstName,
    this.userLastName,
    '',
    false, this.randomCity()).then(user => {
      if(user) {
        this.user = user;
        this.authService.currentUser.next(user);
        this.step = 2;
      } else {
        alert('User no created, please reload bot!')
      }
    })
    this.authService.getUserSpec(this.userId).then((data) => {
      if(data == null) {
        this.authService.createUserSpec(this.userId).then()
      }
    })

  }

  updateUser(){
    let opt = { gender: this.gender, username: this.nikname };
    this.authService.patchUserData(this.userId, opt).then(user => {
      this.usernameError = '';
      if(user.username == this.nikname) {
        this.authService.currentUser.next(user);
        this.router.navigate(['/dashboard']);
      } else {
        this.usernameError = 'This nickname is already taken';
      }

    })
  }

  randomCity(){
    return Math.floor(Math.random() * 4) + 1;
  }

}
