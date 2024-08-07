import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {EquipComponent} from "./equip/equip.component";
import {CharacteristicsComponent} from "./characteristics/characteristics.component";
import {ApiService} from "../services/api.service";
import {NavButtonComponent} from "./nav-button/nav-button.component";
import {async, take} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, EquipComponent, CharacteristicsComponent, NavButtonComponent, MatProgressSpinner],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy{
  authService = inject(AuthService);
  apiService = inject(ApiService);
  router = inject(Router);
  user: any;
  isLoading:boolean = false;
  userlevel:any;
  userNextLevel:any;
  dataLevel = [];
  expWidth: number = 0;

  ngOnInit() {
    this.isLoading = true;
    this.authService.currentUser.subscribe((data: any) => {
        if(data?.user_id){
          this.user = data;
          this.userLvl();
          this.isLoading = false;
          // console.log('dashboard', data, this.isLoading )
        }
      });
    this.apiService.calcLvl();
  }


  userLvl(){
      this.apiService.lvlTable.subscribe((data: any) => {
        this.dataLevel = data;
        data.find((el: any) => {
          if(this.user?.user_exp[0]?.exp >= el.exp) {
            this.userlevel = el;
          }
          if(this.userlevel.level+1 === el.level){
            this.userNextLevel = el;
          }
        });
        this.expWidth = (this.user?.user_exp[0]?.exp - this.userlevel.exp) / ((this.userNextLevel.exp - this.userlevel.exp) / 100 )
      });

  }

  userInfoPage(){
    this.router.navigate(['user-information'])
  }

  ngOnDestroy() {
    // if(this.user) this.user.destroy()
  }


}
