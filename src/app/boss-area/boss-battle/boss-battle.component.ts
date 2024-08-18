import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {ApiService} from "../../services/api.service";
import {CalculateService} from "../../services/calculate.service";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";


@Component({
  selector: 'app-boss-battle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  userItem: any;
  eQshield = false;
  eQtwoWeapon = false;
  // private fb = inject(FormBuilder)
  battleForm: FormGroup<any>;

  constructor(private _fb: FormBuilder) {
    this.battleForm = this._fb.group({})
  }

  ngOnInit() {
    let userId = this.authService.devUserId(); // devMod
    let data = JSON.parse(''+sessionStorage.getItem(userId) ? ''+sessionStorage.getItem(userId) : '');
    if(data) {
      let firstCalc= this.apiService.calcUserItemsParameters(data);
      this.firstUser = this.calcService.concatParameters(data.user_spec[0], firstCalc);
      this.firstUser.name = data.username;
      this.firstUser.level = data.user_exp[0].curr_lvl;
      this.firstUser.mp = Math.floor(this.firstUser.mp);
      this.firstUser.hp = Math.floor(this.firstUser.hp);
    } else {
      setTimeout(() => this.ngOnInit(), 500)
    }
    this.authService.getUserBoss().then((boss:any) => {
      this.authService.getAllBosses(boss[0].boss_id).then((bossData: any) => {
        this.secondUser = this.calcService.concatParameters(bossData[0])
        this.secondUser.name = bossData[0].name;
        this.secondUser.level = bossData[0].level;
        console.log(this.secondUser)
      })
    });
    this.authService.getUserItems().then((data: any) => {
      console.log(data)
      data.find((el:any) => {
        if(el.type == 'shield' && el.equipped) this.eQshield = true;
        if(el.type == 'weapon' && el.equipped && el.slot == 2) this.eQtwoWeapon = true;
      })

    });
    this.battleForm = this._fb.group({
      attack1: null,
      attack2: null,
      defence: null
    })

  }

  startStrike(){
    console.log(this.battleForm.value)
  }

}


