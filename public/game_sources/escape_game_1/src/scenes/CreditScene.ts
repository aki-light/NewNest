import GameManager from '../managers/GameManager';
import Scene from './Scene';
import TitleScene from './TitleScene';
import Fade from './transition/Fade';
import SoundManager from '../managers/SoundManager';
import Resource from '../Resources';
import * as PIXI from 'pixi.js';
import UiGraph from '../modules/UiGraph';
import * as UI from '../interfaces/UiGraph/index';


export default class CreditScene extends Scene {
    private creditContainer: PIXI.Container = new PIXI.Container();
    private currentPage: number = 0;
    private currentPageNumber: number = 1;

    constructor() {
        super();
        this.sceneName = 'credit_scene';
        
        this.transitionIn = new Fade(1.0, 0.0, -0.02);
        this.transitionOut = new Fade(0.0, 1.0, 0.02);
    }

    protected onResourceLoaded(): void {
        super.onResourceLoaded();
        this.addChild(this.uiGraphContainer);
        this.addChild(this.creditContainer);
    }

    public changePage(addNumber: number): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        if(addNumber < 0) {
            this.currentPageNumber += 1;
        } else {
            this.currentPageNumber -= 1;
        }

        this.currentPage = this.currentPage + addNumber;
        if(this.currentPage < -6) {
            this.currentPage = 0;
            this.currentPageNumber = 1;
        } else if(this.currentPage > 0) {
            this.currentPage = -6
            this.currentPageNumber = 7
        }
        this.creditContainer.position.x = this.currentPage * 640;

        const pageNumber = this.uiGraph.get('page_number');
        if(!pageNumber) return;
        (pageNumber as PIXI.Text).text = this.currentPageNumber.toString();
    }

    public showTitleScene(): void {
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        GameManager.loadScene(new TitleScene());
    }

    protected prepareUiGraphContainer(uiData: UI.Graph): void {
        for(const nodeData of uiData.nodes) {
            const factory = UiGraph.getFactory(nodeData.type) || this.getCustomUiGraphFactory(nodeData.type);
            if(!factory) continue;

            const node = factory.createUiNodeByGraphElement(nodeData);
            if(!node) continue;

            if(nodeData.events) factory.attachUiEventByGraphElement(nodeData.events, node, this);
            
            this.uiGraph.set(nodeData.id, node);

            if(nodeData.type === 'credit_text') {
                this.creditContainer.addChild(node)
            } else {
                this.uiGraphContainer.addChild(node);
            }
        }
    }
}