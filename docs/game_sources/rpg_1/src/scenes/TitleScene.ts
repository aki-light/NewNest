import GameManager from '../managers/GameManager';
import Scene from './Scene';
import LoaderAddParam from '../interfaces/LoaderAddParams';
import Resource from '../Resources';
import SoundManager from '../managers/SoundManager';
import Fade from './transition/Fade';
import OptionScene from './OptionScene';
import CreditScene from './CreditScene';
import OpeningScene from './OpeningScene';
import IndexedDBManager from '../managers/IndexedDBManager';
import UiGraph from '../modules/UiGraph';
import * as UI from '../interfaces/UiGraph/index';
import * as PIXI from 'pixi.js';

export default class TitleScene extends Scene {
    private language!: string;
    private languageOption: PIXI.Container = new PIXI.Container();
    private equipment: PIXI.Sprite = new PIXI.Sprite();
    private equipmentMoveDistance!: number;
    private equipmentMoveRate: number = 0;
    private isEquipmentIn: boolean = true;

    constructor() {
        super();
        this.sceneName = 'title_scene';
        this.transitionIn = new Fade(1.0, 0.0, -0.02);
        this.transitionOut = new Fade(0.0, 1.0, 0.02);

        this.loadSaveDataFromDB();
    }

    protected createInitialResourceList(): (LoaderAddParam | string)[] {
        const assets = super.createInitialResourceList();
        assets.push(Resource.Audio.Bgm.TitleBgm);
        assets.push(Resource.Audio.Se.OptionTap);
        assets.push(Resource.Audio.Se.OptionTap3);
        return assets.concat(Resource.EquipMents);
    }

    public update(dt: number): void {
        super.update(dt);

        this.updateEquipMentIn();
        this.updateEquipMentOut();
    }

    protected onResourceLoaded(): void {
        super.onResourceLoaded();
        this.equipment.texture = this.getRandomTexture();
        this.equipment.position.x = 0;
        this.equipment.position.y = 250;
        this.equipment.scale.set(0.4, 0.4);
        this.equipment.anchor.set(1.0, 0.5);
        this.equipmentMoveDistance = 320 + this.equipment.width / 2;
        this.uiGraphContainer.addChild(this.equipment);
        this.languageOption.visible = false;
        this.uiGraphContainer.addChild(this.languageOption);
        this.addChild(this.uiGraphContainer);
        this.loadLanguageFromDB();
        this.initSound();
        this.playBgmIfNeeded();
    }

    private updateEquipMentIn(): void {
        if(!this.isEquipmentIn) return;

        if(this.equipment.position.x >= this.equipmentMoveDistance) {
            this.equipment.position.x = this.equipmentMoveDistance;
            this.isEquipmentIn = false;
            this.elapsedFrameCount = 0;
            this.equipmentMoveRate = 0;
        } else {
            this.equipmentMoveRate += 0.01;
            this.equipment.position.x = this.equipmentMoveDistance * this.easeOutQuint(this.equipmentMoveRate);
        }
    }

    private updateEquipMentOut(): void {
        if(this.isEquipmentIn || this.elapsedFrameCount <= 60) return;

        if(this.equipment.position.x >= this.equipmentMoveDistance * 2) {
            this.equipment.position.x = 0;
            this.isEquipmentIn = true;
            this.equipment.texture = this.getRandomTexture();
            this.equipmentMoveRate = 0;
        } else {
            this.equipmentMoveRate += 0.01;
            this.equipment.position.x = this.equipmentMoveDistance + this.equipmentMoveDistance * this.easeOutQuint(this.equipmentMoveRate);
        }
    }

    private getRandomTexture(): PIXI.Texture {
        const randomTextureName = Resource.EquipMents[Math.floor(Math.random() * Resource.EquipMents.length)];
        return PIXI.utils.TextureCache[randomTextureName];
    }

    private initSound(): void {
        const resources = GameManager.game.loader.resources as any;
        const soundList = [
            Resource.Audio.Se.OptionTap,
            Resource.Audio.Se.OptionTap3
          ];
          for(const name of soundList) {
              SoundManager.createSound(name, resources[name].buffer);
          }
    }

