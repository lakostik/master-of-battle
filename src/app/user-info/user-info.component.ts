import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, Location} from "@angular/common";
import {ApiService} from "../services/api.service";
import {AuthService} from "../services/auth.service";
import {CalculateService} from "../services/calculate.service";

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {

  title = 'Characteristics'
  location = inject(Location);
  apiService = inject(ApiService);
  authService = inject(AuthService);
  calcService = inject(CalculateService)
  user: any;
  charShowBnt = false;
  itemData: any;

  ngOnInit(){
    let userId = this.authService.devUserId(); // devMod
    let data = sessionStorage.getItem(userId) ? ''+sessionStorage.getItem(userId) : '';
    if(data) {
      this.user = JSON.parse(data);
      this.itemData = this.calcService.calcUserItemsParameters(this.user);
    } else {
      setTimeout(() => this.ngOnInit(), 500)
    }

  }


  addStat(name: string){
    if(this.user.user_spec.points > 0) {
      this.charShowBnt = true;
      this.user.user_spec[name] = this.user.user_spec[name] + 1;
      this.user.user_spec.points = this.user.user_spec.points - 1;
    }
  }

  saveChr(){
    const data = this.user.user_spec;
    this.authService.patchUserSpec(this.user.user_id, data).then((spec) => {
      this.user.user_spec = spec;
      sessionStorage.setItem(this.user.user_id, JSON.stringify(this.user));
      this.charShowBnt = false;
    })
  }

  cancelChr() {
    this.authService.getUserSpec(this.user.user_id).then((spec) => {
      this.user.user_spec = spec;
      sessionStorage.setItem(this.user.user_id, JSON.stringify(this.user));
      this.charShowBnt = false;
    })
  }

  addExp(exp: any){
    console.log(exp)
    this.apiService.calcLvl(exp);
  }
  back(){
    this.location.back();
  }

}
