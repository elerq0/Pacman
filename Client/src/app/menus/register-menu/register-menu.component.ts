import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {InfoDialog} from '../../dialogs/info-dialog/info-dialog.component';

@Component({
  selector: 'app-register-menu',
  templateUrl: './register-menu.component.html',
  styleUrls: ['./register-menu.component.css']
})

export class RegisterMenuComponent implements OnInit {
  hide = true;
  login: string;
  password: string;
  question: string;
  answer: string;
  questions;

  constructor(public dialog: MatDialog, public http: HttpClient, private router: Router) {
    this.http.get('http://localhost:8080/users/getquestionlist').subscribe(results => this.questions = results);
    this.login = '';
    this.password = '';
    this.question = '';
    this.answer = '';
  }

  backToStartMenu() {
    delete (this.login);
    delete (this.password);
    delete (this.question);
    delete (this.answer);
  }

  async registerAccount() {
    let url = 'http://localhost:8080/users/signup';

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
      .set('password', this.password)
      .set('question', this.question)
      .set('answer', this.answer);

    let code = await this.http.post(url, [], options).toPromise();
    let comment;


    if (code.startsWith('Error')) {
      comment = code.substring('Error:x '.length, code.length);
      code = 'Error';
    } else {
      comment = 'Registration completed!';
    }

    const dialogRef = this.dialog.open(InfoDialog, {
      data: comment
    });

    if (code != 'Error') {
      dialogRef.afterClosed().subscribe(result => {
        this.backToStartMenu();
        this.router.navigate(['/']);
      });
    }
  }

  ngOnInit() {
  }
}
