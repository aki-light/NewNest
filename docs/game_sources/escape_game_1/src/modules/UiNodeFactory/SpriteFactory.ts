import UiNodeFactory from './UiNodeFactory';
import * as UI from '../../interfaces/UiGraph/index';
import * as PIXI from 'pixi.js';

export default class SpriteFactory extends UiNodeFactory {
    public createUiNode(nodeParams: UI.SpriteNodeparams): PIXI.Container | null {
        const sprite = new PIXI.Sprite();

        if(nodeParams) {
            const textureName = nodeParams.textureName;
            if(textureName && PIXI.utils.TextureCache[textureName]) {
                sprite.texture = PIXI.utils.TextureCache[textureName];
            }
            if(nodeParams.anchor) {
                sprite.anchor.set(...nodeParams.anchor);
            }
            if(nodeParams.scale) {
                sprite.scale.set(...nodeParams.scale);
            }
        }
        return sprite; 
    }
}