    public onLanguageSelected(language: string): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap3);
        const newGameButton = this.uiGraph.get('new_game_button'); 
        const optionButton = this.uiGraph.get('option_button');
        const creditButton = this.uiGraph.get('credit_button');
        if(!newGameButton || !optionButton || !creditButton) return;
        newGameButton.interactive = true;
        optionButton.interactive = true;
        creditButton.interactive = true;

        this.languageOption.visible = false;

        this.language = language;
        this.saveLanguageToDB(language);
    }

    public onNewGameButtonTouched(): void {
        if(this.isOver) return;
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        SoundManager.destroySound(Resource.Audio.Bgm.TitleBgm);
        SoundManager.playSe(Resource.Audio.Se.OptionTap2);
        GameManager.loadScene(new OpeningScene(this.language));
        this.isOver = true; 
    }

    public showOptionScene(): void {
        if(this.isOver) return;
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        this.isOver = true;
        SoundManager.playSe(Resource.Audio.Se.OptionTap2);
        GameManager.loadScene(new OptionScene(this.language));
    }

    public showCreditScene(): void {
        if(this.isOver) return;  
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        this.isOver = true;
        SoundManager.playSe(Resource.Audio.Se.OptionTap2);
        GameManager.loadScene(new CreditScene());
    }

    private showLanguageOption(): void {
        const newGameButton = this.uiGraph.get('new_game_button');
        const optionButton = this.uiGraph.get('option_button');
        const creditButton = this.uiGraph.get('credit_button');
        if(!newGameButton || !optionButton || !creditButton) return;
        newGameButton.interactive = false;
        optionButton.interactive = false;
        creditButton.interactive = false;

        this.languageOption.visible = true;
    }
    
    private saveLanguageToDB(value: string): void {
        IndexedDBManager.put('language', value);
    }
    
    private loadLanguageFromDB(): void {
        IndexedDBManager.get(
            'language',
            (value) => {
                if(value) {
                    this.language = value;
                } else {
                    this.showLanguageOption();
                }
            }
        );
    }
    
    protected prepareUiGraphContainer(uiData: UI.Graph): void {
        for(const nodeData of uiData.nodes) {
            const factory = UiGraph.getFactory(nodeData.type) || this.getCustomUiGraphFactory(nodeData.type);
            if(!factory) continue;

            const node = factory.createUiNodeByGraphElement(nodeData);
            if(!node) continue;

            if(nodeData.events) factory.attachUiEventByGraphElement(nodeData.events, node, this);
            
            this.uiGraph.set(nodeData.id, node);
            if(nodeData.type === 'language_option_sprite' || nodeData.type === 'language_option_text') {
                this.languageOption.addChild(node);
            } else {
                this.uiGraphContainer.addChild(node);
            }
        }
    }

    private playBgmIfNeeded(): void {
        const bgmTitleName = Resource.Audio.Bgm.TitleBgm;
        if(!SoundManager.hasSound(bgmTitleName)) {
            const resource = GameManager.game.loader.resources[bgmTitleName] as any;
            SoundManager.createSound(bgmTitleName, resource.buffer);
            SoundManager.playBgm(bgmTitleName, 1.7);
            if(SoundManager.bgmVolume !== 0) {
                SoundManager.setSoundVolume(Resource.Audio.Bgm.TitleBgm, 0.005);
                this.fadeInBgm();
            } 
        }
    }

    private fadeInBgm(): void {
        const bgm = SoundManager.getSound(Resource.Audio.Bgm.TitleBgm);
        if(bgm) SoundManager.fade(bgm, SoundManager.bgmVolume * 1.7, 1.5);
    }

    private loadSaveDataFromDB(): void {
        IndexedDBManager.get(
            'saveData',
            (value) => {
                if(value) {
                    
                }
            }
        );
    }

    private easeOutQuint(x: number): number {
        return 1 - Math.pow(1 - x, 5);
        }
}