import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CommonModule, Location} from "@angular/common";
import {AuthService} from "../services/auth.service";
import {FormsModule} from "@angular/forms";
import {error} from "@angular/compiler-cli/src/transformers/util";


@Component({
  selector: 'app-inventar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './inventar.component.html',
  styleUrl: './inventar.component.css'
})
export class InventarComponent implements OnInit{
    title = 'Chest'
    location = inject(Location)
    authService = inject(AuthService)
    user: any;
    itemsData: any;
    router = inject(Router);
    errorMess = '';
    popUp = false;

    ngOnInit() {
      this.initData();
    }

    initData(){
      let userId = this.authService.devUserId(); // devMod
      let data = sessionStorage.getItem(userId) ? ''+sessionStorage.getItem(userId) : '';
      if(data) {
        this.user = JSON.parse(data);
        if(this.user?.user_id) this.sortData(this.user.user_items);
      }
    }

    sortData(data: any){
      this.itemsData = data.sort((a:any, b:any) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
    }

    sellItem(item: any){
      item.spinner = true;
      this.authService.deleteUserItems(item.user_id, item.id).then((res) => {
        this.authService.patchUserData(this.user.user_id, {'kar': this.user.kar + (item.price - (item.level*3))}).then(() => this.updateItems())
      })

    }

    showButtons(i:number){
      this.itemsData.filter((el:any, index: any) => {
        if(index == i) el.show = !el.show
        else el.show = false
      })
    }
    equipHand(item: any, slot:any = null) {
      console.log(item)
      item.spinner = true;
      this.authService.patchUserItems(this.user.user_id, item.id, {'equipped': true, 'slot': slot}).then((data)=> {
        if(data) this.swichItem(data[0], slot);
      });
    }
    swichItem(item: any, slot: any){
      this.itemsData.filter((el: any, i:any) => {
        if(item.type !== 'shield' && item.type == el.type && el.id !== item.id && !slot && el.equipped) {this.unequipItem(el)}
        else if(item.type == 'weapon' && item.type == el.type && el.slot == slot && el.id !== item.id){this.unequipItem(el)}
        else if(item.type == 'weapon' && el.type == 'shield' && slot == 2 && el.id !== item.id){this.unequipItem(el)}
        else if (item.type == 'shield' && el.type == 'shield' && el.id !== item.id) {this.unequipItem(el)}
        else if (item.type == 'shield' && el.type == 'weapon' && el.id !== item.id && el.slot == 2) {this.unequipItem(el)}
        else if(item.type == 'ring' && el.id !== item.id) {
          if(el.type == item.type && el.slot == slot) this.unequipItem(el)
        }
        else {
          if(this.itemsData.length - 1 == i) this.updateItems(item)
        }
      });
    }
    updateItems(item: any = null){
      this.authService.checkUserById(this.user.user_id).then((user) => {
        sessionStorage.setItem(this.user.user_id, JSON.stringify(user));
        this.initData();
        if(item) item.spinner = false;
      })
    }
    unequipItem(item: any, slot:any = null) {
      if(item.equipped){
        this.authService.patchUserItems(this.user.user_id, item.id, {'equipped': false, 'slot': null}).then(()=> {
          this.updateItems(item)
        });
      }
    }

    lvlUpItem(item: any){
      item.spinner = true;
      this.errorMess = '';
      if((this.user.kar - ((item.level*2) + 3)) >= 0){
        if(this.user.user_exp[0].curr_lvl > item.level) {
          let opt = Object.assign({}, this.addRandomOpt(item));
          opt.price += (item.level*2) + 3;
          if(opt.defence != null && opt.type !== 'shield') opt.defence += 2;
          if(opt.defence != null && opt.type == 'shield') opt.defence += 1;
          if(opt.attack != null) opt.attack += 2;
          if((opt.level+1) % 10 === 0) {
            if(opt.bonus_atk) {
              opt.bonus_atk += 2
            }
            if(opt.bonus_atk){
              opt.bonus_def += 2
            }
            if(opt.bonus_mag) {
              opt.bonus_mag += 2
            }
            if(opt.bonus_bos){
              opt.bonus_bos += 1
            }
            if(opt.bonus_boss){
              opt.bonus_boss += 1
            }
            if(opt.bonus_bosss){
              opt.bonus_bosss += 1
            }
            if(opt.bonus_bossss){
              opt.bonus_bossss += 1
            }
            if(opt.bonus_str){
              opt.bonus_str += 3
            }
            if(opt.bonus_agi){
              opt.bonus_agi += 3
            }
            if(opt.bonus_vit){
              opt.bonus_vit += 3
            }
            if(opt.bonus_int){
              opt.bonus_int += 3
            }
            if(opt.bonus_men){
              opt.bonus_men += 3
            }
            if(opt.bonus_ene){
              opt.bonus_ene += 3
            }
            if(opt.bonus_res){
              opt.bonus_res += 3
            }
          }
          opt.level += 1;
          this.user.kar -= (item.level*2) + 3;
          if(opt.spinner) delete opt.spinner
          if(opt.show) delete opt.show
          this.authService.patchUserItems(this.user.user_id, item.id, opt).then(data => {
            this.authService.patchUserData(this.user.user_id, {'kar': this.user.kar}).then(() => {
              setTimeout(()=> {this.initData(); item.spinner = false},750);
            })
          })
        } else {
          this.popUp = true;
          this.errorMess = 'The maximum allowable item level at your level'
          item.spinner = false
          this.initData();
        }
      } else { this.popUp = true; this.errorMess = 'You don`t have money'; item.spinner = false}

    }

    addRandomOpt(item: any) {
      // Виключити певні ключі з можливих для вибору
      const excludeKeys = ["klas", "name", "type", "bonus_bossss","bonus_bosss","bonus_boss","bonus_bos","bonus_res","bonus_ene","bonus_men","bonus_int","bonus_vit","bonus_agi","bonus_str","bonus_def","bonus_atk","bonus_mag", "level", "price", "defence", "attack", "item_id", "user_id", "equipped", "created_at", "set", "id", "slot", "spinner"];
      const availableKeys = Object.keys(item).filter(key => !excludeKeys.includes(key));  // Отримати масив ключів об'єкта, виключаючи певні ключі
      const randomIndex = Math.floor(Math.random() * availableKeys.length);   // Вибрати рандомний індекс з масиву ключів
      const randomKey = availableKeys[randomIndex];                               // Вибрати рандомний ключ

      // Присвоїти значення вибраному ключу
      if(randomKey == 'str' || randomKey == 'agi' || randomKey == 'ene' || randomKey == 'vit' || randomKey == 'men' || randomKey == 'int'){
        item[randomKey] += 1;
      } else if(randomKey == 'hp'|| randomKey == 'mp') {
        item[randomKey] += 10;
      } else if(randomKey == 'extra_damage'|| randomKey == 'reff'|| randomKey == 'extra_defence' || randomKey == 'damage_resistant') {
        item[randomKey] += 2;
      } else { item[randomKey] += 5; }

      return item
    }

    closePopUp(){
        this.popUp = false;
        this.errorMess = '';
        this.initData();
    }

    back(){
        this.location.back();
    }
}
