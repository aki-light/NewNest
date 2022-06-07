import Resource from '../Resources';
import LoaderAddParam from '../interfaces/LoaderAddParams';
import Scene from '../scenes/Scene';
import GameManager from '../managers/GameManager';
import Fade from './transition/Fade';
import SoundManager from '../managers/SoundManager';
import UiNodeFactory from '../modules/UiNodeFactory/UiNodeFactory';
import * as UI from '../interfaces/UiGraph/index';
import UiGraph from '../modules/UiGraph';
import * as PIXI from 'pixi.js';
import MessgageWindow from '../display/MessageWindow';
import EquipmentParam from '../interfaces/EquipmentParam';
import EquipmentStatus from '../entity/EquipmentStatus';
import PlayerStatus from '../entity/PlayerStatus';
import TalkScene from './TalkScene';
import MessageWindowDelegate from '../interfaces/MessageWindowDelegate';

export default class InventoryScene extends Scene implements MessageWindowDelegate {
    public isPaused: boolean = false;
    private equipmentPage: PIXI.Container = new PIXI.Container();
    private itemPage: PIXI.Container = new PIXI.Container();
    private texts: Map<string, PIXI.Text> = new Map();
    private equipmentNames: Map<string, PIXI.Container> = new Map();
    private messageWindowClosed: boolean = true;
    private language: string;
    private selectedMarker1: PIXI.Container | null = null;
    private selectedMarker2: PIXI.Container | null = null;
    private selectedMarker3: PIXI.Container | null = null;
    private selectedMarker4: PIXI.Container | null = null;
    private rank: PIXI.Container | null = null;
    private selectedEquipmentParam: EquipmentParam | null = null;
    private equipmentHPs: EquipmentStatus = new EquipmentStatus;
    private equipmentFPs: EquipmentStatus = new EquipmentStatus;
    private equipmentATKs: EquipmentStatus = new EquipmentStatus;
    private equipmentDEFs: EquipmentStatus = new EquipmentStatus;
    private equipmentDVs: EquipmentStatus = new EquipmentStatus;
    private equipmentHITs: EquipmentStatus = new EquipmentStatus;
    private equipmentCRITs: EquipmentStatus = new EquipmentStatus;
    private weaponE: PIXI.Container | null = null;
    private headE: PIXI.Container | null = null;
    private bodyE: PIXI.Container | null = null;
    private armE: PIXI.Container | null = null;
    private footE: PIXI.Container | null = null;
    private initialPlayerStatus: PlayerStatus = new PlayerStatus;
    private playerStatus: PlayerStatus = new PlayerStatus;
    private equipingWeaponParam: EquipmentParam | null = null;
    private equipingHeadParam: EquipmentParam | null = null;
    private equipingBodyParam: EquipmentParam | null = null;
    private equipingArmParam: EquipmentParam | null = null;
    private equipingFootParam: EquipmentParam | null = null;
    private itemNames1: PIXI.Container = new PIXI.Container;
    private itemNames2: PIXI.Container = new PIXI.Container;
    private itemNumbers: Map<string, number> = new Map;
    private firstSelectIsDone: boolean = false;
    private itemCp: number = 2700;

    constructor(language: string) {
        super();
        
        this.transitionIn = new Fade(1.0, 0.0, -0.02);
        this.transitionOut = new Fade(0.0, 1.0, 0.02);
        this.sceneName = 'inventory_scene';
        this.language = language;

        for(const itemName of Resource.ItemList) {
            this.itemNumbers.set(itemName, 5);
        }
    }

    public beginTransitionIn(onTransitionFinished: (scene: Scene) => void, afterFinishedVisible?: boolean): void {
        super.beginTransitionIn(() => {
            onTransitionFinished(this);
        }, afterFinishedVisible);
    }
    
    protected createInitialResourceList(): (string | LoaderAddParam)[] {
        return super.createInitialResourceList().concat(
            MessgageWindow.resourceList,
            Resource.Items,
            Resource.EquipMents,
            [
                Resource.Audio.Se.ShowNextText,
                Resource.Audio.Se.Equip,
                Resource.Audio.Se.minus,
                Resource.Audio.Se.plus,
                Resource.UI.OptionFrame
            ]
        );
    }

