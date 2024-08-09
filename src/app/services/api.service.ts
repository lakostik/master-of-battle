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
    let data = sessionStorage.getItem('userData') ? ''+sessionStorage.getItem('userData') : '';
    this.user = JSON.parse(data);
  }

  citySelect(id: number){
    if(id == 1) return 'Wincity'
    else if(id == 2) return 'Oldcity'
    else if(id == 3) return 'Suncity'
    else if(id == 4) return 'Zerocity'
    else return 'Nocity'
  }

  calcLvl(){
    // let data = sessionStorage.getItem('userData') ? ''+sessionStorage.getItem('userData') : '';
    // this.user = JSON.parse(data);

    if(this.user?.user_id){
      this.logoptLvl(this.user, this.user.user_exp)
    }
  }

  logoptLvl(serviceUser: any, expData: any){
    let oldData = localStorage.getItem('user_exp');
    if(oldData){                              // перевірка чи є в локалСтореджі запис по досвіду
      let oldExp = JSON.parse(oldData);       // Розпашуємо його в обєкт
      if(oldExp.exp !== expData[0].exp) {     // перевірка чи старий ( записаний досвід ) відрізняється від того що прийшов
        localStorage.removeItem('user_exp');
        let experienceTable = this.lvlTable.value; // таблиця досвіду
        let currentLevel = expData[0].curr_lvl; // рівень записаний в базі =)
        let experience = expData[0].exp; // досвід користувача
        let levelsGained = 0; // Змінна для відстеження кількості рівнів, на які підвищився користувач
        let money = 0; // Змінна для грошей

        // // Підвищення рівня на основі накопиченого досвіду
        while (currentLevel < experienceTable.length - 1 && experience >= experienceTable[currentLevel + 1].exp) {
          currentLevel++;
          levelsGained++;
          money += currentLevel*5 + 10;
        }
        // Формування даних для відправки на оновлення в таблиці ЕХР
        let opt = {'curr_lvl': currentLevel, 'next_lvl': currentLevel+1, 'exp': experience}
        this.authService.patchUserExp(serviceUser.user_id, opt).then( () => {
          localStorage.setItem('user_exp', JSON.stringify(serviceUser.user_exp[0]));
        });

        // Якщо рівень піднято - добавляємо стати до існуючих і оновлюємо дані
        if(levelsGained) {
          serviceUser.user_spec[0].points += levelsGained;
          this.authService.patchUserSpec(serviceUser.user_id, {'points': serviceUser.user_spec[0].points}).then()
          this.authService.patchUserData(serviceUser.user_id, {'kar': serviceUser.kar + money}).then()
        }
      }
    } else {    // по логіці якщо перша загрузка то ми просто записуємо досвід в локалСторедж
      localStorage.setItem('user_exp', JSON.stringify(serviceUser.user_exp[0]));
    }



  }





}
