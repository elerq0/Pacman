import * as PIXI from './../../../pixi.min.js'
import { Map } from './Map.js';

export class Unit {

    private map: Map;
    private stage: any;

    public enemiesAmmount;
    public livesAmmount;
    public playerColor;

    public player;

    public enemies;
    public enemyStartingPoint;

    constructor(stage, map, livesAmmount, enemiesAmmount, playerColor) {
        this.stage = stage
        this.map = map
        this.enemies = []
        this.enemyStartingPoint = [
            [this.map.horizontalShift + this.map.blockSize * 13 + 4, this.map.verticalShift + this.map.blockSize * 13, 0x3f7cff],
            [this.map.horizontalShift + this.map.blockSize * 14 + 4, this.map.verticalShift + this.map.blockSize * 14, 0xff5a00],
            [this.map.horizontalShift + this.map.blockSize * 13 + 4, this.map.verticalShift + this.map.blockSize * 15, 0xfe2e2e],
            [this.map.horizontalShift + this.map.blockSize * 15 + 4, this.map.verticalShift + this.map.blockSize * 13, 0xff42c7],
            [this.map.horizontalShift + this.map.blockSize * 11 + 4, this.map.verticalShift + this.map.blockSize * 13, 0x99cc33],
            [this.map.horizontalShift + this.map.blockSize * 12 + 4, this.map.verticalShift + this.map.blockSize * 14, 0x1fdce3],
            [this.map.horizontalShift + this.map.blockSize * 16 + 4, this.map.verticalShift + this.map.blockSize * 14, 0xd41f1f],
            [this.map.horizontalShift + this.map.blockSize * 15 + 4, this.map.verticalShift + this.map.blockSize * 15, 0xab6c39],
            [this.map.horizontalShift + this.map.blockSize * 11 + 4, this.map.verticalShift + this.map.blockSize * 15, 0xe3d72f],
        ];

        this.livesAmmount = livesAmmount
        this.enemiesAmmount = enemiesAmmount
        this.playerColor = playerColor

        this.createPlayer()
        this.createEnemies(this.enemiesAmmount)
    }

    createPlayer() {
        const size = this.map.blockSize * 0.35;
        const posShift = this.map.blockSize * 0.45;
        this.player = new PIXI.Graphics();
        this.player.lineStyle(1, this.playerColor, 1);
        this.player.beginFill(this.playerColor);
        this.player.drawEllipse(posShift, posShift, size, size);
        this.player.endFill();
        this.player.x = this.map.horizontalShift + this.map.blockSize * 2 + this.map.blockSize / 10;
        this.player.y = this.map.verticalShift + this.map.blockSize * 26 + this.map.blockSize / 10;

        this.stage.addChild(this.player);
    }

    createEnemies(number) {

        for (let i = 0; i < number; i++) {
            const size = this.map.blockSize * 0.35;
            const posShift = this.map.blockSize * 0.45;
            let enemy = new PIXI.Graphics();
            enemy.lineStyle(3, this.enemyStartingPoint[i][2], 1);
            enemy.beginFill(0x000000);
            enemy.drawEllipse(posShift, posShift, size, size);
            enemy.endFill();
            enemy.x = this.enemyStartingPoint[i][0]
            enemy.y = this.enemyStartingPoint[i][1]
            enemy.currentPath = 'none'
            enemy.delay = i * 150;
            enemy.index = i;
            this.stage.addChild(enemy);
            this.enemies.push(enemy)
        }
    }

    changePlayerColor(color){
        let path = this.player.currentPath
        this.player.clear();
        this.player.beginFill(color)
        this.player.lineStyle(1, color)
        this.player.drawEllipse(this.map.blockSize / 2.5, this.map.blockSize / 2.5, (this.map.blockSize - 6) / 2, (this.map.blockSize - 6) / 2);
        this.player.endFill();
        this.player.currentPath = path
    }
}