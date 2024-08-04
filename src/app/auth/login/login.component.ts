import {Component, inject, OnInit, signal} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TelegramAppService} from "../../services/telegram-app.service";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  fb = inject(FormBuilder);
  formLogin: FormGroup = this.fb.group({
    email: null,
    id: null
  });

  constructor(private authService: AuthService,
              private router: Router,
              private _fb: FormBuilder) {
  }

  user: any;


  ngOnInit(): void {

  }

}
