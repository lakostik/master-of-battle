import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Master of Battle';

  userId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id ? window?.Telegram?.WebApp?.initDataUnsafe?.user?.id : 7340248041;

  constructor(
              private authService: AuthService,
              private router: Router) {
    window?.Telegram?.WebApp.expand();
  }

  ngOnInit() {
    this.authService.checkUserById(+this.userId).then(user => {
      if (user.user_id) {
        this.authService.currentUser.next(user);
        this.router.navigate(['dashboard'])
      } else {
        this.router.navigate(['registration'])
      }
    });

  }


}