    protected loadInitialResource(onLoaded: () => void): void {
        const assets = this.createInitialResourceList();
        const name1 = Resource.UI.SceneUiGraph(this.sceneName);
        let name2;
        if(this.language === 'japanese') {
            name2 = Resource.Texts.InventoryScene.Ja;
        } else {
            name2 = Resource.Texts.InventoryScene.En
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
            name2 = Resource.Texts.InventoryScene.Ja;
        } else {
            name2 = Resource.Texts.InventoryScene.En;
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
            name1 = Resource.Texts.InventoryScene.Ja;
        } else {
            name1 = Resource.Texts.InventoryScene.En;
        }
        const json2 = GameManager.game.loader.resources[name1].data;
        this.prepareUiGraphContainer(json1);
        this.prepareUiGraphContainer(json2);

        this.uiGraphContainer.zIndex = 1;
        this.addChild(this.uiGraphContainer);
        this.equipmentPage.visible = false;
        this.addChild(this.equipmentPage);
        this.itemNames2.visible = false;    
        this.itemPage.addChild(this.itemNames1);
        this.itemPage.addChild(this.itemNames2);
        this.addChild(this.itemPage);
        this.initSound();
        this.initPlayerStatus();
        this.onInventoryTypeSelected('equipment');
        this.onEquipmentTypeSelected('weapon_marker', [
            'weapon_name_1',
            'weapon_name_2',
            'weapon_name_3',
            'weapon_name_4',
            'weapon_name_5',
            'weapon_name_6'
        ],
        {
            "markerName": "equipment_1_marker",
            "eName": "equipment_1_e",
            "textureName": "equipments/weapon08_03.png",
            "type": "weapon",
            "rank": "legendary",
            "hp": 0,
            "fp": 100,
            "atk": 5,
            "def": 0,
            "dv": 0,
            "hit": 1,
            "crit": 3
        });
        
        let caption;
            if(this.language === 'japanese') {
                caption = '300HPかいふく';
            } else {
                caption = 'Recover 300HP';
            }
        this.onItemNameTapped(
            'items/potion3_04.png',
            'item_marker_1',
            caption
        );
        this.spawnMessageWindow(['prepare_battle'], 'hero_name');
    }

    private initSound(): void {
        const resources = GameManager.game.loader.resources as any;
        const soundList = [
            Resource.Audio.Se.ShowNextText,
            Resource.Audio.Se.Equip,
            Resource.Audio.Se.minus,
            Resource.Audio.Se.plus
          ];
          for(const name of soundList) {
              SoundManager.createSound(name, resources[name].buffer);
          }
    }

    public update(dt: number):void {
        super.update(dt);
    
        if(this.transitionIn.isActive()) {
            this.transitionIn.update(dt);
        } else if(this.transitionOut.isActive()) {
            this.transitionOut.update(dt);
        }
    }

    private spawnMessageWindow(textIds: string[], name: string): void {
        const texts = this.createTexts(textIds);
        const speakerName = this.texts.get(name);
        if(!speakerName) return;
        const messageWindow = new MessgageWindow(texts, speakerName, this);
        messageWindow.zIndex = 3;
        this.messageWindowClosed = false;
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
        this.messageWindowClosed = true;
        this.firstSelectIsDone = true;
    }

    protected getCustomUiGraphFactory(type: string): UiNodeFactory | null {
        return null;
    }

