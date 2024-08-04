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
  // @ts-ignore

  user: any;



  ngOnInit() {
    this.authService.currentUser.subscribe((data: any) => {
      this.user = data;
    })
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
        console.log(items);
        this.shopData = items;
        this.filterData = this.shopData;
      })
  }
  buyItem(item: any){
    // console.log(item, this.user)
    if((this.user.kar - item.price) >= 0) {
      let opt = {
        'user_id': this.user.user_id,
        'type': item.type,
        'price': item.price,
        'bonus': item.bonus,
        'klas': item.klas,
        'set': item.set,
        'name': item.name,
        'item_id': item.id,
        'defence': item.def,
      }
      this.authService.createUserItems(opt).then(data => {
        console.log(data)
        this.user.kar -= item.price

        this.authService.patchUserData(this.user.user_id, {'kar': this.user.kar}).then()
      })
    } else {
      alert('You don\'t have Kar')
    }

  }

  back(){
    this.router.navigate(['dashboard'])
  }


}
