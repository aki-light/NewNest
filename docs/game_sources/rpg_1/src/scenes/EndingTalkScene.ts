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
import ScoreScene from './ScoreScene';

export default class EndingTalkScene extends Scene implements MessageWindowDelegate {
    private playerStatus: PlayerStatus;
    private turn: number;
    private bossHp: number;
    private texts: Map<string, PIXI.Text> = new Map();
    private language: string;
    private endingType: string;
    private whenLoseNames: string[] = [
        'emperor_name',
        'player_name',
        'no_name'
    ];
    private whenLoseTextIdsArray: string[][] = [
        [
            'lose_emperor_message_1'
        ],
        [
            'lose_player_message_1'
        ],
        [
            'lose_narrator_message_1'
        ]
    ];
    private whenWinNames: string[] = [
        'emperor_name',
        'player_name',
        'emperor_name',
        'player_name',
        'emperor_name',
        'player_name',
        'no_name'
    ];
    private whenWinTextIdsArray: string[][] = [
        [
            'win_emperor_message_1'
        ],
        [
            'win_player_message_1'
        ],
        [
            'win_emperor_message_2'
        ],
        [
            'win_player_message_2'
        ],
        [
            'win_emperor_message_3',
            'win_emperor_message_4'
        ],
        [
            'win_player_message_3'
        ],
        [
            'win_narrator_message_1'
        ]
    ];
    private whenEasyWinNames: string[] = [
        'emperor_name',
        'player_name',
        'no_name',
        'player_name',
        'emperor_name',
        'no_name',
    ];
    private whenEasyWinTextIdsArray: string[][] = [
        [
            'easy_win_emperor_message_1'
        ],
        [
            'easy_win_player_message_1',
            'easy_win_player_message_2'
        ],
        [
            'easy_win_narrator_message_1'
        ],
        [
            'easy_win_player_message_3'
        ],
        [
            'easy_win_emperor_message_2'
        ],
        [
            'easy_win_narrator_message_2'
        ]
    ];

    constructor(language: string, playerStatus: PlayerStatus, endingType: string, turn: number,
                bossHp: number) {
        super();
        this.sceneName = 'talk_scene';
        
        this.transitionIn = new Fade(1.0, 0.0, -0.02);
        this.transitionOut = new Fade(0.0, 1.0, 0.02);

        this.language = language;
        this.endingType = endingType;
        this.playerStatus = playerStatus;
        this.turn = turn;
        this.bossHp = bossHp;
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
            name2 = Resource.Texts.EndingTalkScene.Ja;
        } else {
            name2 = Resource.Texts.EndingTalkScene.En;
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
            name1 = Resource.Texts.EndingTalkScene.Ja;
        } else {
            name1 = Resource.Texts.EndingTalkScene.En
        }
        const json2 = GameManager.game.loader.resources[name1].data;
        this.prepareUiGraphContainer(json1);
        this.prepareUiGraphContainer(json2);

        this.uiGraphContainer.zIndex = 1;
        this.addChild(this.uiGraphContainer);
        this.initSound();

        let meassage;
        let name;
        if(this.endingType === 'lose') {
            meassage = this.whenLoseTextIdsArray.shift();
            name = this.whenLoseNames.shift();
        } else if(this.endingType === 'win') {
            meassage = this.whenWinTextIdsArray.shift();
            name = this.whenWinNames.shift();
        } else if(this.endingType === 'easyWin') {
            meassage = this.whenEasyWinTextIdsArray.shift();
            name = this.whenEasyWinNames.shift();
        }
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
        if(this.endingType === 'lose') {
            if(this.whenLoseNames.length === 0) {
                this.showNextScene();
            }
        }
        if(this.endingType === 'win') {
            if(this.whenWinNames.length === 0) {
                this.showNextScene();
            }
        }
        if(this.endingType === 'easyWin') {
            if(this.whenEasyWinNames.length === 0) {
                this.showNextScene();
            }
        }
    
        let textIds;
        let name;
        if(this.endingType === 'lose') {
            textIds = this.whenLoseTextIdsArray.shift();
            name = this.whenLoseNames.shift();
        }
        if(this.endingType === 'win') {
            textIds = this.whenWinTextIdsArray.shift();
            name = this.whenWinNames.shift();
        }
        if(this.endingType === 'easyWin') {
            textIds = this.whenEasyWinTextIdsArray.shift();
            name = this.whenEasyWinNames.shift();
        }
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
        GameManager.loadScene(new ScoreScene(this.language, this.playerStatus.cp, this.turn,
                                             this.bossHp));
    }
}