    private updatePlayerStatus(): void {
        let equipmentHP: number = 0;
        let equipmentFP: number = 0;
        let equipmentATK: number = 0;
        let equipmentDEF: number = 0;
        let equipmentDV: number = 0;
        let equipmentHIT: number = 0;
        let equipmentCRIT: number = 0;
        for(const hp of Object.values(this.equipmentHPs)) {
            equipmentHP += hp;
        }
        for(const fp of Object.values(this.equipmentFPs)) {
            equipmentFP += fp;
        }
        for(const atk of Object.values(this.equipmentATKs)) {
            equipmentATK += atk;
        }
        for(const def of Object.values(this.equipmentDEFs)) {
            equipmentDEF += def;
        }
        for(const dv of Object.values(this.equipmentDVs)) {
            equipmentDV += dv;
        }
        for(const hit of Object.values(this.equipmentHITs)) {
            equipmentHIT += hit;
        }
        for(const crit of Object.values(this.equipmentCRITs)) {
            equipmentCRIT += crit;
        }
        this.playerStatus.hp = this.initialPlayerStatus.hp + equipmentHP;
        this.playerStatus.fp = this.initialPlayerStatus.fp + equipmentFP;
        this.playerStatus.atk = this.initialPlayerStatus.atk + equipmentATK;
        this.playerStatus.def = this.initialPlayerStatus.def + equipmentDEF;
        this.playerStatus.dv = this.initialPlayerStatus.dv + equipmentDV;
        this.playerStatus.hit = this.initialPlayerStatus.hit + equipmentHIT;
        this.playerStatus.crit = this.initialPlayerStatus.crit + equipmentCRIT;

        const maxHp = this.uiGraph.get('max_hp');
        const maxFp = this.uiGraph.get('max_fp');
        const maxAtk = this.uiGraph.get('max_atk');
        const maxDef = this.uiGraph.get('max_def');
        const maxHit = this.uiGraph.get('max_hit');
        const maxDv = this.uiGraph.get('max_dv');
        const maxCrit = this.uiGraph.get('max_crit');
        if(!maxAtk || !maxCrit || !maxDef || !maxDv || !maxFp || !maxHp || !maxHit) return;
        const hp = this.uiGraph.get('hp');
        const fp = this.uiGraph.get('fp');
        const atk = this.uiGraph.get('atk');
        const def = this.uiGraph.get('def');
        const dv = this.uiGraph.get('dv');
        const hit = this.uiGraph.get('hit');
        const crit = this.uiGraph.get('crit');
        if(!hp || !fp || !atk || !def || !dv || !hit || !crit) return;

        if(this.playerStatus.hp >= 1200) {
            this.playerStatus.hp = 1200;
            hp.visible = false;
            maxHp.visible = true;
        } else {
            hp.visible = true;
            maxHp.visible = false;
        }
        if(this.playerStatus.fp >= 1200) {
            this.playerStatus.fp = 1200;
            fp.visible = false;
            maxFp.visible = true;
        } else {
            fp.visible = true;
            maxFp.visible = false;
        }
        if(this.playerStatus.atk >= 10) {
            this.playerStatus.atk = 10;
            atk.visible = false;
            maxAtk.visible = true;
        } else {
            atk.visible = true;
            maxAtk.visible = false;
        }
        if(this.playerStatus.def >= 10) {
            this.playerStatus.def = 10;
            def.visible = false;
            maxDef.visible = true;
        } else {
            def.visible = true;
            maxDef.visible = false;
        }
        if(this.playerStatus.dv >= 10) {
            this.playerStatus.dv = 10;
            dv.visible = false;
            maxDv.visible = true;
        } else {
            dv.visible = true;
            maxDv.visible = false;
        }
        if(this.playerStatus.hit >= 10) {
            this.playerStatus.hit = 10;
            hit.visible = false;
            maxHit.visible = true;
        } else {
            hit.visible = true;
            maxHit.visible = false;
        }
        if(this.playerStatus.crit >= 10) {
            this.playerStatus.crit = 10;
            crit.visible = false;
            maxCrit.visible = true;
        } else {
            crit.visible = true;
            maxCrit.visible = false;
        }

        this.initPlayerStatus();
    }

    private updateCp(): void {
        let cp: number = 0;
        cp += 200 + (this.playerStatus.hp - 800) * 2;
        cp += 100 + (this.playerStatus.fp - 500);
        cp += this.playerStatus.atk * 200;
        cp += this.playerStatus.def * 200;
        cp += this.playerStatus.dv * 100;
        cp += this.playerStatus.hit * 100;
        cp += this.playerStatus.crit * 100;
        cp += this.itemCp;

        this.playerStatus.cp = cp;
        this.updateDifficulty();

        const cpText = this.uiGraph.get('cp');
        const cpText2 = this.uiGraph.get('cp_2');
        if(!cp) return;
        (cpText as PIXI.Text).text = cp.toString();
        (cpText2 as PIXI.Text).text = cp.toString();
    }

