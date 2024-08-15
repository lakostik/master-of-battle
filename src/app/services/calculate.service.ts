import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculateService {

  constructor() { }

  concatParameters(data: any){
    let newArr = {
      accuracy: 0,
      evasion: 0,
      attack: 0,
      defence: 0,
      reff: 0,
      critical_chance: 0,
      critical_damage: 0,
      critical_resistant: 0,
      debuff_change: 0,
      debuff_resistant: 0,
      hp: 0,
      mp: 0,
      helm_def: 0,
      armor_def:0,
      pants_def:0,
      gloves_def:0,
      boots_def: 0,
    }

    return newArr
  }
}
