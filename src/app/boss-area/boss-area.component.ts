import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, Location} from "@angular/common";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-boss-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boss-area.component.html',
  styleUrl: './boss-area.component.css'
})
export class BossAreaComponent implements OnInit{
    title = 'Boss Area'
    location = inject(Location)
    authService = inject(AuthService)
    router = inject(Router);
    bosses: any;

  constructor() {
  }

  ngOnInit() {
    this.getBosses();
  }

  getBosses(){
    this.authService.getAllBosses().then((data) => {
      this.bosses = data;
      this.setActiveBoss();
    })
  }

  setActiveBoss(index: any = 0) {
    this.bosses.filter((a:any, b:any) => {
      if(b == index) a.active = true;
      else a.active = false
    })
  }

  switchBoss(side: any){
    this.setActiveBoss(side);
  }
  fight(boss: any){
    console.log(boss)
  }
  back(){
      this.location.back();
  }


}
