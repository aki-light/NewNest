import * as PIXI from 'pixi.js';
import Resource from '../Resources';
import UpdateObject from '..//interfaces/UpdateObject';

export default class Boss implements UpdateObject {
    public sprite: PIXI.Sprite;
    public animationType: 'idle' | 'damaged' = 'idle';
    private elapsedFrameCount: number = 0;
    private destroyed: boolean = false;
    private onAnimationEnded: () => void = () => {}; 

    constructor(sprite: PIXI.Sprite) {
        this.sprite = sprite;
    }

    public isDestroyed(): boolean {
        return this.destroyed;
    }

    public destroy(): void {
        this.sprite.destroy();
        this.destroyed = true;
    }

    public update(_dt: number): void {
        this.updateAnimation();
    }

    public updateAnimation(): void {
        if(this.animationType === 'idle') return;
        
        if(this.animationType === 'damaged') {
            if(this.elapsedFrameCount === 8) {
                this.animationType = 'idle';
                this.sprite.position.x = 320;
                this.sprite.texture = PIXI.utils.TextureCache[Resource.Static.BossTexture.Idle];
                this.onAnimationEnded();
                return;
            }

            if(this.elapsedFrameCount  === 0) {
                this.sprite.texture = PIXI.utils.TextureCache[Resource.Static.BossTexture.Damaged];
                this.sprite.position.x = this.sprite.position.x + 10;
            } else if(this.elapsedFrameCount % 2 === 0) {
                let direction;
                if(this.sprite.position.x > 320) {
                    direction = -1;
                } else {
                    direction = 1;
                }
                this.sprite.position.x = this.sprite.position.x + 20 * direction;
            }
            this.elapsedFrameCount++;
        }
    }

    public requestAnimation(type: 'idle' | 'damaged', onAnimationEnded: () => void): void {
        this.elapsedFrameCount = 0;
        this.animationType = type;
        this.onAnimationEnded = onAnimationEnded
    } 
}