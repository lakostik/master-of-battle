import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ItemOptPipe} from "../../pipe/item-opt.pipe";
import {AuthService} from "../../services/auth.service";
import {ApiService} from "../../services/api.service";


@Component({
  selector: 'app-equip',
  standalone: true,
  imports: [
    CommonModule,
    ItemOptPipe
  ],
  templateUrl: './equip.component.html',
  styleUrl: './equip.component.css'
})
export class EquipComponent implements OnInit{

  @Input() user: any;

  authService = inject(AuthService);
  apiService = inject(ApiService);
  popUp = false;
  popUpData: any;

  helm: any;
  armor: any;
  pants: any;
  gloves: any;
  boots: any;
  symbol: any;
  ring1: any;
  ring2: any;
  weapon: any;
  shield: any;
  earrings: any;
  necklaces: any;
  itemData: any;
  userHP: any;
  userMP: any;


  ngOnInit() {
    if(this.user?.user_id) this.filterEquipped(this.user);
    this.itemData = this.apiService.calcUserItemsParameters(this.user);
    this.calcPoints(this.user, this.itemData)
  }

  calcPoints(user: any, itemData: any){
    let hp = user.user_spec[0].vit * 10 + itemData.vit * 10 + itemData.hp + itemData.bonus_bos * 3 * 10 + itemData.bonus_boss * 5 * 10 + itemData.bonus_bosss * 7 * 10 + itemData.bonus_bossss * 9 * 10;
    this.userHP = hp + Math.round(itemData.bonus_vit * (hp / 100));
    let mp = user.user_spec[0].men * 10 + itemData.men * 10 + itemData.mp + itemData.bonus_bos * 3 * 10 + itemData.bonus_boss * 5 * 10 + itemData.bonus_bosss * 7 * 10 + itemData.bonus_bossss * 9 * 10;
    this.userMP = mp + Math.round(itemData.bonus_men * (mp / 100));
  }

  filterEquipped(user: any){
    user.user_items.filter((el: any) => {
      if(el.equipped) {
        if(el.type == 'helm') this.helm = el;
        if(el.type == 'armor') this.armor = el;
        if(el.type == 'pants') this.pants = el;
        if(el.type == 'gloves') this.gloves = el;
        if(el.type == 'boots') this.boots = el;
        if(el.type == 'weapon') {
          if(el.slot == 1) this.weapon = el;
          else if(el.slot == 2) this.shield = el;
        }
        if(el.type == 'symbol') this.symbol = el;
        if(el.type == 'shield') this.shield = el;
        if(el.type == 'earrings') this.earrings = el;
        if(el.type == 'necklaces') this.necklaces = el;
        if(el.type == 'ring' && el.slot == 1) this.ring1 = el;
        if(el.type == 'ring' && el.slot == 2) this.ring2 = el;
      }
    })
  }


  equipUp(item: any){
    if(item) {
      this.popUp = true;
      this.popUpData = item;
    }
  }

  closePopUp(){
    this.popUp = false;
    this.popUpData = null;
  }


}
