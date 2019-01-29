import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Account} from './../../account';
import {Router} from '@angular/router';

export interface rankMap {
  'score': rankMapElement;
  'totalTime': string;
  'name': string;
  'rank': string;
}

export interface rankMapElement {
  'score': string;
  'timePlayed': string;
}

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent implements OnInit {

  listOfScores: string[];
  listOfTimes: string[];
  name: string;
  rank: string;
  totalTime: string;

  constructor(private http: HttpClient, private router: Router) {

  }

  ngOnInit() {
    if (!Account.isLoggedUser()) {
      this.router.navigate(['/login']);
    }

    this.listOfScores = [];
    this.listOfTimes = [];
    this.name = '';
    this.rank = '';
    this.totalTime = '';
    this.getRank();
  }

  async getRank() {
    let url = 'http://localhost:8080/rank/getmyrank';

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

    await this.http.get<rankMap>(url, options).subscribe((res: rankMap) => {
      this.name = res['name'];
      this.rank = res['rank'];
      this.totalTime = res['totalTime'];
      for (let elem in res) {
        if (elem == 'name' || elem == 'rank' || elem == 'totalTime') {
          continue;
        }
        const value = res[elem];
        this.listOfScores.push(value['score']);
        this.listOfTimes.push(value['timePlayed']);
      }
    });
  }

}
