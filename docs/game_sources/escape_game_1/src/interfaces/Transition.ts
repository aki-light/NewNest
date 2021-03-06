import * as PIXI from 'pixi.js';

export default interface Transition {
    getContainer(): PIXI.Container | null;
    begin(afterFinishedVisible?: boolean): void;
    isBegan(): boolean;
    isFinished(): boolean;
    isActive(): boolean;
    update(dt: number): void;
    setCallback(callback: () => void): void;
}