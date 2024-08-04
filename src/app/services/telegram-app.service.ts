import { Injectable } from '@angular/core';

declare global{
  interface Window {
    Telegram: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TelegramAppService {

  constructor() {
    if(window?.Telegram?.WebApp) {
      window?.Telegram?.WebApp.ready();
      console.log('Telegram WebApp is ready');
    }
  }


  get webApp(): any {
    return window?.Telegram?.WebApp;
  }

}
