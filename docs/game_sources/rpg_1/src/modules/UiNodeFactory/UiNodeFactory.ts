import * as UI from '../../interfaces/UiGraph/index';
import * as PIXI from 'pixi.js';

export default class UiNodeFactory {

    public createUiNode(params: UI.NodeParams): PIXI.Container | null {
        return new PIXI.Container();
    }

    public createUiNodeByGraphElement(nodeData: UI.Node): PIXI.Container | null {
        const node = this.createUiNode(nodeData.params);
  
        if(node) {
            node.name = nodeData.id;
            node.position.set(nodeData.position[0], nodeData.position[1]);
            if(nodeData.invisible) node.visible = false;
            if(nodeData.interactive === true) node.interactive = true;
            if(nodeData.buttonMode === true) node.buttonMode = true;          
        }        
        return node;
    }

    public attachUiEventByGraphElement(events: UI.Event[], node: PIXI.Container, target: any): void {
        for(const event of events) {
            const fx = target[event.callback];
            if(!fx) continue;

            node.on(event.type, () => fx.call(target, ...event.arguments));
        }
    }
}