import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CommonModule, Location} from "@angular/common";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-inventar',
  standalone: true,
  imports: [
    CommonModule
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

    ngOnInit() {
      this.authService.currentUser.subscribe((data: any) => {
        this.user = data;
        this.sortData(data.user_items);
      })
    }

    sortData(data: any){
      this.itemsData = data.sort((a:any, b:any) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }

    sellItem(item: any){
      item.spinner = true;
      this.authService.deleteUserItems(item.user_id, item.id).then((res) => {
        item.spinner = false;
        this.authService.patchUserData(this.user.user_id, {'kar': this.user.kar + (item.price - (item.level*3))}).then(()=>{

        })

      })

    }

    equipItem(item: any) {
      item.spinner = true;
      this.itemsData.filter((el: any) => {
        if(el.type == item.type && el.id !== item.id) {
          this.authService.patchUserItems(this.user.user_id, el.id, {'equipped': false}).then();
        }
      })
      this.authService.patchUserItems(this.user.user_id, item.id, {'equipped': !item.equipped}).then(() => {
        this.authService.patchUserData(this.user.user_id, {'kar': this.user.kar}).then(()=>{
          item.spinner = false;
        })
      })
    }

    equipRing(item: any) {

    }

    lvlUpItem(item: any){
      // item.spinner = true;
      if((this.user.kar - ((item.level*2) + 3)) >= 0){
        if(this.user.user_exp[0].curr_lvl > item.level) {
          let opt = this.addRandomOpt(item);
          opt.price += (item.level*2) + 3;
          opt.defence += 2;
          if((opt.level+1) % 10 === 0) {
            if(opt.klas == 'atk' || opt.klas == 'def') {
              opt.bonus += 2
            } else {
              opt.bonus += 4
            }
          }
          opt.level += 1;
          this.user.kar -= (item.level*2) + 3;
          this.authService.patchUserItems(this.user.user_id, item.id, opt).then(data => {
            this.authService.patchUserData(this.user.user_id, {'kar': this.user.kar}).then(() => {
              item.spinner = false
            })
            console.log(data)
          })
        } else {
          alert('Max level')
          item.spinner = false
        }
      } else { alert('You don`t have money'); item.spinner = false}
    }

    addRandomOpt(item: any) {
      // Виключити певні ключі з можливих для вибору
      const excludeKeys = ["klas", "name", "type", "bonus", "level", "price", "defence", "attack", "item_id", "user_id", "equipped", "created_at", "set", "id", "slot", "spinner"];
      const availableKeys = Object.keys(item).filter(key => !excludeKeys.includes(key));  // Отримати масив ключів об'єкта, виключаючи певні ключі
      const randomIndex = Math.floor(Math.random() * availableKeys.length);   // Вибрати рандомний індекс з масиву ключів
      const randomKey = availableKeys[randomIndex];                               // Вибрати рандомний ключ

      // Присвоїти значення вибраному ключу
      if(randomKey == 'str' || randomKey == 'agi' || randomKey == 'ene' || randomKey == 'vit' || randomKey == 'men' || randomKey == 'int'){
        item[randomKey] += 1;
      } else if(randomKey == 'hp'|| randomKey == 'mp') {
        item[randomKey] += 10;
      } else if(randomKey == 'extra_damage'|| randomKey == 'extra_defence' || randomKey == 'damage_resistant') {
        item[randomKey] += 2;
      } else { item[randomKey] += 5; }

      console.log(`Вибрано ключ: ${randomKey}, нове значення: ${item[randomKey]}`);
      console.log(item);
      return item
    }

    back(){
        this.location.back();
    }
}
