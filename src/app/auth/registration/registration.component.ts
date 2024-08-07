import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormsModule} from "@angular/forms";
import {CommonModule, JsonPipe} from "@angular/common";
import {forkJoin, from} from "rxjs";


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
  error:string = ''

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
      is_bot: false,
      kar: 0
    }

    this.authService.createUserById(opt).then(user => {
      if(user.user_id) {
        forkJoin({
          createSpec: from(this.authService.createUserSpec(this.userId).then()),
          createExp: from(this.authService.createUserExp({user_id: this.userId, exp: 0, curr_lvl: 0, next_lvl: 1})),
          createQuests: from(this.authService.createUserQuests({user_id: this.userId}))
        }).subscribe(() => {
          this.router.navigate(['home']);
        })
      } else {
        this.error = 'User no created, please reload bot!';
      }
    })

  }

}
