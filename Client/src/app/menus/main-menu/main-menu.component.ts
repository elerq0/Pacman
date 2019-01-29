import {Component, OnInit} from '@angular/core';
import {Account} from '../../account';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit() {
    if (!Account.isLoggedUser()) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    Account.setTocken('');
    this.router.navigate(['/']);
  }

}