    private updateDifficulty(): void {
        const easy = this.uiGraph.get('easy');
        const easy2 = this.uiGraph.get('easy_2');
        const normal = this.uiGraph.get('normal');
        const normal2 = this.uiGraph.get('normal_2');
        const hard = this.uiGraph.get('hard');
        const hard2 = this.uiGraph.get('hard_2');
        if(!easy || !easy2 || !normal || !normal2 || !hard || !hard2) return;

        if(this.playerStatus.cp >= 8000) {
            easy.visible = true;
            easy2.visible = true;
            normal.visible = false;
            normal2.visible = false;
            hard.visible = false;
            hard2.visible = false;
        } else if(this.playerStatus.cp < 8000 && this.playerStatus.cp >= 7000) {
            easy.visible = false;
            easy2.visible = false;
            normal.visible = true;
            normal2.visible = true;
            hard.visible = false;
            hard2.visible = false;
        } else if(this.playerStatus.cp < 7000) {
            easy.visible = false;
            easy2.visible = false;
            normal.visible = false;
            normal2.visible = false;
            hard.visible = true;
            hard2.visible = true;
        }
    }

    private initPlayerStatus(): void {
        const hp = this.uiGraph.get('hp');
        const fp = this.uiGraph.get('fp');
        const atk = this.uiGraph.get('atk');
        const def = this.uiGraph.get('def');
        const dv = this.uiGraph.get('dv');
        const hit = this.uiGraph.get('hit');
        const crit = this.uiGraph.get('crit');
        if(!hp || !fp || !atk || !def || !dv || !hit || !crit) return;

        (hp as PIXI.Text).text = this.playerStatus.hp.toString();
        (fp as PIXI.Text).text = this.playerStatus.fp.toString();
        (atk as PIXI.Text).text = this.playerStatus.atk.toString();
        (def as PIXI.Text).text = this.playerStatus.def.toString();
        (dv as PIXI.Text).text = this.playerStatus.dv.toString();
        (hit as PIXI.Text).text = this.playerStatus.hit.toString();
        (crit as PIXI.Text).text = this.playerStatus.crit.toString();
    }

    public onInventoryTypeSelected(type: string): void {
        if(!this.messageWindowClosed) return;
        if(this.firstSelectIsDone) {
            SoundManager.playSe(Resource.Audio.Se.OptionTap);
        }

        if(type === "equipment") {
            this.equipmentPage.visible = true;
            this.itemPage.visible = false;
            
            if(this.selectedMarker1) {
                this.selectedMarker1.visible = false
            }
            const marker = this.uiGraph.get("equipment_marker");
            if(!marker) return;
            marker.visible = true;
            this.selectedMarker1 = marker;
        } else if(type === "item") {
            this.equipmentPage.visible = false;
            this.itemPage.visible = true;
            
            if(this.selectedMarker1) {
                this.selectedMarker1.visible = false;
            }
            const marker = this.uiGraph.get("item_marker");
            if(!marker) return;
            marker.visible = true;
            this.selectedMarker1 = marker;
        }
    }

    public onEquipmentTypeSelected(markerName: string, names: string[], param: EquipmentParam): void {
        if(!this.messageWindowClosed) return;
        if(this.firstSelectIsDone) {
            SoundManager.playSe(Resource.Audio.Se.OptionTap);
        }

        if(this.weaponE) this.weaponE.visible = false;
        if(this.headE) this.headE.visible = false;
        if(this.bodyE) this.bodyE.visible = false;
        if(this.armE) this.armE.visible = false;
        if(this.footE) this.footE.visible = false;

        if(param.type === 'weapon' && this.weaponE) this.weaponE.visible = true;
        if(param.type === 'head' && this.headE) this.headE.visible = true;
        if(param.type === 'body' && this.bodyE) this.bodyE.visible = true;
        if(param.type === 'arm' && this.armE) this.armE.visible = true;
        if(param.type === 'foot' && this.footE) this.footE.visible = true;
    
        this.equipmentNames.forEach((value, key) => {
            value.visible = false;
        });

        for(const name of names) {
            const equipmentName = this.equipmentNames.get(name);
            if(!equipmentName) continue;
            equipmentName.visible = true;
        }
        
        if(this.selectedMarker2) {
            this.selectedMarker2.visible = false;
        }
        const marker = this.uiGraph.get(markerName);
        if(!marker) return;
        marker.visible = true;
        this.selectedMarker2 = marker;

        this.selectedEquipmentParam = param;
        
        if(param.type === 'weapon' && this.equipingWeaponParam) {
            this.onEquipmentTypeSelected2(this.equipingWeaponParam, false);
        } else if(param.type === 'head' && this.equipingHeadParam) {
            this.onEquipmentTypeSelected2(this.equipingHeadParam, false);
        } else if(param.type === 'body' && this.equipingBodyParam) {
            this.onEquipmentTypeSelected2(this.equipingBodyParam, false);
        } else if(param.type === 'arm' && this.equipingArmParam) {
            this.onEquipmentTypeSelected2(this.equipingArmParam, false);
        } else if(param.type === 'foot' && this.equipingFootParam) {
            this.onEquipmentTypeSelected2(this.equipingFootParam, false);
        } else {
            this.onEquipmentTypeSelected2(param, false);
        }
    }

