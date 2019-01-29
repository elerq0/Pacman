import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {Account} from '../../account';
import {InfoDialog} from '../../dialogs/info-dialog/info-dialog.component';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent implements OnInit {

  hide = true;
  login: string;
  password: string;
  capthaComp = false;
  protected aFormGroup: FormGroup;

  siteKey = '6LelwXwUAAAAAKnfQ8YTx92Y2nyHlDTwdCeLyX2U';
  theme = 'dark';

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, public http: HttpClient, private router: Router) {
    this.login = '';
    this.password = '';
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }

  backToStartMenu(): void {
    delete (this.login);
    delete (this.password);
  }

  async loginToGame() {

    let url = 'http://localhost:8080/users/signin';

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
      .set('password', this.password);

    let code;
    if (this.capthaComp == true)
    code = await this.http.get(url, options).toPromise();
    else
      code = "Error:  Captcha failed!"
    let comment;

    if (code.startsWith('Error')) {
      comment = code.substring('Error:x '.length, code.length);
      code = 'Error';
    } else {
      comment = 'Welcome!';
      Account.setTocken(code);
    }

    const dialogRef = this.dialog.open(InfoDialog, {
      data: comment
    });

    if (code != 'Error') {
      dialogRef.afterClosed().subscribe(() => {
        this.backToStartMenu();
        this.router.navigate(['/main']);
      });
    }
  }

  ngOnInit() {

  }

  setCaptchaToTrue() {
    this.capthaComp = true;
  }

  setCaptchaToFalse() {
    this.capthaComp = false;
  }

}

