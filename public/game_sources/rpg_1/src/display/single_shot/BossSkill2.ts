import * as PIXI from 'pixi.js';
import Resource from '../../Resources';
import UpdateObject from '../../interfaces/UpdateObject';
import SoundManager from '../../managers/SoundManager';

export default class BossSkill2Effect extends PIXI.Container implements UpdateObject {
        public static readonly TextureFrameUpdateFrequency: number = 3;
        private elapsedFrameCount: number = 0;
        private sprite!: PIXI.Sprite;
        public static get resourceList(): string[] {
            return [Resource.Static.BossSkill2, Resource.Audio.Se.BossSkill_2];
        }
        private onAnimationEnded: () => void = () => {};

        constructor(onAnimationEnded: () => void) {
            super();

            this.sprite = new PIXI.Sprite(Resource.TextureFrame.BossSkill2(1));
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
            
            const frequency = BossSkill2Effect.TextureFrameUpdateFrequency;
            if(this.elapsedFrameCount % frequency === 0) {
                const count = this.elapsedFrameCount / frequency;
                const index = Math.floor(count) + 1;
                if(index > Resource.MaxFrameIndex(Resource.Static.BossSkill2)) {
                    this.onAnimationEnded();
                    this.sprite.destroy();
                    this.destroy();
                    return;    
                }
                if(index === 2) {
                    SoundManager.playSe(Resource.Audio.Se.BossSkill_2);
                }
                this.sprite.texture = Resource.TextureFrame.BossSkill2(index);
            }
        }
    }