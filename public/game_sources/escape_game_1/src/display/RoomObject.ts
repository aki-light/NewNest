import * as PIXI from 'pixi.js';
import RoomObjectNodeParams from '../interfaces/UiGraph/RoomObjectNodeParams';

export default class RoomObject extends PIXI.Container {
    public sprite: PIXI.Sprite;
    public downTiles: [number, number][]
    public messageIds: (string | string[])[];

    constructor(texture: PIXI.Texture, roomObjectNodeParams: RoomObjectNodeParams) {
        super();
        
        this.messageIds = this.copyMessageIds(roomObjectNodeParams.messageIds);
        this.downTiles = roomObjectNodeParams.downTiles.concat();
        this.sprite = new PIXI.Sprite();
        this.sprite.texture = texture;
        if(roomObjectNodeParams.anchor) {
            this.sprite.anchor.set(...roomObjectNodeParams.anchor);
        }
        if(roomObjectNodeParams.scale) {
            this.sprite.scale.set(...roomObjectNodeParams.scale);
        }

        this.addChild(this.sprite);
    }

    private copyMessageIds(messageIds: (string | string[])[]): (string | string[])[] {
        const copy = [];
        for(const id of messageIds) {
            if(id instanceof String) {
                copy.push(id);
            } else {
                copy.push(id.concat());
            }
        }
        return copy;
    }
}