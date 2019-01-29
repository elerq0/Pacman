import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {PasswordResetDialog} from '../../dialogs/password-reset-dialog/password-reset-dialog.component';
import {InfoDialog} from '../../dialogs/info-dialog/info-dialog.component';

@Component({
  selector: 'app-password-reset-menu',
  templateUrl: './password-reset-menu.component.html',
  styleUrls: ['./password-reset-menu.component.css']
})
export class PasswordResetMenuComponent implements OnInit {
  login: string;
  question: string;
  answer: string;
  isVisible: boolean;

  constructor(public dialog: MatDialog, public http: HttpClient, private router: Router) {
    this.login = '';
    this.question = '';
    this.isVisible = false;
  }

  ngOnInit() {
  }

  async checkAccount() {

    let url = 'http://localhost:8080/users/getquestion';

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

    options.params = new HttpParams()
      .set('login', this.login);

    let code;
    code = await this.http.get(url, options).toPromise();

    let comment;

    if (code.startsWith('Error')) {
      comment = code.substring('Error:x '.length, code.length);
      code = 'Error';
    } else {
      this.question = code;
      comment = 'Answer for question and click next!';
    }

    const dialogRef = this.dialog.open(InfoDialog, {
      data: comment
    });

    if (code != 'Error') {
      dialogRef.afterClosed().subscribe(() => {
        this.isVisible = true;
      });
    }
  }

  async changePassword() {

    let password = '';
    const dialogRef = this.dialog.open(PasswordResetDialog, {
      data: password
    });

    dialogRef.afterClosed().subscribe(
      result => {
        password = result;
      },
      () => {
      },
      () => {
        this.setPassword(password);
      });


  }

  async setPassword(password: string) {
    let url = 'http://localhost:8080/users/changepassword';

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

    options.params = new HttpParams()
      .set('login', this.login)
      .set('password', password)
      .set('answer', this.answer);


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

        const dialogRef2 = this.dialog.open(InfoDialog, {
          data: comment
        });

        if (code != 'Error') {
          dialogRef2.afterClosed().subscribe(() => {
            this.router.navigate(['/login']);
          });
        }
      });
  }
}


