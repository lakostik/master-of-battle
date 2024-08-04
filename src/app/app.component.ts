import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { environment } from './../environments/environment';
import {ApiService} from "./services/api.service";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'game-start-two';

  userId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id ? window?.Telegram?.WebApp?.initDataUnsafe?.user?.id : 1392895447;

  constructor(private apiServices: ApiService,
              private authService: AuthService,
              private router: Router) {

  }

  ngOnInit() {

    this.authService.checkUserById(+this.userId).then(user => {
      if (user) {
        this.authService.currentUser.next(user);
        this.router.navigate(['dashboard'])
      } else {
        this.router.navigate(['registration'])
      }
    });

  }


}
