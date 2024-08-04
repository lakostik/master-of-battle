import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-button',
  standalone: true,
  imports: [ ],
  templateUrl: './nav-button.component.html',
  styleUrl: './nav-button.component.css'
})
export class NavButtonComponent {
  router = inject(Router);

}
