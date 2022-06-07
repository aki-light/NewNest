import GameManager from '../managers/GameManager';
import Scene from './Scene';
import TitleScene from './TitleScene';
import Fade from './transition/Fade';
import Resource from '../Resources';
import LoaderAddParam from '../interfaces/LoaderAddParams';
import SoundManager from '../managers/SoundManager';
import * as PIXI from 'pixi.js';

export default class ScoreScene extends Scene {
    private language: string;
    private cp: number;
    private turn: number;
    private bossHp: number;

    constructor(language: string, cp: number, turn: number, boossHp: number) {
        super();
        this.sceneName = 'score_scene';
        
        this.transitionIn = new Fade(1.0, 0.0, -0.02);
        this.transitionOut = new Fade(0.0, 1.0, 0.02);

        this.language = language;
        this.cp = cp;
        this.turn = turn;
        this.bossHp = boossHp;
    }

    protected createInitialResourceList(): (LoaderAddParam | string)[] {
        const assets = super.createInitialResourceList();
        assets.push(Resource.Audio.Se.OptionTap2);
        return assets;
    }

    protected loadInitialResource(onLoaded: () => void): void {
        const assets = this.createInitialResourceList();
        const name1 = Resource.UI.SceneUiGraph(this.sceneName);
        let name2;
        if(this.language === 'japanese') {
            name2 = Resource.Texts.ScoreScene.Ja;
        } else {
            name2 = Resource.Texts.ScoreScene.En
        }

        assets.push(name1);
        assets.push(name2);
        
        const filteredAssets = this.filterLoadedAssets(assets);

        if(filteredAssets.length > 0) {
            GameManager.game.loader.add(filteredAssets).load(onLoaded);
        } else {
            onLoaded();
        }        
    }

    protected onInitialResourceLoaded(): (string | LoaderAddParam)[] {
        const additionalAssets = [];
        
        const name1 = Resource.UI.SceneUiGraph(this.sceneName);
       
        let name2;
        if(this.language === 'japanese') {
            name2 = Resource.Texts.ScoreScene.Ja;
        } else {
            name2 = Resource.Texts.ScoreScene.En;
        }
        let uiGraphNodes = GameManager.game.loader.resources[name1].data.nodes;
        uiGraphNodes = uiGraphNodes.concat(GameManager.game.loader.resources[name2].data.nodes);
        
        for(const node of uiGraphNodes) {
            if(node.type === 'sprite') {
                additionalAssets.push({ name: node.params.textureName, url: node.params.url }); 
            } 
        }
        return additionalAssets; 
    }

    protected onResourceLoaded(): void {
        const json1 = GameManager.game.loader.resources[Resource.UI.SceneUiGraph(this.sceneName)].data;
        let name1;
        if(this.language === 'japanese') {
            name1 = Resource.Texts.ScoreScene.Ja;
        } else {
            name1 = Resource.Texts.ScoreScene.En;
        }
        const json2 = GameManager.game.loader.resources[name1].data;
        this.prepareUiGraphContainer(json1);
        this.prepareUiGraphContainer(json2);

        this.uiGraphContainer.zIndex = 1;
        this.addChild(this.uiGraphContainer);
        this.initSound();
        this.initScore();
    }

    private initScore(): void {
        const score = this.uiGraph.get('score');
        const easy = this.uiGraph.get('difficulty_easy');
        const normal = this.uiGraph.get('difficulty_normal');
        const hard = this.uiGraph.get('difficulty_hard');
        const cp = this.uiGraph.get('cp');
        const turn = this.uiGraph.get('turn');
        const bossHp = this.uiGraph.get('boss_hp');
        if(!score || !easy || !normal || !hard || !cp || !turn || !bossHp) return;

        let difficultyBonus: number = 0;
        let turnRate: number = 0;
        if(this.cp >= 8000) {
            difficultyBonus = 10000;
            turnRate = 500;
            easy.visible = true;
        } else if(this.cp >= 7000 && this.cp < 8000) {
            difficultyBonus = 15000;
            turnRate = 400;
            normal.visible = true;
        } else if(this.cp < 7000) {
            difficultyBonus = 20000;
            turnRate = 300;
            hard.visible = true;
        }
        let bossBonus: number = 0;
        if(this.bossHp <= 0) {
            bossBonus = 50000;
            (bossHp as PIXI.Text).text = '0';
        } else {
            bossBonus = -this.bossHp * 20;
            (bossHp as PIXI.Text).text = this.bossHp.toString();
        }
        (turn as PIXI.Text).text = this.turn.toString();
        (cp as PIXI.Text).text = this.cp.toString();
        let totalScore = (difficultyBonus * ((13400 - this.cp) / 1000) - this.turn * turnRate +
                          bossBonus);
        if(totalScore <= 0) {
            totalScore = 0;
        }
        (score as PIXI.Text).text = totalScore.toString();
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

    public showTitleScene(): void {
        if(this.isOver) return;
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        this.isOver = true;
        SoundManager.playSe(Resource.Audio.Se.OptionTap2);
        GameManager.loadScene(new TitleScene());
    }
}