import { Component, OnInit } from '@angular/core';
import { Account } from '../../account';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { InfoDialog } from '../../dialogs/info-dialog/info-dialog.component';

@Component({
  selector: 'app-setting-menu',
  templateUrl: './setting-menu.component.html',
  styleUrls: ['./setting-menu.component.css']
})

export class SettingMenuComponent implements OnInit {

  livesAmmount
  enemiesAmmount
  playerColor

  lives
  enemies
  colors

  constructor(public dialog: MatDialog, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    // if (!Account.isLoggedUser())
    //   this.router.navigate(['/login']);


    this.livesAmmount = ''
    this.enemiesAmmount = ''
    this.playerColor = ''
    this.lives = [1, 2, 3, 4, 5]
    this.enemies = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    this.colors = [
      ['red', '0x800000'],
      ['green', '0x65843E'],
      ['yellow', '0xFFFF00']
    ]
  }

  backToMenu() {
    this.livesAmmount = ''
    this.enemiesAmmount = ''
    this.playerColor = ''
    this.router.navigate(['/main'])
  }

  async setSettings() {
    let url = 'http://localhost:8080/game/setsettings';

    const options: {
      headers?: HttpHeaders,
      observe?: 'body',
      params?: HttpParams,
      reportProgress?: boolean,
      responseType: 'text',
      withCredentials?: boolean
    } = {
      responseType: 'text'
    };

    options.headers = new HttpHeaders()
      .set('Authorization', Account.getTocken());
    options.params = new HttpParams()
      .set('lives', this.livesAmmount)
      .set('enemies', this.enemiesAmmount)
      .set('color', this.playerColor);


    let code;
    let comment;

    await this.http.put(url, [], options).subscribe((res: string) => {
      code = res;
    },
      () => {
      },
      () => {
        if (code.startsWith('Error')) {
          comment = code.substring('Error:x '.length, code.length);
          code = 'Error';
        } else {
          comment = '' + code;
        }

        const dialogRef = this.dialog.open(InfoDialog, {
          data: comment
        });

        if (code != 'Error') {
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/main']);
          });
        }
      });
  }
}

