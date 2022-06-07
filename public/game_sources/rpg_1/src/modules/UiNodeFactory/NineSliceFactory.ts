import UiNodeFactory from './UiNodeFactory';
import * as UI from '../../interfaces/UiGraph/index';
import * as PIXI from 'pixi.js';

export default class NineSliceFactory extends UiNodeFactory {
    public createUiNode(nodeParams: UI.NineSliceNodeParams): PIXI.Container | null {
        let nineSlice;

        if(nodeParams) {
            const textureName = nodeParams.textureName;
            if(textureName && PIXI.utils.TextureCache[textureName]) {
                if(nodeParams.perimeter) {
                    nineSlice = new PIXI.NineSlicePlane(PIXI.utils.TextureCache[textureName],
                                ...nodeParams.perimeter);
                } else {
                    nineSlice = new PIXI.NineSlicePlane(PIXI.utils.TextureCache[textureName]);
                }
                
            }
            if(nodeParams.scale) {
                if(nineSlice){
                    nineSlice.width = nodeParams.scale[0];
                    nineSlice.height = nodeParams.scale[1];
                }
                
            }
        }
        if(!nineSlice) return null;
        return nineSlice; 
    }
}