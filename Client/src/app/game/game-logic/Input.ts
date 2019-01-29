import * as PIXI from './../../../pixi.min.js'
import { Physics } from './Physics.js';
import { Game } from './Game.js';

export interface keyInterface {
  value;
  isDown;
  isUp;
  press;
  release;
  downHandler;
  upHandler;
  unsubscribe;
}

export class Input {

    player: any;
    physics: Physics;
    ticker: any
    game: Game

    constructor(player, physics, ticker, game){
        this.player = player;
        this.physics = physics
        this.ticker = ticker
        this.game = game

        this.mapKeys()
    }
    
  mapKeys() {
    this.player.currentPath = 'none'
    let left = this.keyboard("ArrowLeft"),
      up = this.keyboard("ArrowUp"),
      right = this.keyboard("ArrowRight"),
      down = this.keyboard("ArrowDown"),
      keyP = this.keyboard("p"),
      esc = this.keyboard("Escape");

    left.press = () => {
      this.physics.backMove(this.player)
      this.player.currentPath = 'left'
    };

    up.press = () => {
      this.physics.backMove(this.player)
      this.player.currentPath = 'up'
    };

    right.press = () => {
      this.physics.backMove(this.player)
      this.player.currentPath = 'right'
    };

    down.press = () => {
      this.physics.backMove(this.player)
      this.player.currentPath = 'down'
    };

    keyP.press = () => {
      if(this.ticker.started) 
        this.ticker.stop()
      else
       this.ticker.start()
    };

    esc.press = () => {
     this.game.endGame(false)
    };
  }

  keyboard(value) {
    let key: keyInterface = {
      value: value, isDown: false, isUp: true, press: undefined, release: undefined,
      downHandler: undefined, upHandler: undefined, unsubscribe: undefined
    };

    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };

    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };

    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );

    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };

    return key;
  }
}