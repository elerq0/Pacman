import {Router} from '@angular/router';

export class Account {
  static userTocken: string;

  constructor(private router: Router) {
  }

  public static setTocken(tocken: string) {
    this.userTocken = tocken;
  }

  public static getTocken() {
    return this.userTocken;
  }

  static isLoggedUser() {
    return !(Account.userTocken == null || Account.userTocken === '');
  }

}
