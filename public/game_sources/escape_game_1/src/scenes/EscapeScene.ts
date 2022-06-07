import Resource from '../Resources';
import LoaderAddParam from '../interfaces/LoaderAddParams';
import PlayerAnimationMaster from '../interfaces/master/PlayerAnimationMaster';
import Scene from '../scenes/Scene';
import GameManager from '../managers/GameManager';
import GameLogic from '../modules/GameLogic';
import Delegate from '../interfaces/Delegate';
import PlaySceneState from '../enum/PlaySceneState';
import Fade from './transition/Fade';
import Player from '../display/Player';
import PlayerEntity from '../entity/PlayerEntity';
import RoomObjectEntity from '../entity/RoomObjectEntity';
import SoundManager from '../managers/SoundManager';
import TitleScene from './TitleScene';
import StageMaster from '../interfaces/master/StageMaster';
import Tile from '../display/Tile';
import WalkDirection from '../enum/WalkDirection';
import PlayerState from '../enum/PlayerState';
import UiNodeFactory from '../modules/UiNodeFactory/UiNodeFactory';
import RoomObjectFactory from '../modules/UiNodeFactory/RoomObjectFactory';
import TextOptionFactory from '../modules/UiNodeFactory/TextOptionFactory';
import * as UI from '../interfaces/UiGraph/index';
import UiGraph from '../modules/UiGraph';
import RoomObject from '../display/RoomObject';
import * as PIXI from 'pixi.js';
import RoomObjectMaster from '../interfaces/master/RoomObjectMaster';
import MessgageWindow from '../display/MessageWindow';
import OptionButton from '../display/OptionButton';
import RoomObjectState from '../enum/RoomObjectState';
import Menu from '../display/Menu';
import SpriteOptionFactory from '../modules/UiNodeFactory/SpriteOptionFactory';
import ItemPanel from '../display/ItemPanel';
import ItemPanelFactory from '../modules/UiNodeFactory/ItemPanelFactory';
import OptionType from '../enum/OptionType';
import IndexedDBManager from '../managers/IndexedDBManager';
import Items from '../enum/Items';
import SaveData from '../interfaces/SaveData/SaveData';
import RoomObjectSaveKey from '../enum/RoomObjectSaveKey';
import RoomObjectSaveData from '../interfaces/SaveData/RoomObjectSaveData';

export default class EscapeScene extends Scene implements Delegate {
    private playerAnimationMaster!: PlayerAnimationMaster;
    private gameLogic: GameLogic;
    private state: number;
    public isPaused: boolean = false;
    private tileSize!: number;
    private tiles: Map<number, Tile> = new Map();
    private player!: Player;
    private roomObjects: Map<string, RoomObject> = new Map();
    private messages: Map<string, PIXI.Text> = new Map();
    private options: Map<string, OptionButton> = new Map();
    private messageWindow: MessgageWindow | null = null;
    private itemPanels: ItemPanel[] = [];
    private menu!: Menu;
    private menuTexts: Map<string, PIXI.Text | OptionButton> = new Map();
    private soundOption: PIXI.Container = new PIXI.Container();
    private pinPad: PIXI.Container = new PIXI.Container();
    private code: number[] = [];
    private correctCode: number[] = [];
    private language: string;
    private saveData: SaveData;

    constructor(language: string) {
        super();
        
        this.transitionIn = new Fade(1.0, 0.0, -0.02);
        this.transitionOut = new Fade(0.0, 1.0, 0.02);
        this.state = PlaySceneState.LOADING_RESOURCES;
        this.sceneName = 'escape_scene';
        this.language = language;
        this.saveData = {
            roomObject: [],
            mapData: undefined,
            playerItems: [],
            roomObjectState: [],
            code: [],
            isBalloonExist: true
        };
       
        this.gameLogic = new GameLogic();
    }

    public beginTransitionIn(onTransitionFinished: (scene: Scene) => void, afterFinishedVisible?: boolean): void {
        super.beginTransitionIn(() => {
            if(this.state === PlaySceneState.RESOURCE_LOADED) {
                this.state = PlaySceneState.READY;
                onTransitionFinished(this);
                SoundManager.playBgm(Resource.Audio.Bgm.EscapeBGM);
            }
        }, afterFinishedVisible);
    }
    
    protected createInitialResourceList(): (string | LoaderAddParam)[] {
        return super.createInitialResourceList().concat(
            Resource.UI.Tiles,
            Resource.UI.TileFrame,
            Resource.UI.PlayerAnimation,
            Resource.UI.Player,
            Resource.UI.RoomObjectMaster,
            Resource.UI.Items,
            Resource.UI.RoomObjects,
            MessgageWindow.resourceList,
            OptionButton.resourceList,
            Menu.resourceList,
            [
                Resource.UI.Stage,
                Resource.Audio.Se.OptionTap,
                Resource.Audio.Se.ShowNextText,
                Resource.Audio.Se.TileTap,
                Resource.Audio.Bgm.EscapeBGM,
                Resource.Audio.Bgm.EndingBGM
            ]
        );
    }

    protected loadInitialResource(onLoaded: () => void): void {
        const assets = this.createInitialResourceList();
        const name1 = Resource.UI.SceneUiGraph(this.sceneName);
        let name2;
        if(this.language === 'japanese') {
            name2 = Resource.UI.EscapeSceneMessage;
        } else {
            name2 = Resource.UI.EscapeSceneEnglishMessage
        }
        let name3;
        if(this.language === 'japanese') {
            name3 = Resource.UI.EscapeSceneOption;
        } else {
            name3 = Resource.UI.EscapeSceneEnglishOption;
        }
        const name4 = Resource.UI.EscapeSceneRoomObject;
        assets.push(name1);
        assets.push(name2);
        assets.push(name3);
        assets.push(name4);
        
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
            name2 = Resource.UI.EscapeSceneOption;
        } else {
            name2 = Resource.UI.EscapeSceneEnglishOption;
        }
        const name3 = Resource.UI.EscapeSceneRoomObject;
        let uiGraphNodes = GameManager.game.loader.resources[name1].data.nodes;
        uiGraphNodes = uiGraphNodes.concat(GameManager.game.loader.resources[name2].data.nodes);
        uiGraphNodes = uiGraphNodes.concat(GameManager.game.loader.resources[name3].data.nodes);
        
