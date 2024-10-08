import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule, NgForOf} from "@angular/common";
import {ItemOptPipe} from "../../pipe/item-opt.pipe";
import {AuthService} from "../../services/auth.service";


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

  authService = inject(AuthService);
  user: any;

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



  ngOnInit() {
    this.authService.currentUser.subscribe((user: any) => {
      this.user = user;
      if(user.user_id) this.filterEquipped(user);
    });

  }

  filterEquipped(user: any){
    console.log('start filter', user)
    user.user_items.filter((el: any) => {

      if(el.equipped) {
        if(el.type == 'helm') this.helm = el;
        if(el.type == 'armor') this.armor = el;
        if(el.type == 'pants') this.pants = el;
        if(el.type == 'gloves') this.gloves = el;
        if(el.type == 'boots') this.boots = el;
        if(el.type == 'weapon') this.weapon = el;
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
    item.toggleAttribute('data-show');
    console.log(item);
    return item
  }


}
