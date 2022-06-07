import GameManager from '../managers/GameManager';
import Scene from './Scene';
import TitleScene from './TitleScene';
import Fade from './transition/Fade';
import Resource from '../Resources';
import LoaderAddParam from '../interfaces/LoaderAddParams';
import SoundManager from '../managers/SoundManager';
import * as PIXI from 'pixi.js';


export default class StartScene extends Scene {
    private startButton!: PIXI.Container;

    constructor() {
        super();
        this.sceneName = 'start_scene';
        
        this.transitionIn = new Fade(1.0, 0.0, -0.02);
        this.transitionOut = new Fade(0.0, 1.0, 0.02);

        this.interactive = true;
        this.on('pointerdown', () => { this.showTitleScene(); })
    }

    protected createInitialResourceList(): (LoaderAddParam | string)[] {
        const assets = super.createInitialResourceList();
        assets.push(Resource.Audio.Se.OptionTap);
        return assets;
    }

    public update(dt: number): void {
        super.update(dt);
        
        if(this.elapsedFrameCount % 40 === 0) {
            this.startButton.visible = !this.startButton.visible;
        }
    }

    protected onResourceLoaded(): void {
        super.onResourceLoaded();
        this.addChild(this.uiGraphContainer);
        const startButton = this.uiGraph.get('start_button');
        if(!startButton) return;
        this.startButton = startButton;
        this.initSound();
    }

    private initSound(): void {
        const resources = GameManager.game.loader.resources as any;
        const soundList = [
            Resource.Audio.Se.OptionTap
          ];
          for(const name of soundList) {
              SoundManager.createSound(name, resources[name].buffer);
          }
    }

    public showTitleScene(): void {
        if(this.isOver) return;
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        this.isOver = true;
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        GameManager.loadScene(new TitleScene());
    }
}