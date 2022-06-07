import * as PIXI from 'pixi.js';
import Resource from '../Resources';
import GameManager from '../managers/GameManager';

export default class OptionButton extends PIXI.Container {
    protected optionButton: PIXI.Text | PIXI.Sprite;
    protected frameSprite: PIXI.Sprite;
    public isActive: boolean = false;
    public optionType: number;
    public static get resourceList(): string[] {
        return [Resource.UI.OptionFrame, Resource.UI.ItemSelectFrame];
    }

    constructor(optionButton: PIXI.Text | PIXI.Sprite, optionType: number) {
        super();
        
        this.optionButton = optionButton;
        this.optionType = optionType;
        this.frameSprite = new PIXI.Sprite();

        const frameTexture = GameManager.game.loader.resources[Resource.UI.OptionFrame].texture;
        if(frameTexture) this.frameSprite.texture = frameTexture;
        if(optionButton instanceof PIXI.Text) {
            this.frameSprite.scale.set((this.optionButton.width + 40) / this.frameSprite.width,
                                      (this.optionButton.height + 10) / this.frameSprite.height);
        } else {
            this.frameSprite.scale.set((this.optionButton.texture.width) / this.frameSprite.width,
                                      (this.optionButton.texture.height) / this.frameSprite.height)
        }
        
        this.frameSprite.anchor.set(0.5, 0.5);
                    
        this.frameSprite.visible = false;
        this.optionButton.addChild(this.frameSprite);
        this.addChild(this.optionButton);
    }

    public activate(): void {
        this.isActive = true;    
        this.frameSprite.visible = true;
    }

    public deactivate(): void {
        this.isActive = false;
        this.frameSprite.visible = false;
    }
}