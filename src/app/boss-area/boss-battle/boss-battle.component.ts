import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {ApiService} from "../../services/api.service";
import {CalculateService} from "../../services/calculate.service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../../environments/environment.development";


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
  user: any;
  firstUser: any;
  secondUser: any;

  eQshield = 0;
  eQtwoWeapon = 0;
  battleForm: FormGroup<any>;

  battle_id: number = 0;
  step: number = 0;

  dataBattleTime:any = [];
  damageresult: number = 0;
  private supabase: SupabaseClient;


  constructor(private _fb: FormBuilder) {
    this.battleForm = this._fb.group({})
    this.supabase = createClient(environment.supa_url, environment.supa_anon_key);
  }

  supaSubs(){
    this.supabase
      .channel('user-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_actions_result', filter: 'battle_id=eq.'+this.battle_id }, (payload) => {
        this.dataBattleTime.unshift(payload.new)
        this.damageResult()
      })
      .subscribe();
  }


  ngOnInit() {
    let userId = this.authService.devUserId(); // devMod
    let data = JSON.parse(''+sessionStorage.getItem(userId) ? ''+sessionStorage.getItem(userId) : '');
    if(data) {
      this.user = data;
      let firstCalc= this.calcService.calcUserItemsParameters(data);
      this.firstUser = this.calcService.concatParameters(data.user_spec, firstCalc);
      this.firstUser.name = data.username;
      this.firstUser.level = data.user_exp.curr_lvl;
      this.firstUser.mp = Math.floor(this.firstUser.mp);
      this.firstUser.hp = Math.floor(this.firstUser.hp);
    } else {
      setTimeout(() => this.ngOnInit(), 500)
    }
    this.authService.getUserBoss().then((battle:any) => {
      this.battle_id = battle[0].id;
      this.supaSubs();
      this.authService.getUserActionsResult(battle[0].id).then((data:any) => {
        if(data) this.dataBattleTime = data;this.damageResult();this.step = this.dataBattleTime.length ? this.dataBattleTime[this.dataBattleTime.length - 1].step : 0;
      })
      this.authService.getAllBosses(battle[0].boss_id).then((bossData: any) => {
        this.secondUser = this.calcService.concatParameters(bossData[0])
        this.secondUser.name = bossData[0].name;
        this.secondUser.level = bossData[0].level;
        this.secondUser.boss_id = battle[0].boss_id;
      })
    });
    this.authService.getUserItems().then((data: any) => {
      data.find((el:any) => {
        if(el.type == 'shield' && el.equipped) this.eQshield = 1;
        if(el.type == 'weapon' && el.equipped && el.slot == 2) this.eQtwoWeapon = 1;
      })
    });
    this.battleForm = this._fb.group({
      attack1: [null, Validators.required],
      attack2: [null, Validators.required],
      defence: [null, Validators.required]
    })
  }

  damageResult(){
    this.dataBattleTime.filter((el:any) => {
      this.damageresult += el.damage
    })
  }

  startStrike(){
    console.log(this.battleForm.value)
    this.step += 1;
    let def = this.battleForm.get('defence')?.value;
    let atk1 = this.battleForm.get('attack1')?.value;
    let atk2 = this.battleForm.get('attack2')?.value;
    let opt = {
      action_def: def,
      attack1: atk1,
      attack2: atk2,
      type: 'user',
      user_id: this.user.user_id,
      step: this.step,
      battle_id: this.battle_id,
      def_type: this.eQshield
    }

    this.authService.createUserBossAction(opt).then(() => {
      setTimeout(() => {
        this.imitationBossAttack();
      }, 500)

    })
  }

  trackData(data: any){
    console.log(data)
  }

  imitationBossAttack(){
    let opt = {
      action_def:  Math.floor(Math.random() * 5) + 1,
      attack1:  Math.floor(Math.random() * 5) + 1,
      user_id: this.secondUser.boss_id,
      step: this.step,
      type: 'boss',
      battle_id: this.battle_id
    }
    this.authService.createUserBossAction(opt).then()
  }

}


