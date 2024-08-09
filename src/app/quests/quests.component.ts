import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, Location } from '@angular/common';
import {AuthService} from '../services/auth.service';
import {SafeHtmlPipe} from "../pipe/safe-html.pipe";
import moment from 'moment'
import {forkJoin, from, take} from "rxjs";



@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe,],
  templateUrl: './quests.component.html',
  styleUrl: './quests.component.css'
})
export class QuestsComponent implements OnInit {

  title = 'Quests'
  location = inject(Location);
  authServices = inject(AuthService)
  quests:any[] = [];
  user: any;

  constructor() {
  }

  ngOnInit() {
    this.initQuests();

  }

  initQuests(){
    this.authServices.getQuests().then((quests: any) => {
      this.quests = quests;
      this.authServices.currentUser.subscribe((user: any) => {
        this.user = user;
        if(user?.user_id) {
          if(!this.user?.user_quests[0]?.time) {
            this.authServices.patchUserQuests(this.user.user_id, { time: moment(new Date(), 'YYYY-MM-DD')}).then()
          }
          const oldDay = moment(this.user.user_quests[0].time,'YYYY-MM-DD');
          const currDay = moment(new Date(), 'YYYY-MM-DD');
          const diffDate = currDay.diff(oldDay, 'days');
          console.log(diffDate)
          if(diffDate > 0) {
            this.authServices.patchUserQuests(this.user.user_id, {arr_d: [], time: moment(new Date(), 'YYYY-MM-DD')}).then((data) => {
              this.user.user_quests = data;
              this.initQuests();
            })
          } else {this.checkQq()}
        }
      })
    })
  }

  checkQq(){
    this.quests.find((el: any) => {
      let newArr: any = [];
          newArr = newArr.concat(this.user.user_quests[0]?.arr_d.concat(this.user.user_quests[0]?.arr_s));
      newArr.filter((id: any) => {
        if(id == el.id) el.ready = true
      })
      if(!el.ready) this.getActivQq(el);
    });
  }

  getActivQq(qq:any){
    this.authServices.getQuestAction(this.user.user_id, qq.id).then(data => {
      if(data){
        this.actionsQq(qq, data[0]);
        qq.status = 'progress';
      }
    })
  }

  start(qq:any){
    qq.status = 'progress';
    console.log(qq)
    let endDate = qq.interval ? new Date(Date.now() + qq.interval * 60 * 1000) : new Date(Date.now());
    let opt = {user_id: this.user.user_id, quest_id: qq.id, startDate: new Date(Date.now()), timer: qq.interval, endDate: endDate}
    this.authServices.createQuestAction(opt).then(result => {
      console.log(result)
      if(qq.interval) {
        this.startTimer(qq, result);
      }
    })
  }

  back(){
    this.location.back();
  }

  actionsQq(qq:any, data: any){
    if(data.timer) {
      this.startTimer(qq, data);
    }
  }

  startTimer(qq:any, actionQq: any) {
    const timer: any = []
    timer['time'+qq.id] = setInterval(() =>{
      const now: any = new Date(Date.now());
      const newEndDate:any = new Date(actionQq.endDate);
      const timeRemaining = newEndDate - now;
      if(timeRemaining < 0) qq.status = 'reward'

      let hours:any = Math.floor(timeRemaining / (1000* 3600));
      let minutes:any = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      let seconds:any = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      qq.timer = hours + ":" + minutes + ":" + seconds;

      if (timeRemaining < 0) {
        clearInterval(timer['time'+qq.id]);
        qq.status = 'reward';
      }
    }, 1000);

  }

  rewardQq(qq: any){
    let arr_d = this.user.user_quests[0].arr_d; // массив дейлі квестів
    let arr_s = this.user.user_quests[0].arr_s; // массив спец квестів
    if(qq.special) arr_s.push(qq.id)            // якщо true в qq.special, добавляємо айді нового квесту
    else arr_d.push(qq.id);                     // в іншому випадку формуємо массив дейлі квестів

    let opt = qq.special ? {arr_s: arr_s} : {arr_d: arr_d}    // формування оновлення данних для Юзер квестів
    this.user.kar += qq.kar + this.user.user_exp[0].curr_lvl;                         // Додаю нагороду за квест (Кар)
    this.user.user_exp[0].exp += qq.exp + (5 * this.user.user_exp[0].curr_lvl);       // Додаю нагороду за квест (ЕХР)
    // Обєднав всі запити в один
    forkJoin({
      userQuest: from(this.authServices.patchUserQuests(this.user.user_id, opt)),
      userData: from(this.authServices.patchUserData(this.user.user_id, {'kar': this.user.kar})),
      userExp: from(this.authServices.patchUserExp(this.user.user_id, {'exp': this.user.user_exp[0].exp})),
      clearQuest: from(this.authServices.deleteQuestAction(this.user.user_id, qq.id))
    }).subscribe({
      next: ({userQuest, userData, userExp, clearQuest}) => {
        qq.ready = true;                            // добавляю квесту маркер про його закінчення
        // this.authServices.currentUser.next(this.user)  // Оновлення актуально інформації в загальнову обєкті Користувача
      }

    })
  }



}
