import * as PIXI from 'pixi.js';
import Resource from '../Resources';
import OptionButton from './OptionButton';
import GameManager from '../managers/GameManager';

export default class ItemPanel extends OptionButton {
    public hasItem: boolean = false;
    public itemType: number;
    public optionButton: PIXI.Sprite;
    public itemTextId: string;
    public optionId: string;

    constructor(optionButton: PIXI.Sprite, itemType: number, itemText: string, optionType: number, 
                optionId: string) {
        super(optionButton, optionType);
        this.itemType = itemType;
        this.optionButton = optionButton;
        this.itemTextId = itemText;
        this.optionId = optionId;
        const frameTexture = GameManager.game.loader.resources[Resource.UI.ItemSelectFrame].texture;
        if(frameTexture) this.frameSprite.texture = frameTexture;
        this.frameSprite.scale.set(1.0, 1.0);
    }

    public addItem(): void {
        this.hasItem = true;
        this.optionButton.texture = PIXI.utils.TextureCache[Resource.Dynamic.items(this.itemType)];
    }

    public removeItem(): void {
        this.hasItem = false;
        this.optionButton.texture = PIXI.utils.TextureCache[Resource.Dynamic.items(0)];
    }
}