    public onEquipmentTypeSelected2(param: EquipmentParam, soundOn: boolean = true): void {
        if(!this.messageWindowClosed) return;
        if(this.firstSelectIsDone && soundOn) {
            SoundManager.playSe(Resource.Audio.Se.OptionTap);
        }

        this.selectedEquipmentParam = param;

        if(this.selectedMarker3) {
            this.selectedMarker3.visible = false;
        }
        const marker = this.uiGraph.get(param.markerName);
        if(!marker) return;
        marker.visible = true;
        this.selectedMarker3 = marker;

        if(this.rank) {
            this.rank.visible = false;
        }
        const rank = this.uiGraph.get(param.rank);
        if(!rank) return;
        rank.visible = true;
        this.rank = rank;

        const texture = PIXI.utils.TextureCache[param.textureName];
        const currentTexture = this.uiGraph.get('equipment_texture');
        if(!currentTexture) return;
        (currentTexture as PIXI.Sprite).texture = texture;

        const hp = this.uiGraph.get('equipment_hp');
        const fp = this.uiGraph.get('equipment_fp');
        const atk = this.uiGraph.get('equipment_atk');
        const def = this.uiGraph.get('equipment_def');
        const dv = this.uiGraph.get('equipment_dv');
        const hit = this.uiGraph.get('equipment_hit');
        const crit = this.uiGraph.get('equipment_crit');
        if(!hp || !fp || !atk || !def || !dv || !hit || !crit) return;
        (hp as PIXI.Text).text = param.hp.toString();
        (fp as PIXI.Text).text = param.fp.toString();
        (atk as PIXI.Text).text = param.atk.toString();
        (def as PIXI.Text).text = param.def.toString();
        (dv as PIXI.Text).text = param.dv.toString();
        (hit as PIXI.Text).text = param.hit.toString();
        (crit as PIXI.Text).text = param.crit.toString();

        const equipButton = this.uiGraph.get('equip_button');
        const equipButtonText = this.uiGraph.get('equip_button_text');
        const unEquipButton = this.uiGraph.get('unEquip_button');
        const unEquipButtonText = this.uiGraph.get('unEquip_button_text');
        if(!equipButton || !equipButtonText || !unEquipButton || !unEquipButtonText) { 
            return;
        }

        if(
            this.equipingWeaponParam?.textureName === this.selectedEquipmentParam.textureName ||
            this.equipingHeadParam?.textureName === this.selectedEquipmentParam.textureName ||
            this.equipingBodyParam?.textureName === this.selectedEquipmentParam.textureName ||
            this.equipingArmParam?.textureName === this.selectedEquipmentParam.textureName ||
            this.equipingFootParam?.textureName === this.selectedEquipmentParam.textureName
        ) {
            equipButton.visible = false;
            equipButtonText.visible = false;
            unEquipButton.visible = true;
            unEquipButtonText.visible = true;
        } else {
            equipButton.visible = true;
            equipButtonText.visible = true;
            unEquipButton.visible = false;
            unEquipButtonText.visible = false;
        }
    }

