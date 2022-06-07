import * as PIXI from 'pixi.js';
import UpdateObject from '../../interfaces/UpdateObject';

export default class TextEffect extends PIXI.Container implements UpdateObject {
        private elapsedFrameCount: number = 0;
        private text: PIXI.Text;
        public static get resourceList(): string[] {
            return [];
        }
        private onAnimationEnded: () => void = () => {}; 

        constructor(text: PIXI.Text, onAnimationEnded: () => void) {
            super();

            this.text = text;
            this.text.anchor.set(0.5, 0.5);
            this.text.alpha = 0;
            this.text.position.set(0, 0)
            
            this.onAnimationEnded = onAnimationEnded;
            
            this.addChild(this.text);
        }

        public isDestroyed(): boolean {
            return this._destroyed;
        }

        public update(_delta: number): void {
            if(this.isDestroyed()) return;
            
            this.elapsedFrameCount++;
            if(this.elapsedFrameCount <= 25) {
                this.text.alpha += 0.04;
            } 
            
            if(this.elapsedFrameCount >= 0 && this.elapsedFrameCount <= 10) {
                this.text.position.y -= 5;
            }

            if(this.elapsedFrameCount === 50) {
                this.destroy();
                this.onAnimationEnded();
            } 
        }

    }