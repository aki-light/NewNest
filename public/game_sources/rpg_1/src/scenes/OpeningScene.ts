import GameManager from '../managers/GameManager';
import Scene from './Scene';
import InventoryScene from './InventoryScene';
import Fade from './transition/Fade';
import Resource from '../Resources';
import LoaderAddParam from '../interfaces/LoaderAddParams';
import SoundManager from '../managers/SoundManager';
import UiGraph from '../modules/UiGraph';
import * as UI from '../interfaces/UiGraph/index';

export default class OpeningScene extends Scene {
    private lanuguage: string = '';

    constructor(language: string) {
        super();
        this.sceneName = 'opening_scene';

        this.lanuguage = language;
        
        this.transitionIn = new Fade(1.0, 0.0, -0.02);
        this.transitionOut = new Fade(0.0, 1.0, 0.02);
    }

    protected createInitialResourceList(): (LoaderAddParam | string)[] {
        const assets = super.createInitialResourceList();
        assets.push(Resource.Audio.Se.OptionTap2);
        return assets;
    }

    protected onResourceLoaded(): void {
        super.onResourceLoaded();
        if(this.lanuguage === 'japanese') {
            const text = this.uiGraph.get('opening_text');
            if(!text) return;
            this.uiGraphContainer.addChild(text);
        } else {
            const text = this.uiGraph.get('opening_text_en');
            if(!text) return;
            this.uiGraphContainer.addChild(text);
        }
        this.addChild(this.uiGraphContainer);
        this.initSound();
    }

    private initSound(): void {
        const resources = GameManager.game.loader.resources as any;
        const soundList = [
            Resource.Audio.Se.OptionTap2
          ];
          for(const name of soundList) {
              SoundManager.createSound(name, resources[name].buffer);
          }
    }

    public showInventoryScene(): void {
        if(this.isOver) return;
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        this.isOver = true;
        SoundManager.playSe(Resource.Audio.Se.OptionTap2);
        GameManager.loadScene(new InventoryScene(this.lanuguage));
    }

    protected prepareUiGraphContainer(uiData: UI.Graph): void {
        for(const nodeData of uiData.nodes) {
            const factory = UiGraph.getFactory(nodeData.type) || this.getCustomUiGraphFactory(nodeData.type);
            if(!factory) continue;

            const node = factory.createUiNodeByGraphElement(nodeData);
            if(!node) continue;

            if(nodeData.events) factory.attachUiEventByGraphElement(nodeData.events, node, this);
            
            this.uiGraph.set(nodeData.id, node);
            if(nodeData.type !== 'text') {
                this.uiGraphContainer.addChild(node);
            }
        }
    }
}