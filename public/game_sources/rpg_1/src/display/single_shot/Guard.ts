import * as PIXI from 'pixi.js';
import Resource from '../../Resources';
import UpdateObject from '../../interfaces/UpdateObject';
import SoundManager from '../../managers/SoundManager';

export default class GuardEffect extends PIXI.Container implements UpdateObject {
        public static readonly TextureFrameUpdateFrequency: number = 8;
        private elapsedFrameCount: number = 0;
        private sprite!: PIXI.Sprite;
        public static get resourceList(): string[] {
            return [Resource.Static.Guard, Resource.Audio.Se.Guard];
        }
        private onAnimationEnded: () => void = () => {};

        constructor(onAnimationEnded: () => void) {
            super();

            this.sprite = new PIXI.Sprite(Resource.TextureFrame.Guard(1));
            this.sprite.anchor.set(0.5, 0.5);
            this.addChild(this.sprite);
            this.onAnimationEnded = onAnimationEnded;
        }

        public isDestroyed(): boolean {
            return this._destroyed;
        }

        public update(_delta: number): void {
            if(this.isDestroyed()) return;
            
            this.elapsedFrameCount++;
            
            const frequency = GuardEffect.TextureFrameUpdateFrequency;
            if(this.elapsedFrameCount % frequency === 0) {
                const count = this.elapsedFrameCount / frequency;
                const index = Math.floor(count) + 1;
                if(index > Resource.MaxFrameIndex(Resource.Static.Guard)) {
                    this.onAnimationEnded();
                    this.sprite.destroy();
                    this.destroy();
                    return;    
                }
                if(index === 3) {
                    SoundManager.playSe(Resource.Audio.Se.Guard);
                }
                this.sprite.texture = Resource.TextureFrame.Guard(index);
            }
        }
    }