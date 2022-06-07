import UiNodeFactory from './UiNodeFactory';
import * as UI from '../../interfaces/UiGraph/index';
import * as PIXI from 'pixi.js';
import OptionButton from '../../display/OptionButton';


export default class OptionButtonFactory extends UiNodeFactory {
    public createUiNode(nodeParams: UI.TextOptionNodeParams): PIXI.Container | null {
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
        const text = new PIXI.Text(nodeParams && nodeParams.text ? nodeParams.text : '', style);
        if(nodeParams && nodeParams.anchor !== undefined) {
            text.anchor.set(...nodeParams.anchor);
        }
        const optionType = nodeParams.optionType;
        const container = new OptionButton(text, optionType);
        
        return container;
    }
} 