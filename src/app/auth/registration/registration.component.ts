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

  }

  createUser(){
    let opt = {
      user_id: this.userId,
      username: this.userId,
      first_name: this.userFirstName,
      last_name: this.userLastName,
      photo_url: null,
      is_bot: false
    }
    this.authService.createUserById(opt).then(user => {
      if(user) {
        this.user = user;
        this.authService.currentUser.next(user);
        if(!user.user_spec[0]) this.authService.createUserSpec(this.userId).then()
        if(!user.user_exp[0]) this.authService.createUserExp({user_id: this.userId, exp: 0, curr_lvl: 0, next_lvl: 1}).then()
        if(!user.user_quests[0]) this.authService.createUserQuests({user_id: this.userId}).then()
        this.router.navigate(['home']);
      } else {
        alert('User no created, please reload bot!')
      }
    })

  }

}
