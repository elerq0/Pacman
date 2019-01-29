import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatDialogModule} from '@angular/material';
import { MatIconModule} from '@angular/material/icon';
import { MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { NgxCaptchaModule } from 'ngx-captcha';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StartMenuComponent } from './menus/start-menu/start-menu.component';
import { LoginMenuComponent } from './menus/login-menu/login-menu.component';
import { RegisterMenuComponent } from './menus/register-menu/register-menu.component';
import { MainMenuComponent } from './menus/main-menu/main-menu.component';
import { PasswordResetMenuComponent } from './menus/password-reset-menu/password-reset-menu.component';

import { PasswordResetDialog } from './dialogs/password-reset-dialog/password-reset-dialog.component'
import { InfoDialog} from './dialogs/info-dialog/info-dialog.component';
import { SettingMenuComponent } from './menus/setting-menu/setting-menu.component';
import { RankMenuComponent } from './menus/rank-menu/rank-menu.component';
import { ProfileMenuComponent } from './menus/profile-menu/profile-menu.component';
import { GameControllerComponent } from './game/game-controller/game-controller.component';

@NgModule({
  declarations: [
    AppComponent,
    InfoDialog,
    PasswordResetDialog,
    StartMenuComponent,
    LoginMenuComponent,
    RegisterMenuComponent,
    MainMenuComponent,
    PasswordResetMenuComponent,
    SettingMenuComponent,
    RankMenuComponent,
    ProfileMenuComponent,
    GameControllerComponent,
  ],
  entryComponents: [
    LoginMenuComponent,
    RegisterMenuComponent,
    PasswordResetMenuComponent,
    GameControllerComponent,
    InfoDialog,
    PasswordResetDialog,    
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    NgxCaptchaModule,
  ],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatIconModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
