import * as PIXI from 'pixi.js';
import Resource from '../Resources';
import GameManager from '../managers/GameManager';
import SoundManager from '../managers/SoundManager';

export default class Tile extends PIXI.Container {
    public tileSprite: PIXI.Sprite;
    private tileFrameSprite: PIXI.Sprite;
    public  tilePosition: [number, number];
    public isActive: boolean = false;
    public touchable: boolean = false;

    constructor(tileType: number, tilePosition: [number, number], tileSize: number) {
        super();
        
        this.tilePosition = tilePosition;
        this.tileSprite = new PIXI.Sprite();
        this.tileFrameSprite = new PIXI.Sprite();
        
        const tileTexture = GameManager.game.loader.resources[Resource.Dynamic.tiles(tileType)].texture;
        const tileFrameTexture = GameManager.game.loader.resources[Resource.UI.TileFrame].texture;
        if(tileTexture) this.tileSprite.texture = tileTexture;
        this.tileSprite.scale.set(tileSize / this.tileSprite.width, tileSize / this.tileSprite.height);
        if(tileFrameTexture) this.tileFrameSprite.texture = tileFrameTexture;
        this.tileFrameSprite.scale.set(tileSize / this.tileFrameSprite.width, tileSize / this.tileFrameSprite.height);
        this.tileFrameSprite.visible = false;
        
        this.addChild(this.tileSprite);
        this.addChild(this.tileFrameSprite);
    }

    public toggleFrame(): void {
        if(!this.touchable) return;
        SoundManager.playSe(Resource.Audio.Se.TileTap);
        this.isActive = !this.isActive;    
        this.tileFrameSprite.visible = !this.tileFrameSprite.visible;
    }
}