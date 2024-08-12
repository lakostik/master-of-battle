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



}