    public onUnEquipButtonTapped(): void {
        if(!this.messageWindowClosed) return;

        if(!this.selectedEquipmentParam) return;

        SoundManager.playSe(Resource.Audio.Se.Equip);

        const equipButton = this.uiGraph.get('equip_button');
        const equipButtonText = this.uiGraph.get('equip_button_text');
        const unEquipButton = this.uiGraph.get('unEquip_button');
        const unEquipButtonText = this.uiGraph.get('unEquip_button_text');
        if(!equipButton || !equipButtonText || !unEquipButton || !unEquipButtonText) { 
            return;
        }
        equipButton.visible = true;
        equipButtonText.visible = true;
        unEquipButton.visible = false;
        unEquipButtonText.visible = false;

        if(this.selectedEquipmentParam.type === 'weapon') {
            this.equipmentHPs.weapon = 0;
            this.equipmentFPs.weapon = 0;
            this.equipmentATKs.weapon = 0;
            this.equipmentDEFs.weapon = 0;
            this.equipmentDVs.weapon = 0;
            this.equipmentHITs.weapon = 0;
            this.equipmentCRITs.weapon = 0;
            
            if(this.weaponE) {
                this.weaponE.visible = false;
            }
            this.weaponE = null;

            this.equipingWeaponParam = null;
        } else if(this.selectedEquipmentParam.type === 'head') {
            this.equipmentHPs.head = 0;
            this.equipmentFPs.head = 0;
            this.equipmentATKs.head = 0;
            this.equipmentDEFs.head = 0;
            this.equipmentDVs.head = 0;
            this.equipmentHITs.head = 0;
            this.equipmentCRITs.head = 0;
            if(this.headE) {
                this.headE.visible = false;
            }
            this.headE = null;

            this.equipingHeadParam = null;
        } else if(this.selectedEquipmentParam.type === 'body') {
            this.equipmentHPs.body = 0;
            this.equipmentFPs.body = 0;
            this.equipmentATKs.body = 0;
            this.equipmentDEFs.body = 0;
            this.equipmentDVs.body = 0;
            this.equipmentHITs.body = 0;
            this.equipmentCRITs.body = 0;
            if(this.bodyE) {
                this.bodyE.visible = false;
            }
            this.bodyE = null;

            this.equipingBodyParam = null;
        } else if(this.selectedEquipmentParam.type === 'arm') {
            this.equipmentHPs.arm = 0;
            this.equipmentFPs.arm = 0;
            this.equipmentATKs.arm = 0;
            this.equipmentDEFs.arm = 0;
            this.equipmentDVs.arm = 0;
            this.equipmentHITs.arm = 0;
            this.equipmentCRITs.arm = 0;
            if(this.armE) {
                this.armE.visible = false;
            }
            this.armE = null;

            this.equipingArmParam = null;
        } else if(this.selectedEquipmentParam.type === 'foot') {
            this.equipmentHPs.foot = 0;
            this.equipmentFPs.foot = 0;
            this.equipmentATKs.foot = 0;
            this.equipmentDEFs.foot = 0;
            this.equipmentDVs.foot = 0;
            this.equipmentHITs.foot = 0;
            this.equipmentCRITs.foot = 0;
            if(this.footE) {
                this.footE.visible = false;
            }
            this.footE = null;

            this.equipingFootParam = null;
        }

        this.updatePlayerStatus();
        this.updateCp();
    }

