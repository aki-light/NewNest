import GameManager from '../managers/GameManager';
import Scene from './Scene';
import LoaderAddParam from '../interfaces/LoaderAddParams';
import Resource from '../Resources';
import SoundManager from '../managers/SoundManager';
import Fade from './transition/Fade';
import OptionScene from './OptionScene';
import CreditScene from './CreditScene';
import EscapeScene from './EscapeScene';
import IndexedDBManager from '../managers/IndexedDBManager';
import UiGraph from '../modules/UiGraph';
import * as UI from '../interfaces/UiGraph/index';
import * as PIXI from 'pixi.js';

export default class TitleScene extends Scene {
    private title1MoveDistance!: number;
    private title2MoveDistance!: number;
    private title3MoveDistance!: number;
    private title1MoveRate: number = 0;
    private title2MoveRate: number = 0;
    private title3MoveRate: number = 0;
    private language!: string;
    private languageOption: PIXI.Container = new PIXI.Container();
    private confirmation: PIXI.Container = new PIXI.Container();
    private hasSaveData: boolean = false;

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
        return assets;
    }

    public update(dt: number): void {
        super.update(dt);

        if(!this.language) {
            this.elapsedFrameCount = 0;
        } else {
            this.updateTitles();
            this.updateButtons();
        }

        if(this.elapsedFrameCount === 90) {
            this.playBgmIfNeeded();
        }
    }

    protected onResourceLoaded(): void {
        super.onResourceLoaded();
        this.setTitleMoveDistance();
        this.languageOption.visible = false;
        this.confirmation.visible = false;
        this.uiGraphContainer.addChild(this.languageOption);
        this.uiGraphContainer.addChild(this.confirmation);
        this.addChild(this.uiGraphContainer);
        this.loadLanguageFromDB();
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

    public onLanguageSelected(language: string): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        const newGameButton = this.uiGraph.get('new_game');
        const continueButton = this.uiGraph.get('continue');
        const optionButton = this.uiGraph.get('option');
        const creditButton = this.uiGraph.get('credit');
        if(!newGameButton || !continueButton || !optionButton || !creditButton) return;
        newGameButton.interactive = true;
        continueButton.interactive = true;
        optionButton.interactive = true;
        creditButton.interactive = true;

        this.languageOption.visible = false;

        this.language = language;
        this.saveLanguageToDB(language);
    }

    private easeOutQuint(x: number): number {
        return 1 - Math.pow(1 - x, 5);
    }

    private updateTitles(): void {
        const title1 = this.uiGraph.get('title_1');
        const title2 = this.uiGraph.get('title_2');
        const title3 = this.uiGraph.get('title_3');
        if(!title1 || !title2 || !title3) return;
        if(title1.position.x === this.title1MoveDistance && 
           title2.position.x === this.title2MoveDistance && 
           title3.position.x === this.title3MoveDistance) {
               return;
           }

        if(title1.position.x >= this.title1MoveDistance) {
            title1.position.x = this.title1MoveDistance;
        } else {
            this.title1MoveRate += 10 / this.title1MoveDistance;
            title1.position.x = this.title1MoveDistance * this.easeOutQuint(this.title1MoveRate);
        }

        if(title2.position.x >= this.title2MoveDistance) {
            title2.position.x = this.title2MoveDistance;
        } else if(this.elapsedFrameCount >= 20) {
            this.title2MoveRate += 10 / this.title2MoveDistance
            title2.position.x = this.title2MoveDistance * this.easeOutQuint(this.title2MoveRate);
        }

        if(title3.position.x >= this.title3MoveDistance) {
            title3.position.x = this.title3MoveDistance;
        } else if(this.elapsedFrameCount >= 40) {
            this.title3MoveRate += 10 / this.title3MoveDistance
            title3.position.x = this.title3MoveDistance * this.easeOutQuint(this.title3MoveRate);
        }
    }

    private updateButtons(): void {
        const newGameButton = this.uiGraph.get('new_game');
        const continueButton = this.uiGraph.get('continue');
        const continueButton2 = this.uiGraph.get('continue_2');
        const optionButton = this.uiGraph.get('option');
        const creditButton = this.uiGraph.get('credit');

        if(!newGameButton || !continueButton || !continueButton2 || !optionButton || !creditButton) return;
        if(newGameButton.visible && continueButton.visible || continueButton2.visible &&
           optionButton.visible && creditButton.visible) {
               return;
           }
        
        if(this.elapsedFrameCount >= 80) {
            newGameButton.visible = true;
            if(this.hasSaveData) {
                continueButton.visible = true;
            } else {
                continueButton2.visible = true;
            }
            optionButton.visible = true;
            creditButton.visible = true;
        }
    }

    private setTitleMoveDistance(): void {
        const title1 = this.uiGraph.get('title_1');
        const title2 = this.uiGraph.get('title_2');
        const title3 = this.uiGraph.get('title_3');
        if(!title1 || !title2 || !title3) return;
        
        this.title1MoveDistance = 320 + title1.width / 2;
        this.title2MoveDistance = 320 + title2.width / 2;
        this.title3MoveDistance = 320 + title3.width / 2;
    }

    public newGame(): void {
        if(this.isOver) return;
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.deleteSaveData();
        this.onContinueButtonTouched();
    }

    public cancelNewGame(): void {
        if(this.isOver) return;
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        const newGameButton = this.uiGraph.get('new_game');
        const continueButton = this.uiGraph.get('continue');
        const optionButton = this.uiGraph.get('option');
        const creditButton = this.uiGraph.get('credit');
        if(!newGameButton || !continueButton || !optionButton || !creditButton) return;
        newGameButton.interactive = true;
        continueButton.interactive = true;
        optionButton.interactive = true;
        creditButton.interactive = true;

        this.confirmation.visible = false;
    }

    public onNewGameButtonTouched(): void {
        if(this.isOver) return;
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        if(!this.hasSaveData) {
            this.onContinueButtonTouched();
        } else {
            this.showConfirmation();
        }
    }

    public onContinueButtonTouched(): void {
        if(this.isOver) return;
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        SoundManager.destroySound(Resource.Audio.Bgm.TitleBgm);
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        GameManager.loadScene(new EscapeScene(this.language));
        this.isOver = true; 
    }

    public showOptionScene(): void {
        if(this.isOver) return;
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        this.isOver = true;
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        GameManager.loadScene(new OptionScene(this.language));
    }

    public showCreditScene(): void {
        if(this.isOver) return;  
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        this.isOver = true;
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        GameManager.loadScene(new CreditScene());
    }

    private showLanguageOption(): void {
        const newGameButton = this.uiGraph.get('new_game');
        const continueButton = this.uiGraph.get('continue');
        const optionButton = this.uiGraph.get('option');
        const creditButton = this.uiGraph.get('credit');
        if(!newGameButton || !continueButton || !optionButton || !creditButton) return;
        newGameButton.interactive = false;
        continueButton.interactive = false;
        optionButton.interactive = false;
        creditButton.interactive = false;

        this.languageOption.visible = true;
    }

    private showConfirmation(): void {
        const newGameButton = this.uiGraph.get('new_game');
        const continueButton = this.uiGraph.get('continue');
        const optionButton = this.uiGraph.get('option');
        const creditButton = this.uiGraph.get('credit');
        if(!newGameButton || !continueButton || !optionButton || !creditButton) return;
        newGameButton.interactive = false;
        continueButton.interactive = false;
        optionButton.interactive = false;
        creditButton.interactive = false;

        this.confirmation.visible = true;
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
                
                if(value === 'japanese') {
                    const text = this.uiGraph.get('confirm_message_english');
                    if(!text) return;
                    text.visible = false;
                } else {
                    const text = this.uiGraph.get('confirm_message');
                    if(!text) return;
                    text.visible = false;
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
            } else if(nodeData.type === 'confirmation_sprite' || nodeData.type === 'confirmation_text'){
                this.confirmation.addChild(node);
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
            SoundManager.playBgm(bgmTitleName, 1.5);
        }
    }

    private loadSaveDataFromDB(): void {
        IndexedDBManager.get(
            'saveData',
            (value) => {
                if(value) {
                    this.hasSaveData = true;
                }
            }
        );
    }

    private deleteSaveData(): void {
        IndexedDBManager.delete('saveData');
    }
}