import * as PIXI from 'pixi.js';
import Resource from '../../Resources';
import UpdateObject from '../../interfaces/UpdateObject';
import SoundManager from '../../managers/SoundManager';

export default class MagicTool1Effect extends PIXI.Container implements UpdateObject {
        public static readonly TextureFrameUpdateFrequency: number = 3;
        private elapsedFrameCount: number = 0;
        private sprite!: PIXI.Sprite;
        public static get resourceList(): string[] {
            return [Resource.Static.MagicTool1, Resource.Audio.Se.MagicTool1];
        }
        private onAnimationEnded: () => void = () => {};

        constructor(onAnimationEnded: () => void) {
            super();

            this.sprite = new PIXI.Sprite(Resource.TextureFrame.MagicTool1(1));
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
            
            const frequency = MagicTool1Effect.TextureFrameUpdateFrequency;
            if(this.elapsedFrameCount % frequency === 0) {
                const count = this.elapsedFrameCount / frequency;
                const index = Math.floor(count) + 1;
                if(index > Resource.MaxFrameIndex(Resource.Static.MagicTool1)) {
                    this.onAnimationEnded();
                    this.sprite.destroy();
                    this.destroy();
                    return;    
                }
                if(index === 2) {
                    SoundManager.playSe(Resource.Audio.Se.MagicTool1);
                }
                this.sprite.texture = Resource.TextureFrame.MagicTool1(index);
            }
        }
    }