    public onEquipButtonTapped(): void {
        if(!this.messageWindowClosed) return;

        if(!this.selectedEquipmentParam) return;

        SoundManager.playSe(Resource.Audio.Se.Equip);

        const equipButton = this.uiGraph.get('equip_button');
        const equipButtonText = this.uiGraph.get('equip_button_text');
        const unEquipButton = this.uiGraph.get('unEquip_button');
        const unEquipButtonText = this.uiGraph.get('unEquip_button_text');
        if(!equipButton || !equipButtonText || !unEquipButton || !unEquipButtonText) { 
            return;
        }
        equipButton.visible = false;
        equipButtonText.visible = false;
        unEquipButton.visible = true;
        unEquipButtonText.visible = true;

        if(this.selectedEquipmentParam.type === 'weapon') {
            this.equipmentHPs.weapon = this.selectedEquipmentParam.hp;
            this.equipmentFPs.weapon = this.selectedEquipmentParam.fp;
            this.equipmentATKs.weapon = this.selectedEquipmentParam.atk;
            this.equipmentDEFs.weapon = this.selectedEquipmentParam.def;
            this.equipmentDVs.weapon = this.selectedEquipmentParam.dv;
            this.equipmentHITs.weapon = this.selectedEquipmentParam.hit;
            this.equipmentCRITs.weapon = this.selectedEquipmentParam.crit;
            
            if(this.weaponE) {
                this.weaponE.visible = false;
            }
            const e = this.uiGraph.get(this.selectedEquipmentParam.eName);
            if(!e) return;
            e.visible = true;
            this.weaponE = e;

            this.equipingWeaponParam = this.selectedEquipmentParam;
        } else if(this.selectedEquipmentParam.type === 'head') {
            this.equipmentHPs.head = this.selectedEquipmentParam.hp;
            this.equipmentFPs.head = this.selectedEquipmentParam.fp;
            this.equipmentATKs.head = this.selectedEquipmentParam.atk;
            this.equipmentDEFs.head = this.selectedEquipmentParam.def;
            this.equipmentDVs.head = this.selectedEquipmentParam.dv;
            this.equipmentHITs.head = this.selectedEquipmentParam.hit;
            this.equipmentCRITs.head = this.selectedEquipmentParam.crit;
            if(this.headE) {
                this.headE.visible = false;
            }
            const e = this.uiGraph.get(this.selectedEquipmentParam.eName);
            if(!e) return;
            e.visible = true;
            this.headE = e;

            this.equipingHeadParam = this.selectedEquipmentParam;
        } else if(this.selectedEquipmentParam.type === 'body') {
            this.equipmentHPs.body = this.selectedEquipmentParam.hp;
            this.equipmentFPs.body = this.selectedEquipmentParam.fp;
            this.equipmentATKs.body = this.selectedEquipmentParam.atk;
            this.equipmentDEFs.body = this.selectedEquipmentParam.def;
            this.equipmentDVs.body = this.selectedEquipmentParam.dv;
            this.equipmentHITs.body = this.selectedEquipmentParam.hit;
            this.equipmentCRITs.body = this.selectedEquipmentParam.crit;
            if(this.bodyE) {
                this.bodyE.visible = false;
            }
            const e = this.uiGraph.get(this.selectedEquipmentParam.eName);
            if(!e) return;
            e.visible = true;
            this.bodyE = e;

            this.equipingBodyParam = this.selectedEquipmentParam;
        } else if(this.selectedEquipmentParam.type === 'arm') {
            this.equipmentHPs.arm = this.selectedEquipmentParam.hp;
            this.equipmentFPs.arm = this.selectedEquipmentParam.fp;
            this.equipmentATKs.arm = this.selectedEquipmentParam.atk;
            this.equipmentDEFs.arm = this.selectedEquipmentParam.def;
            this.equipmentDVs.arm = this.selectedEquipmentParam.dv;
            this.equipmentHITs.arm = this.selectedEquipmentParam.hit;
            this.equipmentCRITs.arm = this.selectedEquipmentParam.crit;
            if(this.armE) {
                this.armE.visible = false;
            }
            const e = this.uiGraph.get(this.selectedEquipmentParam.eName);
            if(!e) return;
            e.visible = true;
            this.armE = e;

            this.equipingArmParam = this.selectedEquipmentParam;
        } else if(this.selectedEquipmentParam.type === 'foot') {
            this.equipmentHPs.foot = this.selectedEquipmentParam.hp;
            this.equipmentFPs.foot = this.selectedEquipmentParam.fp;
            this.equipmentATKs.foot = this.selectedEquipmentParam.atk;
            this.equipmentDEFs.foot = this.selectedEquipmentParam.def;
            this.equipmentDVs.foot = this.selectedEquipmentParam.dv;
            this.equipmentHITs.foot = this.selectedEquipmentParam.hit;
            this.equipmentCRITs.foot = this.selectedEquipmentParam.crit;
            if(this.footE) {
                this.footE.visible = false;
            }
            const e = this.uiGraph.get(this.selectedEquipmentParam.eName);
            if(!e) return;
            e.visible = true;
            this.footE = e;

            this.equipingFootParam = this.selectedEquipmentParam;
        }

        this.updatePlayerStatus();
        this.updateCp();
    }

