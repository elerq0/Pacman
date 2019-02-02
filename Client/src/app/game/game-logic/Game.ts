import { Map } from "./Map";
import { Physics } from "./Physics";
import { Unit } from "./Unit";
import { Interface } from "./Interface";

export class Game {

    map: Map
    physics: Physics
    unit: Unit
    interface: Interface
    gcc: any;
    stage: any;
    ticker: any;
    godModeTime;
    lastDelta = 1;

    constructor(map, unit, interf, physics, stage, ticker, gcc) {
        this.map = map;
        this.physics = physics
        this.unit = unit;
        this.interface = interf
        this.stage = stage
        this.ticker = ticker
        this.gcc = gcc

        this.godModeTime = 0
    }

    public play(delta) {
        this.lastDelta = delta;
        this.physics.move(this.unit.player, delta)
        this.interface.updateTime(delta)
        if (this.godModeTime > 0) {
            if (this.godModeTime < 2) {
                this.unit.changePlayerColor(this.unit.playerColor)
            }
            this.godModeTime -= 1

        }

        for (let p of this.map.pills) {
            if (this.physics.collision(p, this.unit.player)) {
                this.map.pills.splice(this.map.pills.indexOf(p), 1)
                this.interface.updateScore(50)
                this.stage.removeChild(p);
                this.godModeTime += 666
                this.unit.changePlayerColor(this.map.pillColor)
            }
        }

        for (let s of this.map.points) {
            if (this.physics.collision(s, this.unit.player)) {
                this.map.points.splice(this.map.points.indexOf(s), 1)
                this.stage.removeChild(s);
                this.interface.updateScore(5)
            }
        }

        if(this.map.points.length == 0) this.endGame(true)

        for (let e of this.unit.enemies) {
            this.simulationMove(e, delta);
            if (this.physics.collision(e, this.unit.player))
                if (this.godModeTime == 0)
                    this.playerDies()
                else {
                    e.x = this.unit.enemyStartingPoint[e.index][0]
                    e.y = this.unit.enemyStartingPoint[e.index][1]
                    e.currentPath = 'none'
                    this.interface.updateScore(10)
                }
            for (let n of this.unit.enemies) {
                if (this.physics.collision(e, n)) {
                    this.physics.backMove(e, delta)
                    this.physics.backMove(e, delta)
                    this.physics.turnBackward(e);
                    this.physics.backMove(n, delta)
                    this.physics.backMove(n, delta)
                    this.physics.turnBackward(n);
                }
            }
        }
    }


    simulationMove(object, dist) {
        let objX = object.x
        let objY = object.y

        if (object.delay > 0) {
            object.delay -= 1;
            return;
        }

        if (object.currentPath != 'none')
            this.physics.move(object, dist)
        else {
            object.currentPath = this.getRandomPath(object.currentPath)
        }

        if (object.y >= this.map.verticalShift + this.map.blockSize * 13 && object.y < this.map.verticalShift + this.map.blockSize * 17) {
            if (object.x >= this.map.horizontalShift + this.map.blockSize * 10 && object.x < this.map.horizontalShift + this.map.blockSize * 13)
                object.currentPath = 'right'
            else if (object.x >= this.map.horizontalShift + this.map.blockSize * 13 && object.x < this.map.horizontalShift + this.map.blockSize * 14)
                object.currentPath = 'up'
            else if (object.x >= this.map.horizontalShift + this.map.blockSize * 14 && object.x < this.map.horizontalShift + this.map.blockSize * 18)
                object.currentPath = 'left'
        }
        if (object.x == objX && object.y == objY) {
            this.physics.backMove(object, dist)
            object.currentPath = this.getRandomPath(object.currentPath)
        }
    }

    getRandomPath(lastPath) {
        let directions = ['none', 'left', 'up', 'right', 'down'];
        let rand = Math.floor(Math.random() * 4) + 1
        if (directions[rand] == lastPath || directions[rand - 2] == lastPath || directions[rand + 2] == lastPath)
            return this.getRandomPath(lastPath)
        else
            return directions[rand]
    }

    playerDies() {
        if (this.unit.livesAmmount > 1) {
            this.interface.decreaseLives()
            this.unit.player.x = this.map.horizontalShift + this.map.blockSize * 2 + this.map.blockSize / 10;
            this.unit.player.y = this.map.verticalShift + this.map.blockSize * 26 + this.map.blockSize / 10;
            this.unit.player.currentPath = 'none'
            for (let enemy of this.unit.enemies) {
                enemy.x = this.unit.enemyStartingPoint[enemy.index][0]
                enemy.y = this.unit.enemyStartingPoint[enemy.index][1]
                enemy.currentPath = 'none'
                enemy.delay = enemy.index * 150;
            }
        } else if (this.unit.livesAmmount == 1){
            this.endGame(false)
        }
    }

    endGame(status){
        this.gcc.updateRank(this.interface.score, Math.round(this.interface.time / 60), this.unit.enemiesAmmount, this.unit.livesAmmount, status)
    }
}