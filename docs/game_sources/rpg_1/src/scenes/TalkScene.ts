import GameManager from '../managers/GameManager';
import Scene from './Scene';
import Fade from './transition/Fade';
import Resource from '../Resources';
import LoaderAddParam from '../interfaces/LoaderAddParams';
import SoundManager from '../managers/SoundManager';
import * as PIXI from 'pixi.js';
import MessgageWindow from '../display/MessageWindow';
import MessageWindowDelegate from '../interfaces/MessageWindowDelegate';
import * as UI from '../interfaces/UiGraph/index';
import UiGraph from '../modules/UiGraph';
import PlayerStatus from '../entity/PlayerStatus';
import BattleScene from './BattleScene';

export default class TalkScene extends Scene implements MessageWindowDelegate {
    private playerStatus: PlayerStatus;
    private itemNumbers: Map<string, number>;
    private texts: Map<string, PIXI.Text> = new Map();
    private language: string;
    private names: string[] = [
        'emperor_name',
        'player_name',
        'emperor_name',
        'player_name',
        'emperor_name',
        'player_name',
        'emperor_name',
        'player_name',
        'emperor_name',
        'player_name',
        'emperor_name'
    ];
    private textIdsArray: string[][] = [
        [
            'emperor_message_1'
        ],
        [
            'player_message_1'
        ],
        [
            'emperor_message_2'
        ],
        [
            'player_message_2'
        ],
        [
            'emperor_message_3'
        ],
        [
            'player_message_3',
            'player_message_4'
        ],
        [
            'emperor_message_4'
        ],
        [
            'player_message_5'
        ],
        [
            'emperor_message_5',
            'emperor_message_6',
            'emperor_message_7'
        ],
        [
            'player_message_6'
        ],
        [
            'emperor_message_8',
            'emperor_message_9',
            'emperor_message_10'
        ]
    ];

    constructor(language: string, playerStatus: PlayerStatus, itemNumbers: Map<string, number>) {
        super();
        this.sceneName = 'talk_scene';
        
        this.transitionIn = new Fade(1.0, 0.0, -0.02);
        this.transitionOut = new Fade(0.0, 1.0, 0.02);

        this.language = language;
        this.playerStatus = playerStatus;
        this.itemNumbers = itemNumbers;
    }

    protected createInitialResourceList(): (LoaderAddParam | string)[] {
        const assets = super.createInitialResourceList();
        assets.push(Resource.UI.MessageWindow);
        assets.push(Resource.Audio.Bgm.TalkBgm);
        return assets;
    }

    public update(dt: number): void {
        super.update(dt);
    }

    protected loadInitialResource(onLoaded: () => void): void {
        const assets = this.createInitialResourceList();
        const name1 = Resource.UI.SceneUiGraph(this.sceneName);
        let name2;
        if(this.language === 'japanese') {
            name2 = Resource.Texts.TalkScene.Ja;
        } else {
            name2 = Resource.Texts.TalkScene.En;
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

    protected onResourceLoaded(): void {
        const json1 = GameManager.game.loader.resources[Resource.UI.SceneUiGraph(this.sceneName)].data;
        let name1;
        if(this.language === 'japanese') {
            name1 = Resource.Texts.TalkScene.Ja;
        } else {
            name1 = Resource.Texts.TalkScene.En;
        }
        const json2 = GameManager.game.loader.resources[name1].data;
        this.prepareUiGraphContainer(json1);
        this.prepareUiGraphContainer(json2);

        this.uiGraphContainer.zIndex = 1;
        this.addChild(this.uiGraphContainer);
        this.initSound();

        const meassage = this.textIdsArray.shift();
        const name = this.names.shift();
        if(!meassage || !name) return;
        this.spawnMessageWindow(meassage, name);
        SoundManager.playBgm(Resource.Audio.Bgm.TalkBgm, 3);
    }
    
    private initSound(): void {
        const resources = GameManager.game.loader.resources as any;
        const soundList = [
            Resource.Audio.Bgm.TalkBgm
          ];
          for(const name of soundList) {
              SoundManager.createSound(name, resources[name].buffer);
          }
    }

    private spawnMessageWindow(textIds: string[], name: string): void {
        const texts = this.createTexts(textIds);
        const speakerName = this.texts.get(name);
        if(!speakerName) return;
        const messageWindow = new MessgageWindow(texts, speakerName, this);
        messageWindow.zIndex = 3;
        this.addChild(messageWindow);
        this.registerUpdatingObject(messageWindow);
    }

    private createTexts(textIds: string[]): PIXI.Text[] {
        const messages: PIXI.Text[] = [];
        for(const key of textIds) {
            const text = this.texts.get(key);
            if(!text) continue;
            messages.push(text);
        }
        return messages;
    }

    public onMessageWindowClosed(): void {
       if(this.names.length === 0) {
           this.showNextScene();
       }

       const textIds = this.textIdsArray.shift();
       const name = this.names.shift();
       if(!textIds || !name) return;
       this.spawnMessageWindow(textIds, name);
    }

    protected prepareUiGraphContainer(uiData: UI.Graph): void {
        for(const nodeData of uiData.nodes) {
            const factory = UiGraph.getFactory(nodeData.type) || this.getCustomUiGraphFactory(nodeData.type);
            if(!factory) continue;
            
            const node = factory.createUiNodeByGraphElement(nodeData);
            if(!node) continue;
        
            if(nodeData.events) factory.attachUiEventByGraphElement(nodeData.events, node, this);
            
            if(nodeData.type === 'message') {
                this.texts.set(nodeData.id, (node as PIXI.Text));
            } else {
                this.uiGraph.set(nodeData.id, node);
                this.uiGraphContainer.addChild(node);
            }
        }
    }

    public onSkipButtonTapped(): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap2);
        this.showNextScene();
    }

    public showNextScene(): void {
        if(this.isOver) return;
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        SoundManager.destroySound(Resource.Audio.Bgm.TalkBgm);
        this.isOver = true;
        GameManager.loadScene(new BattleScene(this.playerStatus, this.itemNumbers, this.language));
    }
}