import UiNodeFactory from './UiNodeFactory';
import * as UI from '../../interfaces/UiGraph/index';
import * as PIXI from 'pixi.js';


export default class TextFactory extends UiNodeFactory {
    public createUiNode(nodeParams: UI.TextNodeParams): PIXI.Container | null {
        const textStyleParams: any = {};

        if(nodeParams) {
            if(nodeParams.family !== undefined) {
                textStyleParams.fontFamily = nodeParams.family;
            }
            if(nodeParams.size !== undefined) {
                textStyleParams.fontSize = nodeParams.size;
            }
            if(nodeParams.color !== undefined) {
                textStyleParams.fill = nodeParams.color;
            }
            if(nodeParams.padding !== undefined) {
                textStyleParams.padding = nodeParams.padding;
            }
            if(nodeParams.wordWrap !== undefined) {
                textStyleParams.wordWrap = nodeParams.wordWrap;
            }
            if(nodeParams.wordWrapWidth !== undefined) {
                textStyleParams.wordWrapWidth = nodeParams.wordWrapWidth;
            }
        }

        const style = new PIXI.TextStyle(textStyleParams);
        const container = new PIXI.Text(nodeParams && nodeParams.text ? nodeParams.text : '', style);
       
        if(nodeParams && nodeParams.anchor !== undefined) {
            container.anchor.set(...nodeParams.anchor);
        }
        return container;
    }
} 