import {inject, Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, take} from "rxjs";
import {AuthService} from "./auth.service";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";


@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnInit {

  lvlTable:BehaviorSubject<any> = new BehaviorSubject([])

  authService = inject(AuthService);
  user: any;

  constructor() {
    // this.authService.currentUser.subscribe(user => this.user = user);
    var levels: any[] = [];
    for(let i:number = 10; 310 >= i; i++ ) {
      let resultLvl = Math.floor(i / 10);
      let result = i % 10;
      let newresult;
      if(resultLvl > 0 && result !== 0) {
        newresult =  resultLvl * (10 * result)
      } else if(result == 0 && resultLvl !==1){
        newresult = (resultLvl-1) * 10 * 10;
      } else { newresult =  result * 10 }
      if(i != 10) {
        newresult = +newresult + levels[i-11].exp
      }
      levels.push({level: i-10, exp: newresult});
    }
    console.log(levels)
    this.lvlTable.next(levels);
  }

  ngOnInit() {
    let userId = this.authService.devUserId(); // devMod
    let data = sessionStorage.getItem(userId) ? ''+sessionStorage.getItem(userId) : '';
    if(data) this.user = JSON.parse(data);
  }

  citySelect(id: number){
    if(id == 1) return 'Wincity'
    else if(id == 2) return 'Oldcity'
    else if(id == 3) return 'Suncity'
    else if(id == 4) return 'Zerocity'
    else return 'Nocity'
  }

  async calcLvl(newExp: any = 0){
    let user: any;
    let userId = this.authService.devUserId(); // devMod
    let data = sessionStorage.getItem(userId) ? ''+sessionStorage.getItem(userId) : '';
    if(data) {
      user = JSON.parse(data);
    }
    if(user?.user_id && (newExp > 0)){
        let experienceTable = this.lvlTable.value; // таблиця досвіду
        let currentLevel = user.user_exp[0].curr_lvl; // рівень записаний в базі =)
        let experience = user.user_exp[0].exp + newExp; // досвід користувача
        let levelsGained = 0; // Змінна для відстеження кількості рівнів, на які підвищився користувач
        let money = 0; // Змінна для грошей

        //  Підвищення рівня на основі накопиченого досвіду
        while (currentLevel < experienceTable.length - 1 && experience >= experienceTable[currentLevel + 1].exp) {
          currentLevel++;
          levelsGained++;
          money += currentLevel*5 + 10;
        }
        let opt = {'curr_lvl': currentLevel, 'next_lvl': currentLevel+1, 'exp': experience}
        try {
          await this.authService.patchUserExp(user.user_id, opt);

          if (levelsGained) {
            user.user_spec[0].points += levelsGained;
            await this.authService.patchUserSpec(user.user_id, { 'points': user.user_spec[0].points });
            await this.authService.patchUserData(user.user_id, { 'kar': user.kar + money });
          } else {
            await this.authService.patchUserData(user.user_id, { 'kar': user.kar + money }).then()
          }
        } catch (error) {
          console.error('Error updating user data:', error);
        }
    }
  }

  calcUserItemsParameters(user: any){
      let itemsData: any;
      let newDataCharacteristic = {
        accuracy: 0,
        evasion: 0,
        attack: 0,
        attack_1: 0,
        attack_2: 0,
        defence: 0,
        reff: 0,
        critical_chance: 0,
        critical_damage: 0,
        critical_resistant: 0,
        damage_resistant: 0,
        debuff_change: 0,
        debuff_resistant: 0,
        extra_damage: 0,
        extra_defence: 0,
        helm_def: 0,
        armor_def:0,
        pants_def:0,
        gloves_def:0,
        boots_def: 0,
        hp: 0,
        mp: 0,
        agi: 0,
        int: 0,
        ene: 0,
        men: 0,
        str: 0,
        vit: 0,
        bonus_agi: 0,
        bonus_str: 0,
        bonus_vit: 0,
        bonus_int: 0,
        bonus_ene: 0,
        bonus_men: 0,
        bonus_atk: 0,
        bonus_def: 0,
        bonus_mag: 0,
        bonus_res: 0,
        bonus_bos: 0,
        bonus_boss: 0,
        bonus_bosss: 0,
        bonus_bossss: 0
      }
      itemsData = user.user_items.filter((item: any) => {
        if(item.equipped) {
          if(item.type == 'helm'){
            newDataCharacteristic['helm_def'] += item.defence;
          } else if (item.type == 'pants'){
            newDataCharacteristic['pants_def'] += item.defence;
          }else if (item.type == 'boots'){
            newDataCharacteristic['boots_def'] += item.defence;
          }else if (item.type == 'armor'){
            newDataCharacteristic['armor_def'] += item.defence;
          }else if (item.type == 'gloves'){
            newDataCharacteristic['gloves_def'] += item.defence;
          }else if (item.type == 'shield' || item.type == 'symbol'){
            newDataCharacteristic['helm_def'] += item.defence;
            newDataCharacteristic['armor_def'] += item.defence;
            newDataCharacteristic['pants_def'] += item.defence;
            newDataCharacteristic['boots_def'] += item.defence;
            newDataCharacteristic['gloves_def'] += item.defence;
          } else if(item.type == 'ring' || item.type == 'earrings' || item.type == 'necklaces') {
            newDataCharacteristic['helm_def'] += item.defence;
            newDataCharacteristic['armor_def'] += item.defence;
            newDataCharacteristic['pants_def'] += item.defence;
            newDataCharacteristic['boots_def'] += item.defence;
            newDataCharacteristic['gloves_def'] += item.defence;
            newDataCharacteristic['attack'] += item.attack;
          }
          if(item.accuracy)newDataCharacteristic['accuracy'] += item.accuracy
          if(item.attack && item.slot == 1 && item.type == 'weapon')newDataCharacteristic['attack_1'] += item.attack
          if(item.attack && item.slot == 2 && item.type == 'weapon')newDataCharacteristic['attack_2'] += item.attack
          if(item.reff)newDataCharacteristic['reff'] += item.reff
          if(item.bonus_agi)newDataCharacteristic['bonus_agi'] += item.bonus_agi
          if(item.bonus_str)newDataCharacteristic['bonus_str'] += item.bonus_str
          if(item.bonus_vit)newDataCharacteristic['bonus_vit'] += item.bonus_vit
          if(item.bonus_int)newDataCharacteristic['bonus_int'] += item.bonus_int
          if(item.bonus_ene)newDataCharacteristic['bonus_ene'] += item.bonus_ene
          if(item.bonus_men)newDataCharacteristic['bonus_men'] += item.bonus_men
          if(item.bonus_atk)newDataCharacteristic['bonus_atk'] += item.bonus_atk
          if(item.bonus_def)newDataCharacteristic['bonus_def'] += item.bonus_def
          if(item.bonus_mag)newDataCharacteristic['bonus_mag'] += item.bonus_mag
          if(item.bonus_res)newDataCharacteristic['bonus_res'] += item.bonus_res
          if(item.critical_chance)newDataCharacteristic['critical_chance'] += item.critical_chance
          if(item.critical_damage)newDataCharacteristic['critical_damage'] += item.critical_damage
          if(item.critical_resistant)newDataCharacteristic['critical_resistant'] += item.critical_resistant
          if(item.damage_resistant)newDataCharacteristic['damage_resistant'] += item.damage_resistant
          if(item.debuff_change)newDataCharacteristic['debuff_change'] += item.debuff_change
          if(item.debuff_resistant)newDataCharacteristic['debuff_resistant'] += item.debuff_resistant
          if(item.evasion)newDataCharacteristic['evasion'] += item.evasion
          if(item.extra_damage)newDataCharacteristic['extra_damage'] += item.extra_damage
          if(item.extra_defence)newDataCharacteristic['extra_defence'] += item.extra_defence
          if(item.hp)newDataCharacteristic['hp'] += item.hp
          if(item.mp)newDataCharacteristic['mp'] += item.mp
          if(item.str)newDataCharacteristic['str'] += item.str
          if(item.agi)newDataCharacteristic['agi'] += item.agi
          if(item.vit)newDataCharacteristic['vit'] += item.vit
          if(item.int)newDataCharacteristic['int'] += item.int
          if(item.men)newDataCharacteristic['men'] += item.men
          if(item.ene)newDataCharacteristic['ene'] += item.ene
          if(item.bonus_bos)newDataCharacteristic['bonus_bos'] += item.bonus_bos
          if(item.bonus_boss)newDataCharacteristic['bonus_boss'] += item.bonus_boss
          if(item.bonus_bosss)newDataCharacteristic['bonus_bosss'] += item.bonus_bosss
          if(item.bonus_bossss)newDataCharacteristic['bonus_bossss'] += item.bonus_bossss

        }
      })
    // newDataCharacteristic = this.updateCharacteristicsFromItems(newDataCharacteristic, itemsData);
    console.log(newDataCharacteristic);
      return newDataCharacteristic
  }

}
