import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, Location} from "@angular/common";
import {ApiService} from "../services/api.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {

  title = 'user info'
  location = inject(Location);
  apiService = inject(ApiService);
  authServices = inject(AuthService);
  user: any;

  ngOnInit(){
    let userId = this.authServices.devUserId(); // devMod
    let data = sessionStorage.getItem(userId) ? ''+sessionStorage.getItem(userId) : '';
    if(data) {
      this.user = JSON.parse(data);
    } else {
      setTimeout(() => this.ngOnInit(), 500)
    }

  }

  addExp(exp: any){
    console.log(exp)
    this.apiService.calcLvl(exp);
  }
  back(){
    this.location.back();
  }

}
