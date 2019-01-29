import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Account} from '../../account';
import {Router} from '@angular/router';

export interface rankMap {
  'map': rankMapElement;
}

export interface rankMapElement {
  'MaxScore': string;
  'Position': string;
  'TotalTime': string;
  'Name': string;
}

@Component({
  selector: 'app-rank-menu',
  templateUrl: './rank-menu.component.html',
  styleUrls: ['./rank-menu.component.css']
})
export class RankMenuComponent implements OnInit {

  listOfRanks: string[];
  listOfNames: string[];
  listOfMaxScores: string[];
  listOfTotalTimes: string[];

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    if (!Account.isLoggedUser()) {
      this.router.navigate(['/login']);
    }

    this.listOfRanks = [];
    this.listOfNames = [];
    this.listOfMaxScores = [];
    this.listOfTotalTimes = [];
    this.getRank();
  }

  async getRank() {
    let url = 'http://localhost:8080/rank/gettop';

    const options: {
      headers?: HttpHeaders,
      observe?: 'body',
      params?: HttpParams,
      reportProgress?: boolean,
      responseType: 'json',
      withCredentials?: boolean
    } = {
      responseType: 'json',
    };

    options.headers = new HttpHeaders()
      .set('Authorization', Account.getTocken());
    options.params = new HttpParams()
      .set('ammount', '15');

    await this.http.get<rankMapElement[]>(url, options).subscribe((res: rankMapElement[]) => {
      for (let elem in res) {
        const value = res[elem];
        this.listOfRanks.push(value['Position']);
        this.listOfNames.push(value['Name']);
        this.listOfMaxScores.push(value['MaxScore']);
        this.listOfTotalTimes.push(value['TotalTime']);
      }
    });
  }
}
