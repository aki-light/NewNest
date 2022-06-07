import Transition from '../../interfaces/Transition';
import * as PIXI from 'pixi.js';

export default class Immediate implements Transition {
    private onTransitionFinished: () => void = () => {};
    private finished: boolean = false;

    public getContainer(): PIXI.Container | null {
        return null;
    }

    public begin(): void {
        this.finished = true;
        this.onTransitionFinished();
    }

    public isBegan(): boolean {
        return false;
    }

    public isFinished(): boolean {
        return this.finished;
    }

    public isActive(): boolean {
        return false;
    }

     public update(_dt: number): void {
         return;
     }
     
     public setCallback(callback: () => void): void {
         this.onTransitionFinished = callback;
     }
}