        for(const node of uiGraphNodes) {
            if(node.type === 'sprite' || node.type === 'sprite_option' ||
               node.type === 'room_object' || node.type === 'item_panel') {
                additionalAssets.push({ name: node.params.textureName, url: node.params.url }); 
            } 
        }
        return additionalAssets; 
    }

    protected onResourceLoaded(): void {
        const json1 = GameManager.game.loader.resources[Resource.UI.SceneUiGraph(this.sceneName)].data;
        let name1;
        if(this.language === 'japanese') {
            name1 = Resource.UI.EscapeSceneMessage;
        } else {
            name1 = Resource.UI.EscapeSceneEnglishMessage
        }
        let name2;
        if(this.language === 'japanese') {
            name2 = Resource.UI.EscapeSceneOption;
        } else {
            name2 = Resource.UI.EscapeSceneEnglishOption;
        }
        const json2 = GameManager.game.loader.resources[name1].data;
        const json3 = GameManager.game.loader.resources[name2].data;
        const json4 = GameManager.game.loader.resources[Resource.UI.EscapeSceneRoomObject].data;
        this.prepareUiGraphContainer(json1);
        this.prepareUiGraphContainer(json2);
        this.prepareUiGraphContainer(json3);
        this.prepareUiGraphContainer(json4);
        
        const resources = GameManager.game.loader.resources;
        const stageMaster = resources[Resource.UI.Stage].data as StageMaster;
        const roomObjectMaster = resources[Resource.UI.RoomObjectMaster].data as RoomObjectMaster[];

        this.playerAnimationMaster = resources[Resource.UI.PlayerAnimation].data;

        this.tileSize = stageMaster.tileSize;

        this.initTiles(stageMaster, this.tileSize);
        this.uiGraphContainer.zIndex = 1;
        this.addChild(this.uiGraphContainer);
        this.initSound();
        this.initPinPad();
        this.setHitArea();
        this.initMenu();
        this.initVolumeText();
        this.initSoundOption();
        this.loadSaveDataFromDB(stageMaster, roomObjectMaster);
    }

    private setHitArea(): void {
        const bowl = this.roomObjects.get('bowl');
        if(!bowl) return;
        bowl.hitArea = new PIXI.Circle(bowl.width / 2, bowl.height / 2, 30);

        const salt = this.options.get('use_salt');
        if(!salt) return;
        salt.hitArea = new PIXI.Rectangle(-75, -25, 150, 50);
    }

    private initMenu(): void {
        const menuOptions: OptionButton[] = [];
        for(const id of Resource.MenuOptionIds) {
            const menuOption = this.options.get(id);
            if(!menuOption) continue;
            menuOptions.push(menuOption);
        }
        const menu = new Menu(menuOptions, this.itemPanels, this.soundOption, this.menuTexts, this);
        this.menu = menu;
        this.menu.zIndex = 3;
        this.registerUpdatingObject(menu);
        this.addChild(this.menu);
    }

    private initSoundOption(): void {
        for(const id of Resource.SoundOptionIds) {
            const grapf = this.uiGraph.get(id);
            if(!grapf) continue;
            this.soundOption.addChild(grapf);
        }
        this.soundOption.visible = false;
        this.soundOption.zIndex = 3;
        this.addChild(this.soundOption);
    }

    private initCode(): void {
        const mirrorMessage = this.messages.get('mirror_message_4');
        if(!mirrorMessage) return;
        if(this.language === 'japanese') {
            (mirrorMessage as PIXI.Text).text = `手鏡で首の後ろを見ると\
            小さく「${this.correctCode[0].toString() + this.correctCode[1].toString() + 
            this.correctCode[2].toString()}」と書かれている。`
        } else {
            (mirrorMessage as PIXI.Text).text = `when you looked at the back of your neck \
            with the hand mirror, it was written as '${this.correctCode[0].toString() + 
            this.correctCode[1].toString() + this.correctCode[2].toString()}'`
        }
        
    }

    private initPinPad(): void {
        for(const id of Resource.PinPadIds) {
            const grapf = this.uiGraph.get(id);
            if(!grapf) continue;
            this.pinPad.addChild(grapf);
        }
        this.pinPad.visible = false;
        this.pinPad.zIndex = 3;
        this.addChild(this.pinPad);
    }

    private initVolumeText(): void {
        const bgmVolume = Math.round(SoundManager.bgmVolume * 100);
        const seVolume = Math.round(SoundManager.seVolume * 10);
        
        const bgmId = 'bgm_volume';
        (this.uiGraph.get(bgmId)! as PIXI.Text).text = bgmVolume.toString();
         
        const seId = 'se_volume';
        (this.uiGraph.get(seId)! as PIXI.Text).text = seVolume.toString();
        
    }

    private initSound(): void {
        const resources = GameManager.game.loader.resources as any;
        const soundList = [
            Resource.Audio.Se.OptionTap,
            Resource.Audio.Se.ShowNextText,
            Resource.Audio.Se.TileTap,
            Resource.Audio.Bgm.EscapeBGM,
            Resource.Audio.Bgm.EndingBGM
          ];
          for(const name of soundList) {
              SoundManager.createSound(name, resources[name].buffer);
          }
    }

    public update(dt: number):void {
        if(!this.isPaused){
            switch(this.state) {
                case PlaySceneState.LOADING_RESOURCES: break;
                case PlaySceneState.READY: {
                    this.state = PlaySceneState.INGAME;
                    break;
                }
                case PlaySceneState.INGAME:
                case PlaySceneState.FINISHED: {
                    this.gameLogic.update();
                    break;
                }    
            }
        }
        this.updateRegisteredObjects(dt);

        if(this.transitionIn.isActive()) {
            this.transitionIn.update(dt);
        } else if(this.transitionOut.isActive()) {
            this.transitionOut.update(dt);
        }
    }

    public onRoomObjectTapped(type: string) {
        if(this.messageWindow) return;
        
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.roomObjects.forEach((value, key) => {
            value.interactive = false;
        });

        this.tiles.forEach((value, key) => {
            if(value.isActive) {
                value.toggleFrame();
            }
            value.interactive = false;
        });

        const roomObject = this.roomObjects.get(type);
        if(!roomObject) return;
        this.spawnMessageWindow(roomObject.messageIds);

        this.gameLogic.onRoomObjectTapped(type);
    }

    public onPlayerSpawned(entiy: PlayerEntity): void {
        this.tiles.forEach((tile) => {
            if(tile.tilePosition[0] === entiy.positionRow && tile.tilePosition[1] === entiy.positionColumn) {
                tile.interactive = false;
            }
        });

        this.player = new Player(this.playerAnimationMaster, this.tileSize, 
                                 {x: entiy.positionColumn * this.tileSize,
                                  y: entiy.positionRow * this.tileSize - this.tileSize / 3});
        this.player.sprite.zIndex = 2;
        this.addChild(this.player.sprite);
        this.registerUpdatingObject(this.player);
        this.sortChildren();
    }

    public onPlayerEntityStateChanged(entity: PlayerEntity): void {
        if(entity.state === PlayerState.IDLE) {
            this.player.requestAnimation(Resource.AnimationTypes.Player.WAIT);
            
            this.tiles.forEach((tile) => {
                if(entity.positionRow === tile.tilePosition[0] &&
                    entity.positionColumn === tile.tilePosition[1]) {
                     tile.interactive = false;
                 } else {
                     tile.interactive = true;
                 }
            });

            this.roomObjects.forEach((roomObject, key) => {
                for(const tilePosition of roomObject.downTiles) {
                    if(
                        tilePosition[0] === entity.positionRow - 1 && tilePosition[1] === entity.positionColumn ||
                        tilePosition[0] === entity.positionRow + 1 && tilePosition[1] === entity.positionColumn ||
                        tilePosition[0] === entity.positionRow && tilePosition[1] === entity.positionColumn - 1 ||
                        tilePosition[0] === entity.positionRow && tilePosition[1] === entity.positionColumn + 1
                     ) {
                        roomObject.interactive = true;      
                     }
                }
            });
        }

        if(entity.state === PlayerState.WALK) {
            this.roomObjects.forEach((roomObject, key) => {
                roomObject.interactive = false;
            });
        }

        if(entity.state === PlayerState.CHECKING) {
            if(entity.checkingObject === Resource.RoomObjects.CLOCK) {
                this.player.requestAnimation(Resource.AnimationTypes.Player.CHACKUP);
                return;
            }

            if(entity.checkingObject === null) return;
            const object = this.roomObjects.get(entity.checkingObject);
            if(!object) return;
            let up = 0;
            let down = 0;
            let left = 0;
            let right = 0;
            for(const downtile of object.downTiles) {
                if(downtile[0] < entity.positionRow) {
                    up++;
                } else if(downtile[0] > entity.positionRow) {
                    down++;
                } 
                if(downtile[1] < entity.positionColumn) {
                    left++;
                } else if(downtile[1] > entity.positionColumn) {
                    right++;
                }
            }
            if(up === object.downTiles.length) {
                this.player.requestAnimation(Resource.AnimationTypes.Player.CHACKUP);
            } else if(down === object.downTiles.length) {
                this.player.requestAnimation(Resource.AnimationTypes.Player.CHACKDOWN);
            } else if(left === object.downTiles.length) {
                this.player.requestAnimation(Resource.AnimationTypes.Player.CHACKLEFT);
            } else if(right === object.downTiles.length) {
                this.player.requestAnimation(Resource.AnimationTypes.Player.CHACKRIGHT);
            }
        }
    }

    public onBgmArrowTapped(value: number): void {
        let vol = SoundManager.bgmVolume; 
        vol += value;
      
        if(vol < 0) {
            vol = 0;
        } else if(vol > 0.1) {
            vol = 0.1;
        }

        const id = 'bgm_volume';
        (this.uiGraph.get(id)! as PIXI.Text).text = Math.round(vol * 100).toString();

        SoundManager.bgmVolume = vol;
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.saveBgmVolumeToDB(SoundManager.bgmVolume);
        SoundManager.setSoundVolume(SoundManager.bgmVolume, SoundManager.seVolume);
        
    }

    public onSeArrowTapped(value: number): void {
        let vol = SoundManager.seVolume; 
        vol += value;
      
        if(vol < 0) {
            vol = 0;
        } else if(vol > 1.0) {
            vol = 1.0;
        }

        const name = 'se_volume';
        (this.uiGraph.get(name)! as PIXI.Text).text = Math.round(vol * 10).toString();

        SoundManager.seVolume = vol;
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.saveSeVolumeToDB(SoundManager.seVolume);
    }

    public onPinPadTapped(padNumber: number): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        if(this.code.length >= 3) return;
        this.code.push(padNumber);
        let suffix;
        if(this.code.length === 1) {
            suffix = 'first';
        } else if(this.code.length === 2) {
            suffix = 'second';
        } else {
            suffix = 'third'
        }
        const codeText = this.uiGraph.get(`code_${suffix}`);
        if(!codeText) return;
        (codeText as PIXI.Text).text = padNumber.toString();
    }

    public onPinPadCancelTapped(): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        if(this.code.length === 0) return;
        this.code.pop();
        let suffix;
        if(this.code.length === 0) {
            suffix = 'first';
        } else if(this.code.length === 1) {
            suffix = 'second';
        } else {
            suffix = 'third'
        }
        const codeText = this.uiGraph.get(`code_${suffix}`);
        if(!codeText) return;
        (codeText as PIXI.Text).text = '';
    }
    
    public onPinPadEnterTapped(): void {
        this.gameLogic.onRoomObjectTapped('safe');
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.isPaused = false;
        const code1 = this.uiGraph.get('code_first');
        const code2 = this.uiGraph.get('code_second');
        const code3 = this.uiGraph.get('code_third');
        if(!code1 || !code2 || !code3) return;
        (code1 as PIXI.Text).text = '';
        (code2 as PIXI.Text).text = '';
        (code3 as PIXI.Text).text = '';

        if(
            this.code[0] === this.correctCode[0] &&
            this.code[1] === this.correctCode[1] && 
            this.code[2] === this.correctCode[2]
        ) {
            const messageIds = [
                'safe_opened',
                'there_is_crossbow',
                [
                    'get_crossbow',
                    'do_nothing'
                ]
            ];
            this.spawnMessageWindow(messageIds);
            const safe = this.roomObjects.get('safe');
            if(!safe) return;
            safe.messageIds.pop();
            safe.messageIds = [
                'safe_message_1',
                'there_is_crossbow',
                [
                    'get_crossbow',
                    'do_nothing'
                ]
            ];
            this.saveRoomObjectToDB(Resource.RoomObjects.SAFE,
                                    RoomObjectSaveKey.MessageIds, safe.messageIds);
        } else {
            const messageIds = [
                'wrong_code'
            ]
            this.spawnMessageWindow(messageIds);
        }
        this.pinPad.visible = false;
        this.code = [];
    }

    private spawnMessageWindow(messageIds: (string | string[])[]): void {
        this.messages.forEach((value, key) => {
            value.visible = true;
        });
        this.options.forEach((value, key) => {
            value.visible = true;
        });

        const messages = this.createMessages(messageIds);
        const messageWindow = new MessgageWindow(messages, this);
        messageWindow.zIndex = 3;
        this.messageWindow = messageWindow;
        this.addChild(messageWindow);
        this.registerUpdatingObject(messageWindow);
    }

    private createMessages(messageIds: (string | string[])[]): (PIXI.Text | OptionButton[])[] {
        const messages: (PIXI.Text | OptionButton[])[] = []
        for(const key of messageIds) {
            const options: OptionButton[] = [];
            if(typeof(key) === 'string') {
                const message = this.messages.get(key);
                if(!message) continue;
                messages.push(message);
            } else {
                for(const optionKey of key) {
                    const option = this.options.get(optionKey);
                    if(!option) continue;
                    options.push(option);
                }
                messages.push(options);
            }
        }
        return messages;
    }

    public onMessageWindowClosed(): void {
        this.gameLogic.onChackingEnd();
        this.messageWindow = null;
    }

    public onOptionSelected(optionType: number): void {
        if(optionType === OptionType.DoNoting) return;
        
        if(optionType === OptionType.ShowItemOption) {
            const options: OptionButton[] = [];
            this.itemPanels.forEach((value, key) => {
                if(value.hasItem) {
                    const option = this.options.get(value.optionId);
                    if(!option) return;
                    options.push(option);
                }
            });
            if(options.length === 0) {
                const text = this.messages.get('has_no_item');
                if(!text) return;
                this.messageWindow?.addText(text, 1);
            } else {
                this.messageWindow?.addText(options, 1);
            }
            return;
        }

        if(optionType === OptionType.ShowPinPad) {
            this.isPaused = true;
            this.pinPad.visible = true;
            return;
        }

        if(optionType === OptionType.BackToTitle) {
            this.visible = false;
            this.showTitleScene();
            return;
        }

        this.gameLogic.onOptionSelected(optionType);
    }

    public onItemUsed(optionType: number, checkingObject: RoomObjectEntity, playerItems?: number[]) {
        const roomObject = this.roomObjects.get(checkingObject.id);
        if(!roomObject) return;

        if(optionType === OptionType.UseTinStatue &&
           checkingObject.id === Resource.RoomObjects.GAS_STOVE) {
            const text1 = this.messages.get('tin_statue_melted');
            const text2 = this.messages.get('get_coin');
            if(!text1) return;
            if(!text2) return;
            this.messageWindow?.addText(text1, 1);
            this.messageWindow?.addText(text2, 2);
            roomObject.messageIds.pop();
            roomObject.messageIds.pop();
            this.saveRoomObjectToDB(Resource.RoomObjects.GAS_STOVE,
                                    RoomObjectSaveKey.MessageIds, roomObject.messageIds);
        } else if(optionType === OptionType.UseDVD &&
                  checkingObject.id === Resource.RoomObjects.TV) {
            const text1 = this.messages.get('serching');
            const text2 = this.messages.get('watched_dvd');
            if(!text1) return;
            if(!text2) return;
            this.messageWindow?.addText(text1, 1);
            this.messageWindow?.addText(text2, 2);
        } else if(optionType === OptionType.UseCoin &&
                  checkingObject.id === Resource.RoomObjects.VENDING_MACHINE) {
            const text = this.messages.get('get_banana');
            if(!text) return;
            this.messageWindow?.addText(text, 1);

            roomObject.messageIds.pop();
            this.saveRoomObjectToDB(Resource.RoomObjects.VENDING_MACHINE,
                                    RoomObjectSaveKey.MessageIds, roomObject.messageIds);
        } else if(optionType === OptionType.UseBanana &&
                  checkingObject.id === Resource.RoomObjects.FREEZER) {
            const text = this.messages.get('freeze_banana');
            if(!text) return;
            this.messageWindow?.addText(text, 1);

           roomObject.messageIds.pop();
           this.saveRoomObjectToDB(Resource.RoomObjects.FREEZER,
                                   RoomObjectSaveKey.MessageIds, roomObject.messageIds);
        } else if(optionType === OptionType.UseSalt &&
            checkingObject.id === Resource.RoomObjects.BARREL) {
            const text1 = this.messages.get('put_salt_in_barrel');
            const text2 = this.messages.get('get_desk_key');
            if(!text1) return;
            if(!text2) return;
            this.messageWindow?.addText(text1, 1);
            this.messageWindow?.addText(text2, 2);

            roomObject.messageIds.pop();
            roomObject.messageIds.pop();
            this.saveRoomObjectToDB(Resource.RoomObjects.BARREL,
                                    RoomObjectSaveKey.MessageIds, roomObject.messageIds);
        } else if(optionType === OptionType.UseDeskKey &&
            checkingObject.id === Resource.RoomObjects.DESK) {
            const options: OptionButton[] = [];
            const text1 = this.messages.get('unlock');
            const text2 = this.messages.get('there_is_pencil');
            const option1 = this.options.get('get_pencil');
            const option2 = this.options.get('do_nothing');
            if(!text1) return;
            if(!text2) return;
            if(!option1) return;
            if(!option2) return;
            options.push(option1);
            options.push(option2);
            this.messageWindow?.addText(text1, 1);
            this.messageWindow?.addText(text2, 2);
            this.messageWindow?.addText(options, 3);
        } else if(optionType === OptionType.UsePencil &&
            checkingObject.id === Resource.RoomObjects.GRINDER) {
            const text1 = this.messages.get('grind_pencil');
            const text2 = this.messages.get('get_sharpened_pencil');
            if(!text1) return;
            if(!text2) return;
            this.messageWindow?.addText(text1, 1);
            this.messageWindow?.addText(text2, 2);
            roomObject.messageIds.pop();
            this.saveRoomObjectToDB(Resource.RoomObjects.GRINDER,
                                    RoomObjectSaveKey.MessageIds, roomObject.messageIds);
        } else if(optionType === OptionType.UseDetergent &&
            checkingObject.id === Resource.RoomObjects.MIRROR) {
            const options: OptionButton[] = [];
            const text1 = this.messages.get('washed_mirror');
            const text2 = this.messages.get('mirror_message_3');
            const option1 = this.options.get('use_item');
            const option2 = this.options.get('do_nothing');
            if(!text1) return;
            if(!text2) return;
            if(!option1) return;
            if(!option2) return;
            options.push(option1);
            options.push(option2);
            this.messageWindow?.addText(text1, 1);
            this.messageWindow?.addText(text2, 2);
            this.messageWindow?.addText(options, 3);
            roomObject.messageIds[1] = 'mirror_message_3';
            this.saveRoomObjectToDB(Resource.RoomObjects.MIRROR,
                                    RoomObjectSaveKey.MessageIds, roomObject.messageIds);
            
            const texture = PIXI.utils.TextureCache['room_object/mirror.png'];
            roomObject.sprite.texture = texture;
            this.saveRoomObjectToDB(Resource.RoomObjects.MIRROR,
                                    RoomObjectSaveKey.TextureName, 'room_object/mirror.png');
        } else if(optionType === OptionType.UseHandMirror &&
            checkingObject.id === Resource.RoomObjects.MIRROR  &&
            checkingObject.states.indexOf(RoomObjectState.Washed) !== -1) {
            const text = this.messages.get('mirror_message_4');
            if(!text) return;
            this.messageWindow?.addText(text, 1);
        } else if(optionType === OptionType.UseCarKey &&
            checkingObject.id === Resource.RoomObjects.CAR) {
            this.isPaused = true;
            this.beginTransitionOut(() => {
                this.isPaused = false;
                this.player.sprite.position.set(456.4, 426.6);
                const resources = GameManager.game.loader.resources;
                const stageMaster = resources[Resource.UI.Stage].data as StageMaster;
                const mapData = stageMaster.carMovedMapData;
                this.resetTiles(mapData);
                this.saveData.mapData = mapData;
                this.saveProgressToDB();
                roomObject.position.x = 380;
                this.saveRoomObjectToDB(Resource.RoomObjects.CAR,
                                        RoomObjectSaveKey.Position,
                                        [roomObject.position.x, roomObject.position.y]);
                roomObject.downTiles = [
                    [8, 6],
                    [8, 7],
                    [8, 8],
                    [9, 6],
                    [9, 7],
                    [9, 8]
                ];
                this.saveRoomObjectToDB(Resource.RoomObjects.CAR,
                                        RoomObjectSaveKey.DownTiles, roomObject.downTiles);
                this.spawnMessageWindow(['moved_car']);
                this.beginTransitionIn(() => {});
                roomObject.messageIds.pop();
                this.saveRoomObjectToDB(Resource.RoomObjects.CAR,
                                        RoomObjectSaveKey.MessageIds, roomObject.messageIds);
            }, false);
        } else if(optionType === OptionType.UseCrossBow &&
                  checkingObject.id === Resource.RoomObjects.BALLOON  &&
                  playerItems?.indexOf(Items.SHARPENED_PENCIL) !== -1
            ) {
            this.isPaused = true;
            this.beginTransitionOut(() => {
                this.isPaused = false;
                roomObject.sprite.visible = false;
                this.saveRoomObjectToDB(Resource.RoomObjects.BALLOON,
                                        RoomObjectSaveKey.Visible, roomObject.sprite.visible);
                const tile = this.tiles.get(65);
                if(!tile) return;
                tile.tileSprite.texture = PIXI.utils.TextureCache['stage/floor.png'];
                this.saveData.isBalloonExist = false;
                this.saveProgressToDB();
                this.spawnMessageWindow(['find_nail', 'get_nail']);
                this.gameLogic.onRoomObjectTapped(Resource.RoomObjects.BALLOON);
                this.beginTransitionIn(() => {});
            }, false);
        } else if(optionType === OptionType.UseFrozenBanana &&
                  checkingObject.id === Resource.RoomObjects.CHAIR  &&
                  playerItems?.indexOf(Items.NAIL) !== -1
            ) {
            this.isPaused = true;
            this.beginTransitionOut(() => {
                this.isPaused = false;
                const texture = PIXI.utils.TextureCache['room_object/chair.png']
                roomObject.sprite.texture = texture;
                this.saveRoomObjectToDB(Resource.RoomObjects.CHAIR,
                                        RoomObjectSaveKey.TextureName, 'room_object/chair.png');
                roomObject.position.set(205, 85);
                this.saveRoomObjectToDB(Resource.RoomObjects.CHAIR,
                                        RoomObjectSaveKey.Position,
                                        [roomObject.position.x, roomObject.position.y]);
                roomObject.messageIds = [
                    'chair_message_1',
                ];
                this.saveRoomObjectToDB(Resource.RoomObjects.CHAIR,
                                        RoomObjectSaveKey.MessageIds, roomObject.messageIds);
                this.spawnMessageWindow([
                    'fix_chair',
                ]);
                this.gameLogic.onRoomObjectTapped(Resource.RoomObjects.CHAIR);
                this.beginTransitionIn(() => {});
            }, false);
            const clock = this.roomObjects.get('clock');
            if(!clock) return;
            clock.messageIds = [
                'clock_message_2',
                'clock_message_3',
                [
                    'set_clock',
                    'do_nothing'
                ]
            ];
            this.saveRoomObjectToDB(Resource.RoomObjects.CLOCK,
                                    RoomObjectSaveKey.MessageIds, clock.messageIds);
        } else {
            const text = this.messages.get('can_not_use');
            if(!text) return;
            this.messageWindow?.addText(text, 1);
        }
    }

    public onPlayerItemsChanged(playerItems: number[]): void {
        this.saveData.playerItems = playerItems;
        this.saveProgressToDB();
        this.menu.updateItemPanels(playerItems);
    }

    public onRoomObjectOptionSelected(roomObjectEntity: RoomObjectEntity, optionType: number): void {
        const roomObject = this.roomObjects.get(roomObjectEntity.id);
        if(!roomObject) return;
        if(optionType === OptionType.CheckUnderBed) {
            if(roomObjectEntity.states.indexOf(RoomObjectState.CheckedUnderBed) === -1) {
                const message1 = this.messages.get('serching');
                const message2 = this.messages.get('get_tin_statue');
                if(!message1) return;
                if(!message2) return;
                this.messageWindow?.addText(message1, 1);
                this.messageWindow?.addText(message2, 2);
            } else {
                const text = this.messages.get(Resource.MessageIds.NothingSpecial);
                if(!text) return;
                this.messageWindow?.addText(text, 1);
            }
        }
        if(optionType === OptionType.CheckUnderPillow) {
            if(roomObjectEntity.states.indexOf(RoomObjectState.CheckedUnderPillow) === -1) {
                const message1 = this.messages.get('serching');
                const message2 = this.messages.get('get_hand_mirror');
                if(!message1) return;
                if(!message2) return;
                this.messageWindow?.addText(message1, 1);
                this.messageWindow?.addText(message2, 2);
            } else {
                const text = this.messages.get(Resource.MessageIds.NothingSpecial);
                if(!text) return;
                this.messageWindow?.addText(text, 1);
            }
        }
        if(optionType === OptionType.JumpOnBed) {
            if(roomObjectEntity.states.indexOf(RoomObjectState.JumpedOnBed) === -1) {
                const message = this.messages.get('something_on_closet');
                if(!message) return;
                this.messageWindow?.addText(message, 1);

                const closet = this.roomObjects.get(Resource.RoomObjects.CLOSET);
                const options = closet?.messageIds[closet.messageIds.length - 1];
                if(options instanceof Array) {
                    options.unshift('check_on_closet');
                }
                this.saveRoomObjectToDB(Resource.RoomObjects.CLOSET,
                                        RoomObjectSaveKey.MessageIds, closet?.messageIds);
            } else if(roomObjectEntity.states.indexOf(RoomObjectState.GotCarKey) === -1) {
                const text = this.messages.get('something_on_closet');
                if(!text) return;
                this.messageWindow?.addText(text, 1);
            } else {
                const text = this.messages.get('have_a_fun');
                if(!text) return;
                this.messageWindow?.addText(text, 1);
            }
        }
        if(optionType === OptionType.CheckInCloset) {
            if(roomObjectEntity.states.indexOf(RoomObjectState.CheckedInCloset) === -1) {
                const message1 = this.messages.get('serching');
                const message2 = this.messages.get('get_detergent');
                if(!message1) return;
                if(!message2) return;
                this.messageWindow?.addText(message1, 1);
                this.messageWindow?.addText(message2, 2);
            } else {
                const text = this.messages.get(Resource.MessageIds.NothingSpecial);
                if(!text) return;
                this.messageWindow?.addText(text, 1);
            }
        }
        if(optionType === OptionType.CheckOnCloset) {
            if(roomObjectEntity.states.indexOf(RoomObjectState.CheckedOnCloset) === -1) {
                const message1 = this.messages.get('serching');
                const message2 = this.messages.get('get_car_key');
                if(!message1) return;
                if(!message2) return;
                this.messageWindow?.addText(message1, 1);
                this.messageWindow?.addText(message2, 2);
            } else {
                const text = this.messages.get(Resource.MessageIds.NothingSpecial);
                if(!text) return;
                this.messageWindow?.addText(text, 1);
            }
        }
        if(optionType === OptionType.GetSalt) { 
            const message = this.messages.get("get_salt");
            if(!message) return;
            this.messageWindow?.addText(message, 1);

            roomObject.messageIds.pop();
            roomObject.messageIds.pop();
            this.saveRoomObjectToDB(Resource.RoomObjects.CABINET, 
                                    RoomObjectSaveKey.MessageIds, roomObject.messageIds);
        }
        if(optionType === OptionType.GetCrossbow) { 
            const message = this.messages.get("get_crossbow");
            if(!message) return;
            this.messageWindow?.addText(message, 1);

            roomObject.messageIds.pop();
            roomObject.messageIds.pop();
            this.saveRoomObjectToDB(Resource.RoomObjects.SAFE,
                                    RoomObjectSaveKey.MessageIds, roomObject.messageIds);
        }
        if(optionType === OptionType.GetDVD) { 
            const message = this.messages.get("get_dvd");
            if(!message) return;
            this.messageWindow?.addText(message, 1);
        }
        if(optionType === OptionType.CheckRightDrawer) {
            if(roomObjectEntity.states.indexOf(RoomObjectState.UsedKey) === -1) {
                const options: OptionButton[] = [];
                const text = this.messages.get('locked');
                const option1 = this.options.get('use_item');
                const option2 = this.options.get('do_nothing');
                if(!text) return;
                if(!option1) return;
                if(!option2) return;
                options.push(option1);
                options.push(option2);
                this.messageWindow?.addText(text, 1);
                this.messageWindow?.addText(options, 2);
            } else if(roomObjectEntity.states.indexOf(RoomObjectState.HasNoPencil) === -1){
                const options: OptionButton[] = [];
                const text = this.messages.get('there_is_pencil');
                const option1 = this.options.get('get_pencil');
                const option2 = this.options.get('do_nothing');
                if(!text) return;
                if(!option1) return;
                if(!option2) return;
                options.push(option1);
                options.push(option2);
                this.messageWindow?.addText(text, 1);
                this.messageWindow?.addText(options, 2);
            } else {
                const text = this.messages.get(Resource.MessageIds.NothingSpecial);
                if(!text) return;
                this.messageWindow?.addText(text, 1);
            }
        }
        if(optionType === OptionType.CheckLeftDrawer) {
            if(roomObjectEntity.states.indexOf(RoomObjectState.HasNoDVD) === -1){
                const options: OptionButton[] = [];
                const text = this.messages.get('there_is_dvd');
                const option1 = this.options.get('get_dvd');
                const option2 = this.options.get('do_nothing');
                if(!text) return;
                if(!option1) return;
                if(!option2) return;
                options.push(option1);
                options.push(option2);
                this.messageWindow?.addText(text, 1);
                this.messageWindow?.addText(options, 2);
            } else {
                const text = this.messages.get(Resource.MessageIds.NothingSpecial);
                if(!text) return;
                this.messageWindow?.addText(text, 1);
            }
        }
        if(optionType === OptionType.GetPenCil) { 
            const message = this.messages.get("get_pencil");
            if(!message) return;
            this.messageWindow?.addText(message, 1);
        }
        if(optionType === OptionType.MovePig) {
            const text = this.messages.get('not_move');
            if(!text) return;
            this.messageWindow?.addText(text, 1);
        }
        if(optionType === OptionType.ReadHint) {
            const options = [];
            const option1 = this.options.get('hint_1');
            const option2 = this.options.get('hint_2');
            if(!option1) return;
            if(!option2) return;
            options.push(option1);
            options.push(option2);
            this.messageWindow?.addText(options, 1);
        }
        if(optionType === OptionType.ReadHint1) {
            const text = this.messages.get('hint_1');
            if(!text) return;
            this.messageWindow?.addText(text, 1);
        }
        if(optionType === OptionType.ReadHint2) {
            const text = this.messages.get('hint_2');
            if(!text) return;
            this.messageWindow?.addText(text, 1);
        }
        if(optionType === OptionType.SetTime) {
            this.isPaused = true;
            this.beginTransitionOut(() => {
                this.isPaused = false;
                const resources = GameManager.game.loader.resources;
                const stageMaster = resources[Resource.UI.Stage].data as StageMaster;
                const mapData = stageMaster.pigMovedMapData;
                this.resetTiles(mapData);
                this.saveData.mapData = mapData;
                this.saveProgressToDB();
                const pig = this.roomObjects.get('pig');
                if(!pig) return;
                const pigTexture = PIXI.utils.TextureCache['room_object/pig2.png'];
                const clockTexture = PIXI.utils.TextureCache['room_object/clock_12_00.png'];
                pig.sprite.texture = pigTexture;
                this.saveRoomObjectToDB(Resource.RoomObjects.PIG,
                                        RoomObjectSaveKey.TextureName, 'room_object/pig2.png');
                roomObject.sprite.texture = clockTexture;
                this.saveRoomObjectToDB(Resource.RoomObjects.CLOCK,
                                        RoomObjectSaveKey.TextureName, 'room_object/clock_12_00.png');
                pig.position.set(40, 565);
                this.saveRoomObjectToDB(Resource.RoomObjects.PIG,
                                        RoomObjectSaveKey.Position,
                                        [pig.position.x, pig.position.y]);
                pig.downTiles = [
                    [9, 1]
                ];
                this.saveRoomObjectToDB(Resource.RoomObjects.PIG,
                                        RoomObjectSaveKey.DownTiles, pig.downTiles);
                pig.messageIds = [
                    'pig_message_2'
                ];
                this.saveRoomObjectToDB(Resource.RoomObjects.PIG,
                                        RoomObjectSaveKey.MessageIds, pig.messageIds);
                this.spawnMessageWindow(['moved_pig']);
                this.beginTransitionIn(() => {});
                roomObject.messageIds.pop();
                roomObject.messageIds.pop();
                this.saveRoomObjectToDB(Resource.RoomObjects.CLOCK,
                                        RoomObjectSaveKey.MessageIds, roomObject.messageIds);
            }, false);
        }
    }

    public onPlayerEntityWalked(entity: PlayerEntity): void {
        switch(entity.walkDirection) {
            case WalkDirection.UP: {
                this.player.requestAnimation(Resource.AnimationTypes.Player.WALKUP);
                break;
            }
            case WalkDirection.DOWN: {
                this.player.requestAnimation(Resource.AnimationTypes.Player.WALKDOWN);
                break;
            }
            case WalkDirection.LEFT: {
                this.player.requestAnimation(Resource.AnimationTypes.Player.WALKLEFT);
                break;
            }
            case WalkDirection.RIGHT: {
                this.player.requestAnimation(Resource.AnimationTypes.Player.WALKRIGHT);
                break;
            }
            default: break;
        }
        
        this.tiles.forEach((tile) => {
            if(entity.positionRow === tile.tilePosition[0] &&
                entity.positionColumn === tile.tilePosition[1]) {
                tile.interactive = false;
             } else {
                tile.interactive = true;
             }
        });

        if(entity.walkDirection === WalkDirection.UP || entity.walkDirection === WalkDirection.DOWN) {
            this.player.sprite.y = this.player.spawnedPosition.y + entity.distanceRow;
        } else {
            this.player.sprite.x = this.player.spawnedPosition.x + entity.distanceColumn;
        }

        if(entity.positionRow === 3 && entity.positionColumn === 4 ||     
           entity.positionRow === 3 && entity.positionColumn === 5 ||
           entity.positionRow === 3 && entity.positionColumn === 6 ||
           entity.positionRow === 4 && entity.positionColumn === 4 ||
           entity.positionRow === 4 && entity.positionColumn === 5 ||
           entity.positionRow === 4 && entity.positionColumn === 6 ||
           entity.positionRow === 5 && entity.positionColumn === 5
        ) { 
            if(this.player.sprite.zIndex === 0) return;
            this.player.sprite.zIndex = 0;
            this.sortChildren();              
        } else {
            if(this.player.sprite.zIndex === 2) return;
            this.player.sprite.zIndex = 2;
            this.sortChildren();
        }
    }

    private onTileTapped(tappedTile: Tile): void {
        if(this.isPaused || this.messageWindow) return;
        
        let isTileActive = false;
        this.tiles.forEach((tile) => {
            if(
                tile.isActive &&
                tappedTile.tilePosition[0] === tile.tilePosition[0] &&
                tappedTile.tilePosition[1] === tile.tilePosition[1]
            ) {
                this.gameLogic.requestWalk(tappedTile.tilePosition);
                tappedTile.toggleFrame();
                isTileActive = true;
            } else if(tile.isActive) {
                tile.toggleFrame();
                isTileActive = true;
            } 
        });
        if(isTileActive === false) {
            tappedTile.toggleFrame();
        }
    }

    private initRoomObject(saveData: RoomObjectSaveData[]): void {
        for(const data of saveData) {
            const roomObject = this.roomObjects.get(data.id);
            if(!roomObject) return;
            if(data.downTiles) {
                roomObject.downTiles = data.downTiles;
            }
            if(data.messageIds) {
                roomObject.messageIds = data.messageIds;
            }
            if(data.position) {
                roomObject.position.set(data.position[0], data.position[1]);
            }
            if(data.textureName) {
                const texture = PIXI.utils.TextureCache[data.textureName];
                roomObject.sprite.texture = texture;
            }
            if(data.visible !== undefined) {
                roomObject.sprite.visible = data.visible;
            }
        }
    }

    private initTiles(stageMaster: StageMaster, tileSize: number): void {
        const tileData = stageMaster.tileData;
        for(let i = 0; i < tileData.length; i++) {
            const row = tileData[i];
            for(let j = 0; j < row.length; j++) {
                const tileType = row[j];
                const tile = new Tile(tileType, [i, j], tileSize);

                tile.position.set(j * this.tileSize, i * this.tileSize);
                
                if(stageMaster.mapData[i][j] !== 1) {
                    tile.touchable = true;
                    tile.interactive = true;
                }
               
                tile.on('pointertap', () => {
                    this.onTileTapped(tile);
                });
                
                const iString = i.toString();
                const jString = j.toString();
                this.tiles.set(Number(iString + jString), tile);
                this.addChild(tile);
            }
        }
    }

    public onGameOver(): void {
        this.isPaused = true;
        this.menu.visible = false;
        this.soundOption.visible = false;

        this.deleteSaveData();

        SoundManager.destroySound(Resource.Audio.Bgm.EscapeBGM);
        this.beginTransitionOut(() => {
            SoundManager.playBgm(Resource.Audio.Bgm.EndingBGM, 6);

            this.spawnMessageWindow([
                'serching',
                'wake_message_1',
                'wake_message_2',
                'wake_message_3',
                'thanks_message',
                [
                    'back_to_title_2'
                ]
            ]);
        });
        
        this.state = PlaySceneState.FINISHED;
    }

    protected getCustomUiGraphFactory(type: string): UiNodeFactory | null {
        if(type === 'room_object') {
            return new RoomObjectFactory();
        } else if(type === 'text_option' || type === 'menu_text_option') {
            return new TextOptionFactory();
        } else if(type === 'sprite_option') {
            return new SpriteOptionFactory();
        } else if(type === 'item_panel') {
            return new ItemPanelFactory();
        } {
            return null;
        }
    }

    protected prepareUiGraphContainer(uiData: UI.Graph): void {
        for(const nodeData of uiData.nodes) {
            const factory = UiGraph.getFactory(nodeData.type) || this.getCustomUiGraphFactory(nodeData.type);
            if(!factory) continue;
            
            const node = factory.createUiNodeByGraphElement(nodeData);
            if(!node) continue;
        
            if(nodeData.events) factory.attachUiEventByGraphElement(nodeData.events, node, this);
            
            if(nodeData.type === 'room_object') {
                this.roomObjects.set(nodeData.id, (node as RoomObject));
                this.saveData.roomObject.push({
                    id: nodeData.id
                });
            } else if(nodeData.type === 'message') {
                this.messages.set(nodeData.id, (node as PIXI.Text));
            } else if(nodeData.type === 'menu_text') {
                this.menuTexts.set(nodeData.id, (node as PIXI.Text));
            } else if(nodeData.type === 'menu_text_option') {
                this.menuTexts.set(nodeData.id, (node as OptionButton));
            } else if(nodeData.type === 'text_option' || nodeData.type === 'sprite_option') {
                this.options.set(nodeData.id, (node as OptionButton));
            } else if(nodeData.type === 'item_panel') {
                this.itemPanels.push(node as ItemPanel);
            } else {
                this.uiGraph.set(nodeData.id, node);
            }
            
            if(nodeData.type === 'room_object') {
                this.uiGraphContainer.addChild(node);
            }
        }
    }

    private resetTiles(mapData: number[][]): void {
        for(let i = 0; i < mapData.length; i++) {
            const row = mapData[i];
            for(let j = 0; j < row.length; j++) {
                const tileData = mapData[i][j];
                const iString = i.toString();
                const jString = j.toString();
                const tile = this.tiles.get(Number(iString + jString));
                if(!tile) continue;

                if(tileData === 0) {
                    tile.touchable = true;
                    tile.interactive = true;
                } else {
                    tile.touchable = false;
                    tile.interactive = false;
                }
            }
        }
    }

    public showTitleScene(): void {
        SoundManager.paused = false;
        SoundManager.sceneIsPaused = false;
        this.destroySound();
        GameManager.loadScene(new TitleScene());
    }

    private saveRoomObjectToDB(id: string, key: string, value: any): void {
        for(const data of this.saveData.roomObject) {
            if(data.id === id) {
                switch(key) {
                    case 'downTiles': {
                        data.downTiles = value;
                        break;
                    }
                    case 'messageIds': {
                        data.messageIds = value;
                        break;
                    }
                    case 'position': {
                        data.position = value;
                        break;
                    }
                    case 'textureName': {
                        data.textureName = value;
                        break
                    }
                    case 'visible': {
                        data.visible = value;
                    }
                    default:
                        break;
                }
            }
        }
        this.saveProgressToDB();
    }
    
    private saveProgressToDB(): void {
        IndexedDBManager.put('saveData', this.saveData);
    }

    private loadSaveDataFromDB(stageMaster: StageMaster, roomObjectMaster: RoomObjectMaster[]): void {
        IndexedDBManager.get(
            'saveData',
            (value) => {
                if(value) {
                    this.saveData = value;
                    this.initRoomObject(this.saveData.roomObject);
                    if(this.saveData.mapData !== undefined) {
                        this.resetTiles(this.saveData.mapData);
                    }
                    if(this.saveData.playerItems.length !== 0) {
                        this.menu.updateItemPanels(this.saveData.playerItems);
                    }
                    if(this.saveData.code.length !== 0) {
                        this.correctCode = this.saveData.code;
                    }
                    if(!this.saveData.isBalloonExist) {
                        const tile = this.tiles.get(65);
                        if(!tile) return;
                        tile.tileSprite.texture = PIXI.utils.TextureCache['stage/floor.png'];
                    }
                } else {
                    this.spawnMessageWindow(['start_escape']);

                    for(let i = 0; i < 3; i++) {
                        const code = Math.floor(Math.random() * 10);
                        this.correctCode.push(code);
                    }
                    this.saveData.code = this.correctCode;
                    this.saveProgressToDB();
                }
                this.initCode();

                this.gameLogic.init({
                    delegator: this,
                    stageMaster: stageMaster,
                    roomObjectMaster: roomObjectMaster,
                    saveData: this.saveData
                });
                
                if(this.transitionIn.isFinished()) {
                    this.state = PlaySceneState.READY;
                } else {
                    this.state = PlaySceneState.RESOURCE_LOADED;
                }
            }
        );
    }

    private saveBgmVolumeToDB(value: number): void {
        IndexedDBManager.put('bgmVolume', value);
    }

    private saveSeVolumeToDB(value: number): void {
        IndexedDBManager.put('seVolume', value);
    }

    private deleteSaveData(): void {
        IndexedDBManager.delete('saveData');
    }
}