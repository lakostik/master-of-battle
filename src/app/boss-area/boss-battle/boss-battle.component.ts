import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {ApiService} from "../../services/api.service";
import {CalculateService} from "../../services/calculate.service";


@Component({
  selector: 'app-boss-battle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boss-battle.component.html',
  styleUrl: './boss-battle.component.css'
})
export class BossBattleComponent implements OnInit {
  authService = inject(AuthService)
  apiService = inject(ApiService);
  calcService = inject(CalculateService);
  usersData: any;
  firstUser: any;
  secondUser: any;

  ngOnInit() {
    let userId = this.authService.devUserId(); // devMod
    let data = JSON.parse(''+sessionStorage.getItem(userId) ? ''+sessionStorage.getItem(userId) : '');
    if(data) {
      this.firstUser = {}
      let firstCalc= this.apiService.calcUserItemsParameters(data);
      this.firstUser = this.calcService.concatParameters(data.user_spec[0], firstCalc);
      this.firstUser.name = data.username;
      this.firstUser.level = data.user_exp[0].curr_lvl;
    } else {
      setTimeout(() => this.ngOnInit(), 500)
    }
    this.authService.getUserBoss().then((boss:any) => {
      this.authService.getAllBosses(boss[0].boss_id).then((bossData: any) => {
        console.log(bossData[0])
        this.secondUser = this.calcService.concatParameters(bossData[0])
        this.secondUser.name = bossData[0].name;
        this.secondUser.level = bossData[0].level;
        console.log(this.secondUser)
      })
    })
  }

}


