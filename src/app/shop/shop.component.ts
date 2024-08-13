import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  title = 'Shop'
  authService = inject(AuthService);
  router = inject(Router);
  shopData: any;
  filterData: any;
  errorMess = '';
  user: any;
  popUp = false;



  ngOnInit() {
    let userId = this.authService.devUserId(); // devMod
    let data = sessionStorage.getItem(userId) ? ''+sessionStorage.getItem(userId) : '';
    if(data) this.user = JSON.parse(data);

    this.getItems()
    this.sortType(null)
  }

  sortType(type: any){
    if(type) {
      this.filterData = this.shopData.filter((item: any) => {
        if(item.type == type) {
          return item
        }
      })
    } else {
      this.filterData = this.shopData;
    }
  }
  getItems(){
      this.authService.getShopItems().then(items => {
        this.shopData = items;
        this.filterData = this.shopData;
      })
  }
  buyItem(item: any){
    item.spinner = true;
    if((this.user.kar - item.price) >= 0) {
      let opt = {
        'user_id': this.user.user_id,
        'type': item.type,
        'price': item.price,
        'bonus_str': item.bonus_str ? item.bonus_str : null,
        'bonus_agi': item.bonus_agi ? item.bonus_agi : null,
        'bonus_vit': item.bonus_vit ? item.bonus_vit : null,
        'bonus_int': item.bonus_int ? item.bonus_int : null,
        'bonus_ene': item.bonus_ene ? item.bonus_ene : null,
        'bonus_men': item.bonus_men ? item.bonus_men : null,
        'bonus_atk': item.bonus_atk ? item.bonus_atk : null,
        'bonus_def': item.bonus_def ? item.bonus_def : null,
        'bonus_mag': item.bonus_mag ? item.bonus_mag : null,
        'bonus_res': item.bonus_res ? item.bonus_res : null,
        'bonus_bos': item.bonus_bos ? item.bonus_bos : null,
        'bonus_boss': item.bonus_boss ? item.bonus_boss : null,
        'bonus_bosss': item.bonus_bosss ? item.bonus_bosss : null,
        'bonus_bossss': item.bonus_bossss ? item.bonus_bossss : null,
        'klas': item.klas,
        'set': item.set,
        'name': item.name,
        'item_id': item.id,
        'defence': item.def ? item.def : null,
        'attack': item.atk ? item.atk : null,
        'hp': item.hp ? item.hp : null,
        'mp': item.mp ? item.mp : null,
        'str': item.str ? item.str : null,
        'agi': item.agi ? item.agi : null,
        'int': item.int ? item.int : null,
        'vit': item.vit ? item.vit : null,
        'ene': item.ene ? item.ene : null,
        'men': item.men ? item.men : null,
        'reff': item.reff ? item.reff : null
      }
      this.authService.createUserItems(opt).then(data => {
        this.user.kar -= item.price
        this.authService.patchUserData(this.user.user_id, {'kar': this.user.kar}).then(() => item.spinner = false)
      })
    } else {
      this.errorMess = 'You don\'t have Kar';
      item.spinner = false;
      this.popUp = true;
    }

  }

  closePopUp(){
    this.popUp = false;
    this.errorMess = '';
  }

  back(){
    this.router.navigate(['dashboard'])
  }


}
