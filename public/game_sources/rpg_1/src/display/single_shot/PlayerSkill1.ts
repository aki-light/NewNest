import * as PIXI from 'pixi.js';
import Resource from '../../Resources';
import UpdateObject from '../../interfaces/UpdateObject';
import SoundManager from '../../managers/SoundManager';

export default class PlayerSkill1Effect extends PIXI.Container implements UpdateObject {
        public static readonly TextureFrameUpdateFrequency: number = 2;
        private elapsedFrameCount: number = 0;
        private sprite!: PIXI.Sprite;
        public static get resourceList(): string[] {
            return [Resource.Static.PlayerSkill1];
        }
        private onAnimationEnded: () => void = () => {};

        constructor(onAnimationEnded: () => void) {
            super();

            this.sprite = new PIXI.Sprite(Resource.TextureFrame.PlayerSkill1(1));
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
            
            const frequency = PlayerSkill1Effect.TextureFrameUpdateFrequency;
            if(this.elapsedFrameCount % frequency === 0) {
                const count = this.elapsedFrameCount / frequency;
                const index = Math.floor(count) + 1;
                if(index > Resource.MaxFrameIndex(Resource.Static.PlayerSkill1)) {
                    this.onAnimationEnded();
                    this.sprite.destroy();
                    this.destroy();
                    return;    
                }
                if(index === 4) {
                    SoundManager.playSe(Resource.Audio.Se.NormalAttack);
                }
                if(index === 12) {
                    SoundManager.playSe(Resource.Audio.Se.NormalAttack);
                }
                this.sprite.texture = Resource.TextureFrame.PlayerSkill1(index);
            }
        }
    }