import {inject, Injectable} from '@angular/core';
import {AuthService} from "./auth.service";


@Injectable({
  providedIn: 'root'
})
export class CalculateService {


  constructor() { }

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

    return newDataCharacteristic
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
    return newArr
  }

  battleBegin(userAtk:any, userDef:any, type: any, atk: any ){
    let data: any = [];
    let evasion = userDef.evasion - userAtk.accuracy;
    if(evasion > 0) {
      let eva = evasion / (userAtk.level / 10);
      if(eva > 100) {
        eva = 95;
        const randomNumber = Math.floor(Math.random() * 101);
        if(eva >= randomNumber) {
          data = [userAtk, userDef, 0, 0, 1]
        } else this.calcDamage(userAtk, userDef, type, atk);
      }
    } else {
      data = this.calcDamage(userAtk, userDef, type, atk);
    }
    return data

  }

  calcDamage(userAtk: any,userDef:any, type:any, atk:any){
    let data: any;
    let damage:number = 0;
        damage += Math.floor(Math.random() * (userAtk.damage * 2 - userAtk.damage + 1)) + userAtk.damage;
        damage += userAtk.attack;
        damage += type == 1 ? userAtk.attack_1 : userAtk.attack_2;
    let extra = userAtk.extra_damage - userDef.damage_resistant;

    if(extra > 0) damage += Math.floor((damage / 100) * extra);
    else damage = damage - Math.floor((damage / 100) * extra);

    if(atk == 1) damage -= userDef.helm_def + userDef.defence
    if(atk == 2) damage -= userDef.armor_def + userDef.defence
    if(atk == 3) damage -= userDef.pants_def + userDef.defence
    if(atk == 4) damage -= userDef.boots_def + userDef.defence
    if(atk == 5) damage -= userDef.gloves_def + userDef.defence
    data = this.criticalFn(damage, userAtk, userDef);
    return data;
  }

  criticalFn(damage:any, userAtk:any, userDef:any){
    let data: any;
    let critChn = userAtk.critical_chance - userDef.critical_resistant;
    if(critChn > 0) {
      let cri = critChn / (userAtk.level / 10);
      if(cri > 100) {
        cri = 95;
        const randomNumber = Math.floor(Math.random() * 101);
        if (cri >= randomNumber) {
          damage = damage * (userAtk.critical_index/100) + userAtk.critical_damage;
          data = [userAtk, userDef, Math.floor(damage), 1, 0];
        }
      }
    } else data = [userAtk, userDef, damage, 0, 0];
    return data;
  }


}
