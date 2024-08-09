import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-characteristics',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './characteristics.component.html',
  styleUrl: './characteristics.component.css'
})
export class CharacteristicsComponent implements OnInit {

  @Input() user: any;

  authService = inject(AuthService);
  charShowBnt: boolean = false;


  ngOnInit() {

  }

  addStat(name: string){
    if(this.user.user_spec[0].points > 0) {
      this.charShowBnt = true;
      this.user.user_spec[0][name] = this.user.user_spec[0][name] + 1;
      this.user.user_spec[0].points = this.user.user_spec[0].points - 1;
    }
  }

  saveChr(){
    const data = this.user.user_spec;
    this.authService.patchUserSpec(this.user.user_id, data).then((spec) => {
      this.user.user_spec[0] = spec;
      sessionStorage.setItem('userData', JSON.stringify(this.user));
      this.charShowBnt = false;
    })
  }

  cancelChr() {
    this.authService.getUserSpec(this.user.user_id).then((spec) => {
      this.user.user_spec[0] = spec;
      sessionStorage.setItem('userData', JSON.stringify(this.user));
      this.charShowBnt = false;
    })
  }

}
