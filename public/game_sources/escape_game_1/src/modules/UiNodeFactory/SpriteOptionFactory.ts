import UiNodeFactory from './UiNodeFactory';
import * as UI from '../../interfaces/UiGraph/index';
import * as PIXI from 'pixi.js';
import OptionButton from '../../display/OptionButton';

export default class SpriteOptionFactory extends UiNodeFactory {
    public createUiNode(nodeParams: UI.SpriteOptionNodeParams): PIXI.Container | null {
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
        const optionType = nodeParams.optionType;
        const container = new OptionButton(sprite, optionType);
        return container; 
    }
}