import Transition from '../../interfaces/Transition';
import * as PIXI from 'pixi.js';
import GameManager from '../../managers/GameManager';

export default class Fade implements Transition {
    private alphaFrom!: number;
    private alphaTo!: number;
    private alphaProgress: number;
    private container = new PIXI.Container();
    private overlay = new PIXI.Graphics();
    private transitionBegan: boolean = false;
    private transitionFinished: boolean = false;
    private onTransitionFinished: () => void = () => {};
    private afterFinishedVisible: boolean = false;

    constructor(alphaFrom: number, alphaTo: number, alphaProgress: number) {
        this.alphaFrom = alphaFrom;
        this.alphaTo = alphaTo;
        this.alphaProgress = alphaProgress;
        
        const width = GameManager.game.view.width;
        const height = GameManager.game.view.height;

        this.overlay.beginFill(0x000000);
        this.overlay.moveTo(0, 0);
        this.overlay.lineTo(width, 0);
        this.overlay.lineTo(width, height);
        this.overlay.lineTo(0, height);
        this.overlay.endFill();

        this.overlay.alpha = this.alphaFrom;

        this.container.addChild(this.overlay);
    }

    public getContainer(): PIXI.Container | null {
        return this.container;
    }

    public begin(afterFinishedVisible: boolean = true): void {
        this.afterFinishedVisible = afterFinishedVisible;
        this.container.visible = true;
        this.overlay.alpha = this.alphaFrom;
        this.transitionBegan = true;
        this.transitionFinished = false;
    }

    public isBegan(): boolean {
        return this.transitionBegan;
    }

    public isFinished(): boolean {
        return this.transitionFinished;
    }

    public isActive(): boolean {
        return this.isBegan() && !this.isFinished();
    }

     public update(_dt: number): void {
         if(
             (this.alphaTo <= this.alphaFrom && this.overlay.alpha <= this.alphaTo)
             ||
             (this.alphaTo >= this.alphaFrom && this.overlay.alpha >= this.alphaTo)
         ) { 
             if(!this.afterFinishedVisible) {
                this.container.visible = false;
             }
             this.transitionBegan = false;
             this.onTransitionFinished();
             this.transitionFinished = true;
         } else {
             this.overlay.alpha += this.alphaProgress;  
         }
     }
     
     public setCallback(callback: () => void): void {
         this.onTransitionFinished = callback;
     }
}