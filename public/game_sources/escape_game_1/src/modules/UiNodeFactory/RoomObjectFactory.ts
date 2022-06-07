import UiNodeFactory from "./UiNodeFactory";
import * as UI from '../../interfaces/UiGraph/index'
import * as PIXI from 'pixi.js';
import RoomObject from "../../display/RoomObject";

export default class RoomObjectFactory extends UiNodeFactory {
    public createUiNode(nodeParams: UI.RoomObjectNodeParams): PIXI.Container | null {
        let texture;

        if(nodeParams) {
            const textureName = nodeParams.textureName;
            if(textureName && PIXI.utils.TextureCache[textureName]) {
                texture = PIXI.utils.TextureCache[textureName]; 
            }
        }
        if(!texture) return null;
        return new RoomObject(texture, nodeParams);
    }
}