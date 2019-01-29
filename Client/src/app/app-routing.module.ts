import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginMenuComponent } from './menus/login-menu/login-menu.component';
import { RegisterMenuComponent } from './menus/register-menu/register-menu.component';
import { StartMenuComponent } from './menus/start-menu/start-menu.component';
import { MainMenuComponent } from './menus/main-menu/main-menu.component';
import { PasswordResetMenuComponent } from './menus/password-reset-menu/password-reset-menu.component';
import { RankMenuComponent } from './menus/rank-menu/rank-menu.component';
import { ProfileMenuComponent } from './menus/profile-menu/profile-menu.component';
import { SettingMenuComponent } from './menus/setting-menu/setting-menu.component';
import { GameControllerComponent } from './game/game-controller/game-controller.component';

const routes: Routes = [
  {path: '', component: StartMenuComponent},
  {path: 'login', component: LoginMenuComponent},
  {path: 'register', component: RegisterMenuComponent},
  {path: 'main', component: MainMenuComponent},
  {path: 'reset', component: PasswordResetMenuComponent},
  {path: 'rank', component: RankMenuComponent},
  {path: 'profile', component: ProfileMenuComponent},
  {path: 'settings', component: SettingMenuComponent},
  {path: 'game', component: GameControllerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