    public onPageButtonTapped(pageNumber: number): void {
        if(pageNumber === 1) {
            this.itemNames2.visible = false;
            this.itemNames1.visible = true;
            
            let caption;
            if(this.language === 'japanese') {
                caption = '300HPかいふく';
            } else {
                caption = 'Recover 300HP';
            }
            this.onItemNameTapped(
                'items/potion3_04.png',
                'item_marker_1',
                caption
            );
        } else if(pageNumber === 2) {
            this.itemNames1.visible = false;
            this.itemNames2.visible = true;
            
            let caption;
            if(this.language === 'japanese') {
                caption = 'HP・FP・状態異常を完全かいふく';
            } else {
                caption = 'Completely Recover HP・FP・Health';
            }
            this.onItemNameTapped(
                'items/aphrodisiac_01.png',
                'item_marker_1',
                caption
            );
        }
    }

    public onItemNameTapped(textureName: string, markerName: string, caption: string): void {
        if(!this.messageWindowClosed) return;
        if(this.firstSelectIsDone) {
            SoundManager.playSe(Resource.Audio.Se.OptionTap);
        }

        const newTexture = PIXI.utils.TextureCache[textureName];
        const itemTexture = this.uiGraph.get('item_texture');
        const marker = this.uiGraph.get(markerName);
        const itemCaption = this.uiGraph.get('item_caption');
        
        if(!itemTexture || !marker || !itemCaption) return;

        (itemTexture as PIXI.Sprite).texture = newTexture;

        if(this.selectedMarker4) {
            this.selectedMarker4.visible = false;
        }
        marker.visible = true;
        this.selectedMarker4 = marker;

        (itemCaption as PIXI.Text).text = caption;
    }

    public onItemNumberChanged(itemName: string, numberName: string, maxNumberName: string,
                               upDown: number, itemCp: number): void {
        if(!this.messageWindowClosed) return;

        const displayNumber = this.uiGraph.get(numberName);
        const maxNumber = this.uiGraph.get(maxNumberName);
        let itemNumber = this.itemNumbers.get(itemName);
        if(!displayNumber || !maxNumber || itemNumber === undefined) return;
        if(itemNumber === 0 && upDown === -1 || itemNumber === 10 && upDown === 1) return;

        if(upDown === -1) {
            SoundManager.playSe(Resource.Audio.Se.minus);
        } else if(upDown === 1) {
            SoundManager.playSe(Resource.Audio.Se.plus);
        }
        
        this.itemNumbers.set(itemName, itemNumber += upDown);
        this.itemCp += itemCp;
        this.updateCp();
        if(itemNumber === 10) {
            displayNumber.visible = false;
            maxNumber.visible = true;
        } else {
            displayNumber.visible = true;
            maxNumber.visible = false;
        }
        (displayNumber as PIXI.Text).text = (itemNumber).toString();
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
            } else if(nodeData.type2 === 'equipment') {
                this.uiGraph.set(nodeData.id, node);
                this.equipmentPage.addChild(node);
            } else if(nodeData.type2 === 'item') {
                this.uiGraph.set(nodeData.id, node);
                this.itemPage.addChild(node);
            } else if(nodeData.type2 === 'equipment_name') {
                this.equipmentPage.addChild(node);
                this.equipmentNames.set(nodeData.id, node);
            } else if(nodeData.type2 === 'item_page_1') {
                this.itemNames1.addChild(node);
                this.uiGraph.set(nodeData.id, node);
            } else if(nodeData.type2 === 'item_page_2') {
                this.itemNames2.addChild(node);
                this.uiGraph.set(nodeData.id, node);
            } else {
                this.uiGraph.set(nodeData.id, node);
                this.uiGraphContainer.addChild(node);
            }
        }
    }

    public onBattleButtonTapped(): void {
        if(!this.messageWindowClosed || this.isOver) return;
        SoundManager.paused = false;
        SoundManager.sceneIsPaused = false;
        SoundManager.playSe(Resource.Audio.Se.OptionTap2);
        
        GameManager.loadScene(new TalkScene(this.language, this.playerStatus, this.itemNumbers));
        this.isOver = true;
    }
}