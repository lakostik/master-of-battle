import {inject, Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, take} from "rxjs";
import {AuthService} from "./auth.service";


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

}
