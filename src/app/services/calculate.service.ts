import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CalculateService {

  constructor() { }
  addAttributes(spec: any, ) {

  }
  concatParameters(data: any, items: any = null){
    let step = 0;
    let newArr:any = {
      accuracy: 0,
      evasion: 0,
      defence: 0,
      attack: 0,
      attack_1: 0,
      attack_2: 0,
      damage: 0,
      magic_damage: 0,
      reff: 0,
      critical_chance: 0,
      critical_damage: 0,
      critical_resistant: 0,
      critical_index: 0,
      debuff_change: 0,
      debuff_resistant: 0,
      hp: 0,
      mp: 0,
      helm_def: 0,
      armor_def:0,
      pants_def:0,
      gloves_def:0,
      boots_def: 0,
      extra_damage:0,
      damage_resistant:0

    }
    if(step == 0) {
    for (let key in data) {
      if (key in newArr) {
        newArr[key] += data[key];
      }
      if(key == 'str') {
        newArr['damage'] += data[key];
        newArr['extra_damage'] += data[key]
      }
      if(key == 'agi'){
        newArr['accuracy'] += data[key]*5;
        newArr['evasion'] +=data[key]*7;
      }
      if(key == 'vit'){
        newArr['hp'] += data[key]*10;
        newArr['damage_resistant'] += data[key];
      }
      if(key == 'int'){
        newArr['critical_chance'] += data[key]*7;
        newArr['critical_resistant'] += data[key]*5;
        newArr['critical_index'] += data[key]*6;
      }
      if(key == 'men'){
        newArr['mp'] += data[key]*10;
        newArr['debuff_resistant'] += data[key];
      }
      if(key == 'ene'){
        newArr['magic_damage'] += data[key];
        newArr['debuff_change'] += data[key];
      }
    }
    step = 1;
    }
    if(step == 1) {
      for (let key in items) {
        if(key == 'bonus_bos') {
          items['str'] += items[key]*3;
          items['agi'] += items[key]*3;
          items['vit'] += items[key]*3;
          items['int'] += items[key]*3;
          items['ene'] += items[key]*3;
          items['men'] += items[key]*3;
        }
        if(key == 'bonus_boss') {
          items['str'] += items[key]*5;
          items['agi'] += items[key]*5;
          items['vit'] += items[key]*5;
          items['int'] += items[key]*5;
          items['ene'] += items[key]*5;
          items['men'] += items[key]*5;
        }
        if(key == 'bonus_bosss') {
          items['str'] += items[key]*7;
          items['agi'] += items[key]*7;
          items['vit'] += items[key]*7;
          items['int'] += items[key]*7;
          items['ene'] += items[key]*7;
          items['men'] += items[key]*7;
        }
        if(key == 'bonus_bossss') {
          items['str'] += items[key]*9;
          items['agi'] += items[key]*9;
          items['vit'] += items[key]*9;
          items['int'] += items[key]*9;
          items['ene'] += items[key]*9;
          items['men'] += items[key]*9;
        }
      }
      step = 2
    }
    if(step == 2) {
      for (let key in items) {
        if (key in newArr) {
          newArr[key] += items[key];
        } else {
          if(key == 'str') {
            newArr['damage'] += items[key];
            newArr['extra_damage'] += items[key]
          }
          if(key == 'agi'){
            newArr['accuracy'] += items[key]*5;
            newArr['evasion'] += items[key]*7;
          }
          if(key == 'vit'){
            newArr['hp'] += items[key]*10;
            newArr['damage_resistant'] += items[key];
          }
          if(key == 'int'){
            newArr['critical_chance'] += items[key]*7;
            newArr['critical_resistant'] += items[key]*5;
            newArr['critical_index'] += items[key]*6;
          }
          if(key == 'men'){
            newArr['mp'] += items[key]*10;
            newArr['debuff_resistant'] += items[key];
          }
          if(key == 'ene'){
            newArr['magic_damage'] += items[key];
            newArr['debuff_change'] += items[key];
          }
        }
      }
      step = 3
    }
    if(step == 3) {
      for (let key in items) {
        if(key == 'bonus_str'){
          newArr['extra_damage'] += items[key]
        }
        if(key == 'bonus_agi'){
          newArr['evasion'] += newArr['evasion'] / 100 * items[key];
          newArr['accuracy'] += newArr['accuracy'] / 100 * items[key];
        }
        if(key == 'bonus_vit'){
          newArr['hp'] += newArr['hp'] / 100 * items[key]
          newArr['damage_resistant'] += items[key] - 2;
        }
        if(key == 'bonus_int'){
          newArr['critical_chance'] += newArr['critical_chance'] / 100 * items[key];
          newArr['critical_resistant'] += newArr['critical_resistant'] / 100 * items[key];
        }
        if(key == 'bonus_men'){
          newArr['mp'] += newArr['mp'] / 100 * items[key];
          newArr['debuff_resistant'] += newArr['debuff_resistant'] / 100 * (items[key] - 2);
        }
        if(key == 'bonus_ene'){
          newArr['magic_damage'] += newArr['magic_damage'] / 100 * items[key];
          newArr['debuff_change'] += newArr['debuff_change'] / 100 * (items[key] - 2);
        }
        if(key == 'bonus_res'){
          newArr['accuracy'] += newArr['accuracy'] / 100 * items[key];
          newArr['critical_resistant'] += newArr['critical_resistant'] / 100 * items[key];
          newArr['debuff_resistant'] += newArr['debuff_resistant'] / 100 * items[key];
        }
        if(key == 'bonus_atk'){
          newArr['attack'] += items[key] * 5;
          newArr['hp'] += items[key] * 5
        }
        if(key == 'bonus_mag'){
          newArr['magic_damage'] += items[key] * 5;
          newArr['hp'] += items[key] * 5
        }
        if(key == 'bonus_def'){
          newArr['helm_def'] += items[key] * 5;
          newArr['armor_def'] += items[key] * 5;
          newArr['pants_def'] += items[key] * 5;
          newArr['gloves_def'] += items[key] * 5;
          newArr['boots_def'] += items[key] * 5;
          newArr['hp'] += items[key] * 5
        }

      }
    }
    console.log(newArr);
    return newArr
  }


}
