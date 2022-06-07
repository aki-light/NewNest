import UiNodeFactory from './UiNodeFactory';
import * as UI from '../../interfaces/UiGraph/index';
import * as PIXI from 'pixi.js';
import ItemPanel from '../../display/ItemPanel';

export default class ItemPanelFactory extends UiNodeFactory {
    public createUiNode(nodeParams: UI.ItemPanelNodeParams): PIXI.Container | null {
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
        const container = new ItemPanel(sprite, nodeParams.itemType, nodeParams.itemTextId,
                                        nodeParams.optionType, nodeParams.optionId);
        return container; 
    }
}