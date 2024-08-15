import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegistrationComponent} from "./auth/registration/registration.component";
import {LostComponent} from "./auth/lost/lost.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {UserInfoComponent} from "./user-info/user-info.component";
import {BattleArenaComponent} from "./battle-arena/battle-arena.component";
import {InventarComponent} from "./inventar/inventar.component";
import {QuestsComponent} from "./quests/quests.component";
import {ShopComponent} from "./shop/shop.component";
import {BossAreaComponent} from "./boss-area/boss-area.component";
import {BossBattleComponent} from "./boss-area/boss-battle/boss-battle.component";

export const routes: Routes = [
  {path: 'home', component: AppComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'lost', component: LostComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'user-info', component: UserInfoComponent},
  {path: 'battle-arena', component: BattleArenaComponent},
  {path: 'inventar', component: InventarComponent},
  {path: 'quests', component: QuestsComponent},
  {path: 'shop', component: ShopComponent},
  {path: 'boss', component: BossAreaComponent},
  {path: 'boss-battle', component: BossBattleComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
