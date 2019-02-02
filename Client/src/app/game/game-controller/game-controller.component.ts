import { OnInit, Component } from "@angular/core";
import * as PIXI from './../../../pixi.min.js'
import { Map } from "../game-logic/Map.js";
import { Unit } from "../game-logic/Unit.js";
import { Interface } from "../game-logic/Interface.js";
import { Physics } from "../game-logic/Physics.js";
import { Input } from "../game-logic/Input.js";
import { Game } from "../game-logic/Game.js";
import { HttpHeaders, HttpParams, HttpClient } from "@angular/common/http";
import { Account } from "../../account";
import { Router } from "@angular/router";
import { InfoDialog } from "../../dialogs/info-dialog/info-dialog.component";
import { MatDialog } from "@angular/material";

export interface settings {
  'LivesAmmount': string;
  'EnemiesAmmount': string;
  'PlayerColor': string;
}

@Component({
  selector: 'app-game-controller',
  templateUrl: './game-controller.component.html',
  styleUrls: ['./game-controller.component.css']
})

export class GameControllerComponent implements OnInit {

  private app: any;
  private map: Map;
  private unit: Unit;
  private interface: Interface;
  private physics: Physics
  private input: Input
  private game: Game;


  private livesAmmount;
  private enemiesAmmount;
  private playerColor;

  constructor(public dialog: MatDialog, private http: HttpClient, private router: Router) { }

  ngOnInit() {

    if (!Account.isLoggedUser()) {
      this.router.navigate(['/login']);
    }

    this.getData()

  };

  gameLoop(delta) {
    this.game.play(delta)
  }

  async getData() {
    let url = 'http://localhost:8080/game/getsettings';

    const options: {
      headers?: HttpHeaders;
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

    await this.http.get(url, options).subscribe(res => {
      this.livesAmmount = res['LivesAmmount']
      this.enemiesAmmount = res['EnemiesAmmount']
      this.playerColor = res['PlayerColor']
    },
      () => {
        this.router.navigate(['/main/']);
      },
      () => {
        this.app = new PIXI.Application({width: window.innerWidth * 0.98, height: window.innerHeight * 0.98});
        document.body.appendChild(this.app.view);

        this.map = new Map(this.app.stage);
        this.unit = new Unit(this.app.stage, this.map, this.livesAmmount, this.enemiesAmmount, this.playerColor);
        this.interface = new Interface(this.app.stage, this.unit, this.map)
        this.physics = new Physics(this.map, this.unit, this.interface)
        this.game = new Game(this.map, this.unit, this.interface, this.physics, this.app.stage, this.app.ticker, this)
        this.input = new Input(this.unit.player, this.physics, this.app.ticker, this.game)

        this.app.ticker.add(delta => this.gameLoop(delta));
      }
    );

  }

  public async updateRank(score, time, enemies, lives, status) {

    while (this.app.stage.children[0]) {
      this.app.stage.removeChild(this.app.stage.children[0]);
    }

    this.app.stage.destroy(true)
    this.app.renderer.destroy(true)
    try {
      this.app.destroy(true)
    } catch (err) {

    }


    let s;
    let livesMult;
    let timeMult;
    let comment;

    if (status) {
      livesMult = ((5 - this.livesAmmount + lives) / (5 + this.livesAmmount)).toFixed(2)
      if (time < 60 * 5) {
        timeMult = ((60 * 5 - time) / 60 + 1).toFixed(2);
      } else {
        timeMult = 1;
      }
      s = Math.round(score * enemies * livesMult * timeMult);

      comment = "Score: " + score + "\n" +
        "Time: " + time + "\n" +
        "Enemies Multiplayer: " + enemies + "\n" +
        "Lives Multiplayer: " + livesMult + "\n" +
        "Time Multiplayer: " + timeMult + "\n" +
        "Total Score: " + s;

    } else {

      s = score;
      comment = "Score: " + s + "\n" +
        "Time: " + time;
    }

    let url = 'http://localhost:8080/game/savescore';

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
      .set('score', s)
      .set('time', time)

    let code = await this.http.post(url, [], options).toPromise();

    if (code.startsWith('Error')) {
      comment = code.substring('Error:x '.length, code.length);
    }

    const dialogRef = this.dialog.open(InfoDialog, {
      data: comment
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/main/']);
    });

  }
}