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
    this.lvlTable.next(levels);
  }

  ngOnInit() {
    this.authService.currentUser.subscribe((data: any) => {
      this.user = data;
      // this.calcLvl()
    })
  }

  citySelect(id: number){
    if(id == 1) return 'Wincity'
    else if(id == 2) return 'Oldcity'
    else if(id == 3) return 'Suncity'
    else if(id == 4) return 'Zerocity'
    else return 'Nocity'
  }

  calcLvl(){

    this.authService.currentUser.subscribe((user: any) => {
      if(user?.user_id){
        let serviceUser: any = user;
        this.authService.getUserExp(serviceUser.user_id).then((expData:any) => {
          let experienceTable = this.lvlTable.value; // таблиця досвіду
          let currentLevel = expData[0].curr_lvl; // рівень записаний в базі =)
          let experience = expData[0].exp; // досвід користувача
          let levelsGained = 0; // Змінна для відстеження кількості рівнів, на які підвищився користувач
          let money = 0; // Змінна для грошей

          // // Підвищення рівня на основі накопиченого досвіду
          while (currentLevel < experienceTable.length - 1 && experience >= experienceTable[currentLevel + 1].exp) {
            console.log(currentLevel)
            currentLevel++;
            levelsGained++;
            money += currentLevel*5 + 10;
          }
          // Формування даних для відправки на оновлення в таблиці ЕХР
          let opt = {'curr_lvl': currentLevel, 'next_lvl': currentLevel+1, 'exp': experience}
          this.authService.patchUserExp(serviceUser.user_id, opt).then();

          // Якщо рівень піднято - добавляємо стати до існуючих і оновлюємо дані
          if(levelsGained) {
            console.log(money)
            serviceUser.user_spec[0].points += levelsGained;
            this.authService.patchUserSpec(serviceUser.user_id, {'points': serviceUser.user_spec[0].points}).then()
            this.authService.patchUserData(serviceUser.user_id, {'kar': serviceUser.kar + money}).then(data => {
              this.authService.currentUser.next(data);
            })
          }
        });
      }
    });
  }





}
