import * as PIXI from 'pixi.js';
import UpdateObject from '../interfaces/UpdateObject';
import PlayerAnimationMaster from '../interfaces/master/PlayerAnimationMaster';
import { PlayerAnimationTypeIndex } from '../interfaces/master/PlayerAnimationMaster';
import Resource from '../Resources';

export default class Player implements UpdateObject {
    public sprite: PIXI.Sprite;
    public animationType: string;
    private elapsedFrameCount: number = 0;
    private destroyed: boolean = false;
    private animationMaster: PlayerAnimationMaster;
    private animationFrameId: number = 0;
    private requestedAnimationType: string | null = null;
    public spawnedPosition: PIXI.Point;

    constructor(animationMaster: PlayerAnimationMaster, tileSize: number, 
                spawnPosition: {x: number, y: number}) {
        this.sprite = new PIXI.Sprite();
        const playerTexture = PIXI.utils.TextureCache[animationMaster.types.wait.frames[0]];
        this.sprite.texture = playerTexture;
        this.reSizeSprite(tileSize);
        const widthMargin = tileSize - this.sprite.width;
        const heightMargin = tileSize - this.sprite.height;
        this.sprite.position.set(
            spawnPosition.x + widthMargin / 2,
            spawnPosition.y + heightMargin / 2
        );
        this.spawnedPosition = new PIXI.Point(
            this.sprite.position.x,
            this.sprite.position.y
        );
        this.animationMaster = animationMaster;
        this.animationType = Resource.AnimationTypes.Player.WAIT;
    }

    public isDestroyed():boolean {
        return this.destroyed;
    }

    public update(_dt: number): void {
        if(this.requestedAnimationType) {
            if(this.requestedAnimationType !== this.animationType) {
                this.animationType = this.requestedAnimationType;
                this.resetAnimation();
            }
        }
        this.updateAnimation();
    }

    public requestAnimation(type: string): void {
        this.requestedAnimationType = type;
    } 

    private resetAnimation(): void {
        this.requestedAnimationType = null;
        this.elapsedFrameCount = 0;
        this.animationFrameId = 0;
    }

    private updateAnimation(): void {
        const index = this.animationType as PlayerAnimationTypeIndex;
        const animation = this.animationMaster.types[index];
        if(!animation) return;
        
        if((this.elapsedFrameCount % animation.updateDuration) === 0) {
            if(this.isAnimationLastFrameTime()) {
                this.resetAnimation();
            }
            const cacheKey = animation.frames[this.animationFrameId];
            this.sprite.texture = PIXI.utils.TextureCache[cacheKey];

            this.animationFrameId++;
        }
            this.elapsedFrameCount++; 
    }

    private isAnimationLastFrameTime(): boolean {
        const index = this.animationType as PlayerAnimationTypeIndex;
        const animation = this.animationMaster.types[index];
        if(!animation) return false;
        
        const duration = animation.updateDuration;
        const lastId = animation.frames.length;
        const maxFrameTime = duration * lastId;
        return this.elapsedFrameCount === maxFrameTime;
    }

    public destroy(): void {
        this.sprite.destroy();
        this.destroyed = true;
    }

    private reSizeSprite(tileSize: number): void {
        const playerWidthRatio = this.sprite.width / this.sprite.height;
        const tileWidthRatio = tileSize / tileSize;

        if(tileWidthRatio > playerWidthRatio) {
            this.sprite.scale.x = (tileSize / this.sprite.width) * (this.sprite.width / this.sprite.height);
            this.sprite.scale.y = tileSize / this.sprite.height;
        } else {
            this.sprite.scale.x = tileSize / this.sprite.width;
            this.sprite.scale.y = (tileSize / this.sprite.height) * (this.sprite.height / this.sprite.width); 
        }
    }
}

        