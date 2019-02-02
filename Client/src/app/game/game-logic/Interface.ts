import * as PIXI from './../../../pixi.min.js'
import { Unit } from './Unit.js';
import { Map } from './Map.js';

export class Interface {

    private stage: any;
    private unit: Unit
    private map: Map

    public timeWord: PIXI.Text;
    public time: number;
    public scoreWord: PIXI.Text;
    public score: number;
    public livesWord: PIXI.Text;

    constructor(stage, unit, map) {

        this.stage = stage;
        this.unit = unit;
        this.map = map;
        this.time = 0
        this.score = 0

        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: this.map.blockSize,
            fill: "white",
            stroke: '#0000FF',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });

        this.timeWord = new PIXI.Text('Time: ' + this.time, style);
        this.stage.addChild(this.timeWord);
        this.timeWord.position.set(this.map.horizontalShift + this.map.blockSize * 2, this.map.verticalShift - this.map.blockSize * 2);

        this.scoreWord = new PIXI.Text('Score: ' + this.score, style);
        this.stage.addChild(this.scoreWord);
        this.scoreWord.position.set(this.map.horizontalShift + this.map.blockSize * 12, this.map.verticalShift - this.map.blockSize * 2);

        this.livesWord = new PIXI.Text('Lives: ' + this.unit.livesAmmount, style);
        this.stage.addChild(this.livesWord);
        this.livesWord.position.set(this.map.horizontalShift + this.map.blockSize * 22, this.map.verticalShift - this.map.blockSize * 2);
    }

    public updateTime(delta) {
        this.time += delta
        this.timeWord.text = 'Time: ' + Math.round(this.time / 60);
    }

    public updateScore(points){
        this.score += points
        this.scoreWord.text = 'Score: ' + this.score
    }

    public decreaseLives(){
        this.unit.livesAmmount -= 1
        this.livesWord.text = 'Lives: ' + this.unit.livesAmmount;
    }

}