import GameManager from '../managers/GameManager';
import Scene from './Scene';
import LoaderAddParam from '../interfaces/LoaderAddParams';
import Resource from '../Resources';
import SoundManager from '../managers/SoundManager';
import Fade from './transition/Fade';
import IndexedDBManager from '../managers/IndexedDBManager';
import UiGraph from '../modules/UiGraph';
import * as UI from '../interfaces/UiGraph/index';
import * as PIXI from 'pixi.js';
import PlayerStatus from '../entity/PlayerStatus';
import GameLogic from '../modules/GameLogic';
import Delegate from '../interfaces/Delegate';
import TextEffect from '../display/single_shot/TextEffect';
import NormalAttackEffect from '../display/single_shot/NormalAttack';
import NormalBossAttackEffect from '../display/single_shot/NormalBossAttack';
import Boss from '../display/Boss';
import Gauge from '../display/gauge';
import SkillTypes from '../enum/SkillTypes';
import HpRecoverEffect from '../display/single_shot/HpRecover';
import FpRecoverEffect from '../display/single_shot/FpRecover';
import FullRecoverEffect from '../display/single_shot/FullRecover';
import CureEffect from '../display/single_shot/Cure';
import AttackUpEffect from '../display/single_shot/AttackUp';
import CriticalUpEffect from '../display/single_shot/CriticalUp';
import DvUpEffect from '../display/single_shot/DvUp';
import PlayerSkill1Effect from '../display/single_shot/PlayerSkill1';
import PlayerSkill2Effect from '../display/single_shot/PlayerSkill2';
import PlayerSkill3Effect from '../display/single_shot/PlayerSkill3';
import PlayerSkill4Effect from '../display/single_shot/PlayerSkill4';
import PlayerSkill5Effect from '../display/single_shot/PlayerSkill5';
import PlayerSkill6Effect from '../display/single_shot/PlayerSkill6';
import GuardEffect from '../display/single_shot/Guard';
import AllGuardEffect from '../display/single_shot/AllGuard';
import BossStates from '../enum/BossStates';
import BossActions from '../enum/BossActions';
import BossSkill1Effect from '../display/single_shot/BossSkill1';
import BossSkill2Effect from '../display/single_shot/BossSkill2';
import BossSkill3Effect from '../display/single_shot/BossSkill3';
import BossSpecialMoveEffect from '../display/single_shot/BossSpecialMove';
import MagicTool1Effect from '../display/single_shot/MagicTool1';
import MagicTool2Effect from '../display/single_shot/MagicTool2';
import MagicTool3Effect from '../display/single_shot/MagicTool3';
import TitleScene from './TitleScene';
import EndingTalkScene from './EndingTalkScene';

export default class BattleScene extends Scene implements Delegate {
    private language: string;
    private playerStatus: PlayerStatus;
    private itemNumbers: Map<string, number> = new Map();
    private first_select: PIXI.Container = new PIXI.Container;
    private battle_select: PIXI.Container = new PIXI.Container;
    private gameLogic: GameLogic;
    private texts: Map<string, PIXI.Text> = new Map();
    private boss!: Boss;
    private animationType: string = 'idle';
    private hpGauge!: Gauge;
    private fpGauge!: Gauge;
    private itemPage: PIXI.Container = new PIXI.Container;
    private skillPage: PIXI.Container = new PIXI.Container;
    private itemNames1: PIXI.Container = new PIXI.Container;
    private itemNames2: PIXI.Container = new PIXI.Container;
    private selectedItemMarker: PIXI.Container | null = null;
    private selectedSkillMarker: PIXI.Container | null = null;
    private selectedItemName: string = '';
    private selectedItemNumberId: string = '';
    private selectedSkillType: number = 0;
    private backToTitle: PIXI.Container = new PIXI.Container;

    constructor(playerStatu: PlayerStatus, itemNumbers: Map<string, number>, language: string) {
        super();
        this.sceneName = 'battle_scene';
        this.transitionIn = new Fade(1.0, 0.0, -0.02);
        this.transitionOut = new Fade(0.0, 1.0, 0.02);

        this.itemNumbers = itemNumbers;
        
        this.playerStatus = playerStatu;

        if(language) {
            this.language = language;
        } else {
            this.language = 'japanese';
        }

        this.gameLogic = new GameLogic(this, this.playerStatus);

        this.loadSaveDataFromDB();
    }

    protected createInitialResourceList(): (LoaderAddParam | string)[] {
        const assets = super.createInitialResourceList();
        assets.push(Resource.Static.BossTexture.Damaged);
        assets.push(Resource.Audio.Bgm.BossBgm);
        return assets.concat(
            Resource.Items,
            NormalAttackEffect.resourceList,
            NormalBossAttackEffect.resourceList,
            HpRecoverEffect.resourceList,
            FpRecoverEffect.resourceList,
            FullRecoverEffect.resourceList,
            CureEffect.resourceList,
            AttackUpEffect.resourceList,
            CriticalUpEffect.resourceList,
            DvUpEffect.resourceList,
            PlayerSkill1Effect.resourceList,
            PlayerSkill2Effect.resourceList,
            PlayerSkill3Effect.resourceList,
            PlayerSkill4Effect.resourceList,
            PlayerSkill5Effect.resourceList,
            PlayerSkill6Effect.resourceList,
            GuardEffect.resourceList,
            AllGuardEffect.resourceList,
            BossSkill1Effect.resourceList,
            BossSkill2Effect.resourceList,
            BossSkill3Effect.resourceList,
            BossSpecialMoveEffect.resourceList,
            Gauge.resourceList,
            MagicTool1Effect.resourceList,
            MagicTool2Effect.resourceList,
            MagicTool3Effect.resourceList
        );
    }

    protected loadInitialResource(onLoaded: () => void): void {
        const assets = this.createInitialResourceList();
        const name1 = Resource.UI.SceneUiGraph(this.sceneName);
        let name2;
        if(this.language === 'japanese') {
            name2 = Resource.Texts.BattleScene.Ja;
        } else {
            name2 = Resource.Texts.BattleScene.En;
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

    public update(dt: number): void {
        super.update(dt);
        this.updatePlayerDamaged();
    }

    protected onResourceLoaded(): void {
        const json1 = GameManager.game.loader.resources[Resource.UI.SceneUiGraph(this.sceneName)].data;
        let name1;
        if(this.language === 'japanese') {
            name1 = Resource.Texts.BattleScene.Ja;
        } else {
            name1 = Resource.Texts.BattleScene.En;
        }
        const json2 = GameManager.game.loader.resources[name1].data;
        this.prepareUiGraphContainer(json1);
        this.prepareUiGraphContainer(json2);

        this.uiGraphContainer.zIndex = 1;
        this.battle_select.visible = false;
        this.uiGraphContainer.addChild(this.first_select);
        this.uiGraphContainer.addChild(this.battle_select);
        this.registerUpdatingObject(this.boss);
        this.uiGraphContainer.addChild(this.boss.sprite);
        this.createGauge();
        this.initItemNumber();
        this.itemNames2.visible = false;
        this.itemPage.addChild(this.itemNames1);
        this.itemPage.addChild(this.itemNames2);
        this.itemPage.visible = false;
        this.uiGraphContainer.addChild(this.itemPage);
        this.skillPage.visible = false;
        this.uiGraphContainer.addChild(this.skillPage);
        this.backToTitle.visible = false;
        this.uiGraphContainer.addChild(this.backToTitle);
        this.addChild(this.uiGraphContainer);
        this.initSound();
        this.playBgmIfNeeded();
        this.itemAndSkillFirstSelect();
        this.spawnBossState(1);
        this.initPlayerHpFpText();
        this.initPlayerStatusText();
    }

    private initPlayerStatusText(): void {
        const cp = this.uiGraph.get('cp');
        const hp = this.uiGraph.get('hp');
        const fp = this.uiGraph.get('fp');
        const atk = this.uiGraph.get('atk');
        const def = this.uiGraph.get('def');
        const dv = this.uiGraph.get('dv');
        const hit = this.uiGraph.get('hit');
        const crit = this.uiGraph.get('crit');
        const maxHp = this.uiGraph.get('max_hp');
        const maxFp = this.uiGraph.get('max_fp');
        const maxAtk = this.uiGraph.get('max_atk');
        const maxDef = this.uiGraph.get('max_def');
        const maxDv = this.uiGraph.get('max_dv');
        const maxHit = this.uiGraph.get('max_hit');
        const maxCrit = this.uiGraph.get('max_crit');
        if(
            !cp || !hp || !fp || !atk || !def || !dv || !hit || !crit ||
            !maxHp || !maxFp || !maxAtk || !maxDef || !maxDv || !maxHit || !maxCrit
        ) {
            return
        }

        (cp as PIXI.Text).text = this.playerStatus.cp.toString();
        (hp as PIXI.Text).text = this.playerStatus.hp.toString();
        (fp as PIXI.Text).text = this.playerStatus.fp.toString();
        (atk as PIXI.Text).text = this.playerStatus.atk.toString();
        (def as PIXI.Text).text = this.playerStatus.def.toString();
        (dv as PIXI.Text).text = this.playerStatus.dv.toString();
        (hit as PIXI.Text).text = this.playerStatus.hit.toString();
        (crit as PIXI.Text).text = this.playerStatus.crit.toString();

        if(this.playerStatus.hp === 1200) {
            hp.visible = false;
            maxHp.visible = true;
        } else {
            hp.visible = true;
            maxHp.visible = false;
        }
        if(this.playerStatus.fp === 1200) {
            fp.visible = false;
            maxFp.visible = true;
        } else {
            fp.visible = true;
            maxFp.visible = false;
        }
        if(this.playerStatus.atk === 10) {
            atk.visible = false;
            maxAtk.visible = true;
        } else {
            atk.visible = true;
            maxAtk.visible = false;
        }
        if(this.playerStatus.def === 10) {
            def.visible = false;
            maxDef.visible = true;
        } else {
            def.visible = true;
            maxDef.visible = false;
        }
        if(this.playerStatus.dv === 10) {
            dv.visible = false;
            maxDv.visible = true;
        } else {
            dv.visible = true;
            maxDv.visible = false;
        }
        if(this.playerStatus.hit === 10) {
            hit.visible = false;
            maxHit.visible = true;
        } else {
            hit.visible = true;
            maxHit.visible = false;
        }
        if(this.playerStatus.crit === 10) {
            crit.visible = false;
            maxCrit.visible = true;
        } else {
            crit.visible = true;
            maxCrit.visible = false;
        }
    }

    private initPlayerHpFpText(): void {
        const hpText = this.uiGraph.get('player_hp');
        const fpText = this.uiGraph.get('player_fp');
        if(!hpText || !fpText) return;
        (hpText as PIXI.Text).text = this.playerStatus.hp.toString();
        (fpText as PIXI.Text).text = this.playerStatus.fp.toString();
    }

    private initSound(): void {
        const resources = GameManager.game.loader.resources as any;
        const soundList = [
            Resource.Audio.Se.Hit,
            Resource.Audio.Se.Guard,
            Resource.Audio.Se.AllGuard,
            Resource.Audio.Se.Cure,
            Resource.Audio.Se.StatusUp,
            Resource.Audio.Se.HpRecover,
            Resource.Audio.Se.FpRecover,
            Resource.Audio.Se.FullRecover,
            Resource.Audio.Se.NormalAttack,
            Resource.Audio.Se.PlayerSkill2,
            Resource.Audio.Se.PlayerSkill3,
            Resource.Audio.Se.PlayerSkill4,
            Resource.Audio.Se.PlayerSkill6,
            Resource.Audio.Se.BossSkill_2,
            Resource.Audio.Se.SpecialMove1,
            Resource.Audio.Se.SpecialMove2,
            Resource.Audio.Se.MagicTool1,
            Resource.Audio.Se.MagicTool2,
            Resource.Audio.Se.MagicTool3
          ];
          for(const name of soundList) {
              SoundManager.createSound(name, resources[name].buffer);
          }
    }

    private itemAndSkillFirstSelect(): void {
        let itemCapion;
        let skillCaption;
        if(this.language === 'japanese') {
            skillCaption = 'クリティカルがでやすい　FP -200';
            itemCapion = '300HPかいふく';
        } else {
            skillCaption = 'Easy to be critical　FP -200';
            itemCapion = 'Recover 300HP';
        }

        this.onItemNameTapped(
            'items/potion3_04.png',
            'item_marker_1',
            itemCapion,
            'hpPotion',
            'item_1_number',
            false
        );

        this.onSkillNameTapped(
            1,
            "skill_marker_1",
            skillCaption,
            false
        );
    }

    private initItemNumber(): void {
        const itemNumberTextIds = Object.keys(Resource.ItemNumberAndItemName);
        const itemNumberIds = Object.values(Resource.ItemNumberAndItemName);
        
        for(let i = 0; i < itemNumberIds.length; i++) {
            const itemNumberId = itemNumberIds[i];
            const itemNumberTextId = itemNumberTextIds[i];
            const itemNumberText = this.uiGraph.get(itemNumberTextId);
            const itemNumber = this.itemNumbers.get(itemNumberId);
            if(!itemNumberText || itemNumber === undefined) return;
            (itemNumberText as PIXI.Text).text = itemNumber.toString();
        }
    }

    private createGauge(): void {
        this.hpGauge = new Gauge('hp');
        this.fpGauge = new Gauge('fp');
        this.registerUpdatingObject(this.hpGauge);
        this.registerUpdatingObject(this.fpGauge);
        this.hpGauge.position.set(150, 30);
        this.fpGauge.position.set(150, 60);
        this.hpGauge.scale.set(0.8, 1.0);
        this.fpGauge.scale.set(0.8, 1.0);
        this.uiGraphContainer.addChild(this.hpGauge);
        this.uiGraphContainer.addChild(this.fpGauge);
    }

    public onBattleButtonTapped(): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.first_select.visible = false;
        this.battle_select.visible = true;
        this.backToTitle.visible = false;
    }

    public onReturnButtonTapped(): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.battle_select.visible = false;
        this.itemPage.visible = false;
        this.skillPage.visible = false;
        this.first_select.visible = true;
    }

    public onSkillReturnButtonTapped(): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.skillPage.visible = false;
        this.battle_select.visible = true;
    }

    public onItemButtonTapped(): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.first_select.visible = false;
        this.itemPage.visible = true;
        this.backToTitle.visible = false;
    }

    public onSkillButtonTapped(): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.battle_select.visible = false;
        this.skillPage.visible = true;
    }

    public onAttackButtonTapped(): void {
        const bossState = this.uiGraph.get('boss_state');
        if(!bossState) return;
        bossState.visible = false;
        this.battle_select.visible = false;
        this.spawnEffect('playerNormalAttack', () => {});
        this.gameLogic.onAttackButtonTapped();
    }

    public onGuardButtonTapped(): void {
        const bossState = this.uiGraph.get('boss_state');
        if(!bossState) return;
        bossState.visible = false;
        this.battle_select.visible = false;
        this.gameLogic.onGuardButtonTapped();
        this.spawnEffect('playerGuard', () => {
            this.gameLogic.bossTurn();
        });
    }

    public onItemUseButtonTapped(): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        const itemNumber = this.itemNumbers.get(this.selectedItemName);
        const itemNumberText = this.uiGraph.get(this.selectedItemNumberId);
        if(!itemNumber || !itemNumberText) return;
        this.itemNumbers.set(this.selectedItemName, itemNumber - 1);
        (itemNumberText as PIXI.Text).text = (itemNumber - 1).toString();

        this.itemPage.visible = false;
        const bossState = this.uiGraph.get('boss_state');
        if(!bossState) return;
        bossState.visible = false;
        this.gameLogic.onItemUsed(this.selectedItemName);
    }

    public onSkillUseButtonTapped(): void {
        const bossState = this.uiGraph.get('boss_state');
        if(!bossState) return;
        bossState.visible = false;
        this.skillPage.visible = false;
        if(this.selectedSkillType !== SkillTypes.SKILL_6) {
            this.spawnEffect(this.selectedSkillType, () => {});
        }
        this.gameLogic.onSkillUsed(this.selectedSkillType);
    }

    public onPlayerAttackMissed(): void {
        this.spawnText('MISS', 450, 280, () => {
            this.gameLogic.bossTurn();
        });
    }

    public onBossAttackMissed(bossState: number, bossAction: number, hitDown: number,
                              defenseDown: number, isUsingSkill6: boolean,
                              attackUp: number, criticalUp: number, dvUp: number): void {
        let hitDownIcon = this.uiGraph.get('hit_down');
        let defenseDownIcon = this.uiGraph.get('defense_down');
        let attackUpIcon = this.uiGraph.get('attack_up');
        let criticalUpIcon = this.uiGraph.get('critical_up');
        let dvUpIcon = this.uiGraph.get('dv_up');
        const attackEffectName = this.selectEffectName(bossAction);
        let text1: string;
        let text2: string;
        if(this.language === 'japanese') {
            text1 = '皇帝のターン！';
            text2 = '皇帝は魔具を使った！';
        } else {
            text1 = "The emperor's turn!";
            text2 = "The emperor used a magic tool!";
        }

        if(bossAction === BossActions.MAGIC_TOOL_1 || bossAction === BossActions.MAGIC_TOOL_2 ||
            bossAction === BossActions.MAGIC_TOOL_3) {   
                this.spawnText(text1, 320, 550, () => {
                    this.spawnText(text2, 320, 550, () => {
                        this.spawnEffect(attackEffectName, () => {
                            this.spawnText('MISS', 320, 550, () => {
                                if(!hitDownIcon) return;
                                if(!defenseDownIcon) return;
                                if(!attackUpIcon) return;
                                if(!criticalUpIcon) return;
                                if(!dvUpIcon) return;
                                hitDownIcon.visible = false;
                                defenseDownIcon.visible = false;
                                attackUpIcon.visible = false;
                                criticalUpIcon.visible = false;
                                dvUpIcon.visible = false;
                                if(hitDown) {
                                    hitDownIcon.visible = true;
                                }
                                if(defenseDown) {
                                    defenseDownIcon.visible = true;
                                }
                                if(attackUp) {
                                    attackUpIcon.visible = true;
                                }
                                if(criticalUp) {
                                    criticalUpIcon.visible = true;
                                }
                                if(dvUp) {
                                    dvUpIcon.visible = true;
                                } 
                                if(isUsingSkill6) {
                                    this.spawnEffect(this.selectedSkillType, () => {});
                                    this.gameLogic.onSkillUsed(this.selectedSkillType);
                                } else {
                                    this.first_select.visible = true;
                                    this.spawnBossState(bossState);
                                }
                           });
                       });
                   });
               });
        } else {
                this.spawnText(text1, 320, 550, () => {
                    this.spawnEffect(attackEffectName, () => {
                        this.spawnText('MISS', 320, 550, () => {
                            if(!hitDownIcon) return;
                            if(!defenseDownIcon) return;
                            if(!attackUpIcon) return;
                            if(!criticalUpIcon) return;
                            if(!dvUpIcon) return;
                            hitDownIcon.visible = false;
                            defenseDownIcon.visible = false;
                            attackUpIcon.visible = false;
                            criticalUpIcon.visible = false;
                            dvUpIcon.visible = false;
                            if(hitDown) {
                                hitDownIcon.visible = true;
                            }
                            if(defenseDown) {
                                defenseDownIcon.visible = true;
                            }
                            if(attackUp) {
                                attackUpIcon.visible = true;
                            }
                            if(criticalUp) {
                                criticalUpIcon.visible = true;
                            }
                            if(dvUp) {
                                dvUpIcon.visible = true;
                            }  
                            if(isUsingSkill6) {
                                this.spawnEffect(this.selectedSkillType, () => {});
                                this.gameLogic.onSkillUsed(this.selectedSkillType);
                            } else {
                                this.first_select.visible = true;
                                this.spawnBossState(bossState);
                            }
                        });
                    });
                });
        }
    }

    public onBossDamaged(damage: number, critical: boolean, bossHp: number, turn: number): void {
        this.boss.requestAnimation('damaged', () => {});
        
        let text;
        if(this.language === 'japanese') {
            text = `${damage} ダメージ！`;
        } else {
            text = `${damage} Damage!`;
        }
        if(critical) {
            this.spawnCriticalText(450, 240);
        }
        this.spawnText(text, 450, 280, () => {
            if(bossHp <= 0 && this.playerStatus.cp < 8000) {
                this.showEndingScene('win', turn, bossHp);
                return;
            }
            if(bossHp <= 0 && this.playerStatus.cp >= 8000) {
                this.showEndingScene('easyWin', turn, bossHp);
                return;
            }

            this.gameLogic.bossTurn();
        });
    }

    public onSkill6Used(): void {
        let text;
        if(this.language === 'japanese') {
            text = '剣先に精神を集中させた';
        } else {
            text = 'You focused your mind on the tip of your sword';
        }
        this.spawnText(text, 320, 550, () => {
            this.gameLogic.bossTurn();
        });
    }

    public onBossGuarded(bossState: number, hitDown: number, defenseDown: number,
                         isUsingSkill6: boolean, attackUp: number, criticalUp: number,
                         dvUp: number): void {
        let hitDownIcon = this.uiGraph.get('hit_down');
        let defenseDownIcon = this.uiGraph.get('defense_down');
        let attackUpIcon = this.uiGraph.get('attack_up');
        let criticalUpIcon = this.uiGraph.get('critical_up');
        let dvUpIcon = this.uiGraph.get('dv_up');
        let text;
        if(this.language === 'japanese') {
            text = '皇帝のターン！';
        } else {
            text = "The emperor's turn!";
        }
        this.spawnText(text, 320, 550, () => {
            let text;
            if(this.language === 'japanese') {
                text = `皇帝はガードしている！`;
            } else {
                text = `The emperor is guarding!`;
            }
            this.spawnText(text, 320, 550, () => {
                if(!hitDownIcon) return;
                if(!defenseDownIcon) return;
                if(!attackUpIcon) return;
                if(!criticalUpIcon) return;
                if(!dvUpIcon) return;
                hitDownIcon.visible = false;
                defenseDownIcon.visible = false;
                attackUpIcon.visible = false;
                criticalUpIcon.visible = false;
                dvUpIcon.visible = false;
                if(hitDown) {
                    hitDownIcon.visible = true;
                }
                if(defenseDown) {
                    defenseDownIcon.visible = true;
                }
                if(attackUp) {
                    attackUpIcon.visible = true;
                }
                if(criticalUp) {
                    criticalUpIcon.visible = true;
                }
                if(dvUp) {
                    dvUpIcon.visible = true;
                } 
                if(isUsingSkill6) {
                    this.spawnEffect(this.selectedSkillType, () => {});
                    this.gameLogic.onSkillUsed(this.selectedSkillType);
                } else {
                    this.first_select.visible = true;
                    this.spawnBossState(bossState);
                }
            });
        });
    }

    public onBossAvoided(bossState: number, hitDown: number, defenseDown: number,
                         isUsingSkill6: boolean, attackUp: number, criticalUp: number,
                         dvUp: number): void {
        let hitDownIcon = this.uiGraph.get('hit_down');
        let defenseDownIcon = this.uiGraph.get('defense_down');
        let attackUpIcon = this.uiGraph.get('attack_up');
        let criticalUpIcon = this.uiGraph.get('critical_up');
        let dvUpIcon = this.uiGraph.get('dv_up');
        let text;
        if(this.language === 'japanese') {
            text = '皇帝のターン！';
        } else {
            text = "The emperor's turn!";
        }
        this.spawnText(text, 320, 550, () => {
            let text;
            if(this.language === 'japanese') {
                text = `皇帝は回避行動をしている！`;
            } else {
                text = `The emperor is doing avoidance behavior!`;
            }
            this.spawnText(text, 320, 550, () => {
                if(!hitDownIcon) return;
                if(!defenseDownIcon) return;
                if(!attackUpIcon) return;
                if(!criticalUpIcon) return;
                if(!dvUpIcon) return;
                hitDownIcon.visible = false;
                defenseDownIcon.visible = false;
                attackUpIcon.visible = false;
                criticalUpIcon.visible = false;
                dvUpIcon.visible = false;
                if(hitDown) {
                    hitDownIcon.visible = true;
                }
                if(defenseDown) {
                    defenseDownIcon.visible = true;
                }
                if(attackUp) {
                    attackUpIcon.visible = true;
                }
                if(criticalUp) {
                    criticalUpIcon.visible = true;
                }
                if(dvUp) {
                    dvUpIcon.visible = true;
                }  
                if(isUsingSkill6) {
                    this.spawnEffect(this.selectedSkillType, () => {});
                    this.gameLogic.onSkillUsed(this.selectedSkillType);
                } else {
                    this.first_select.visible = true;
                    this.spawnBossState(bossState);
                }
            });
        });
    }

    public onBossFlinched(bossState: number, hitDown: number, defenseDown: number,
                          isUsingSkill6: boolean, attackUp: number, criticalUp: number,
                          dvUp: number): void {
        let hitDownIcon = this.uiGraph.get('hit_down');
        let defenseDownIcon = this.uiGraph.get('defense_down');
        let attackUpIcon = this.uiGraph.get('attack_up');
        let criticalUpIcon = this.uiGraph.get('critical_up');
        let dvUpIcon = this.uiGraph.get('dv_up');
        let text;
        if(this.language === 'japanese') {
            text = '皇帝のターン！';
        } else {
            text = "The emperor's turn!";
        }
        this.spawnText(text, 320, 550, () => {
            let text;
            if(this.language === 'japanese') {
                text = `皇帝は怯んでいる！`;
            } else {
                text = `The emperor is Flinching!`;
            }
            this.spawnText(text, 320, 550, () => {
                if(!hitDownIcon) return;
                if(!defenseDownIcon) return;
                if(!attackUpIcon) return;
                if(!criticalUpIcon) return;
                if(!dvUpIcon) return;
                hitDownIcon.visible = false;
                defenseDownIcon.visible = false;
                attackUpIcon.visible = false;
                criticalUpIcon.visible = false;
                dvUpIcon.visible = false;
                if(hitDown) {
                    hitDownIcon.visible = true;
                }
                if(defenseDown) {
                    defenseDownIcon.visible = true;
                }
                if(attackUp) {
                    attackUpIcon.visible = true;
                }
                if(criticalUp) {
                    criticalUpIcon.visible = true;
                }
                if(dvUp) {
                    dvUpIcon.visible = true;
                }  
                if(isUsingSkill6) {
                    this.spawnEffect(this.selectedSkillType, () => {});
                    this.gameLogic.onSkillUsed(this.selectedSkillType);
                } else {
                    this.first_select.visible = true;
                    this.spawnBossState(bossState);
                }
            });
        });
    }

    public onPlayerDamaged(damage: number, fromPercent: number, toPercent: number,bossState: number,
                           bossAction: number, hitDown: number, defenseDown: number, critical: boolean, isUsingSkill6: boolean,
                           attackUp: number, criticalUp: number, dvUp: number, turn: number,
                           bossHp: number): void {
        let hitDownIcon = this.uiGraph.get('hit_down');
        let defenseDownIcon = this.uiGraph.get('defense_down');
        let attackUpIcon = this.uiGraph.get('attack_up');
        let criticalUpIcon = this.uiGraph.get('critical_up');
        let dvUpIcon = this.uiGraph.get('dv_up');

        const attackEffectName = this.selectEffectName(bossAction);
        let text1: string;
        let text2: string;
        let text3: string;
        let text4: string;
        if(this.language === 'japanese') {
            text1 = '皇帝のターン！';
            text2 = '皇帝は魔具を使った！';
            text3 = '命中率ダウン！'
            text4 = '防御力ダウン！'
        } else {
            text1 = "The emperor's turn!";
            text2 = "The emperor used a magic tool!";
            text3 = 'Hit rate down!'
            text4 = 'Defense down！'
        }

        if(bossAction === BossActions.MAGIC_TOOL_1 || bossAction === BossActions.MAGIC_TOOL_2) {
            let statusDownText = bossAction === BossActions.MAGIC_TOOL_1 ? text3 : text4;
            this.spawnText(text1, 320, 550, () => {
                this.spawnText(text2, 320, 550, () => {
                    this.elapsedFrameCount = 0;
                    this.animationType = 'damaged';
                        
                    this.spawnEffect(attackEffectName, () => {
                        let text;
                        if(this.language === 'japanese') {
                            text = `${damage} ダメージ！`;
                        } else {
                            text = `${damage} Damage!`;
                        }
                        if(!hitDownIcon) return;
                        if(!defenseDownIcon) return;
                        if(!attackUpIcon) return;
                        if(!criticalUpIcon) return;
                        if(!dvUpIcon) return;
                        hitDownIcon.visible = false;
                        defenseDownIcon.visible = false;
                        attackUpIcon.visible = false;
                        criticalUpIcon.visible = false;
                        dvUpIcon.visible = false;
                        if(hitDown) {
                            hitDownIcon.visible = true;
                        }
                        if(defenseDown) {
                            defenseDownIcon.visible = true;
                        } 
                        if(attackUp) {
                            attackUpIcon.visible = true;
                        }
                        if(criticalUp) {
                            criticalUpIcon.visible = true;
                        }
                        if(dvUp) {
                            dvUpIcon.visible = true;
                        } 
                        this.spawnText(text, 320, 550, () => {
                            if(toPercent === 0) {
                                this.showEndingScene('lose', turn, bossHp);
                                return;
                            }

                            this.spawnText(statusDownText, 320, 550, () => {
                                if(isUsingSkill6) {
                                    this.spawnEffect(this.selectedSkillType, () => {});
                                    this.gameLogic.onSkillUsed(this.selectedSkillType);
                                } else {
                                    this.first_select.visible = true;
                                    this.spawnBossState(bossState);
                                }
                            });
                        });
                    });
                
                    this.hpGauge.scaleGauge(fromPercent, toPercent);
                });
            });
        } else if(bossAction === BossActions.MAGIC_TOOL_3) {
            this.spawnText(text1, 320, 550, () => {
                this.spawnText(text2, 320, 550, () => {
                    this.elapsedFrameCount = 0;
                    this.animationType = 'damaged';
                        
                    this.spawnEffect(attackEffectName, () => {
                        let text;
                        if(this.language === 'japanese') {
                            text = `${damage} ダメージ！`;
                        } else {
                            text = `${damage} Damage!`;
                        }
                        this.spawnText(text, 320, 550, () => {
                            if(toPercent === 0) {
                                this.showEndingScene('lose', turn, bossHp);
                                return;
                            }

                            if(!hitDownIcon) return;
                            if(!defenseDownIcon) return;
                            if(!attackUpIcon) return;
                            if(!criticalUpIcon) return;
                            if(!dvUpIcon) return;
                            hitDownIcon.visible = false;
                            defenseDownIcon.visible = false;
                            attackUpIcon.visible = false;
                            criticalUpIcon.visible = false;
                            dvUpIcon.visible = false;
                            if(hitDown) {
                                hitDownIcon.visible = true;
                            }
                            if(defenseDown) {
                                defenseDownIcon.visible = true;
                            }
                            if(attackUp) {
                                attackUpIcon.visible = true;
                            }
                            if(criticalUp) {
                                criticalUpIcon.visible = true;
                            }
                            if(dvUp) {
                                dvUpIcon.visible = true;
                            }  
                            if(isUsingSkill6) {
                                this.spawnEffect(this.selectedSkillType, () => {});
                                this.gameLogic.onSkillUsed(this.selectedSkillType);
                            } else {
                                this.first_select.visible = true;
                                this.spawnBossState(bossState);
                            }
                        });
                    });
                
                    this.hpGauge.scaleGauge(fromPercent, toPercent);
                });
            });
        } else {
            this.spawnText(text1, 320, 550, () => {
                this.elapsedFrameCount = 0;
                this.animationType = 'damaged';
                
                this.spawnEffect(attackEffectName, () => {
                    let text;
                    if(critical) {
                        this.spawnCriticalText(320, 510);
                    }
                    if(this.language === 'japanese') {
                        text = `${damage} ダメージ！`;
                    } else {
                        text = `${damage} Damage!`;
                    }
                    this.spawnText(text, 320, 550, () => {
                        if(toPercent === 0) {
                            this.showEndingScene('lose', turn, bossHp);
                            return;
                        }

                        if(!hitDownIcon) return;
                        if(!defenseDownIcon) return;
                        if(!attackUpIcon) return;
                        if(!criticalUpIcon) return;
                        if(!dvUpIcon) return;
                        hitDownIcon.visible = false;
                        defenseDownIcon.visible = false;
                        attackUpIcon.visible = false;
                        criticalUpIcon.visible = false;
                        dvUpIcon.visible = false;
                        if(hitDown) {
                            hitDownIcon.visible = true;
                        }
                        if(defenseDown) {
                            defenseDownIcon.visible = true;
                        }
                        if(attackUp) {
                            attackUpIcon.visible = true;
                        }
                        if(criticalUp) {
                            criticalUpIcon.visible = true;
                        }
                        if(dvUp) {
                            dvUpIcon.visible = true;
                        }  
                        if(isUsingSkill6) {
                            this.spawnEffect(this.selectedSkillType, () => {});
                            this.gameLogic.onSkillUsed(this.selectedSkillType);
                        } else {
                            this.first_select.visible = true;
                            this.spawnBossState(bossState);
                        }
                    });
                });
                
                this.hpGauge.scaleGauge(fromPercent, toPercent);
            });
        }
    }

    public onPlayerHpRecovered(amount: number, fromPercent: number, toPercent: number): void {
        this.spawnEffect('playerHpRecovered', () => {
            let text;
            if(this.language === 'japanese') {
                text = `HP ${amount} 回復！`;
            } else {
                text = `HP ${amount} Recovered!`;
            }
            this.spawnText(text, 320, 550, () => {
                this.gameLogic.bossTurn();
            });
        });
            
        this.hpGauge.scaleGauge(fromPercent, toPercent);
    }

    public onPlayerFpRecovered(amount: number, fromPercent: number, toPercent: number): void {
        this.spawnEffect('playerFpRecovered', () => {
            let text;
            if(this.language === 'japanese') {
                text = `FP ${amount} 回復！`;
            } else {
                text = `FP ${amount} Recovered!`;
            }
            this.spawnText(text, 320, 550, () => {
                this.gameLogic.bossTurn();
            });
        });
            
        this.fpGauge.scaleGauge(fromPercent, toPercent);
    }

    public onPlayerFullRecovered(fromHpPercent: number, toHpPercent: number, fromFpPercent: number,
                                 toFpPercent: number): void {
        let hitDownIcon = this.uiGraph.get('hit_down');
        let defenseDownIcon = this.uiGraph.get('defense_down');
        if(!hitDownIcon || !defenseDownIcon) return;
        hitDownIcon.visible = false;
        defenseDownIcon.visible = false;
        
        this.spawnEffect('playerFullRecovered', () => {
            let text;
            if(this.language === 'japanese') {
                text = `完全回復した！`;
            } else {
                text = `Perfectly recovered!`;
            }
            this.spawnText(text, 320, 550, () => {
                this.gameLogic.bossTurn();
            });
        });
            
        this.hpGauge.scaleGauge(fromHpPercent, toHpPercent);
        this.fpGauge.scaleGauge(fromFpPercent, toFpPercent);
    }

    public onPlayerCured(): void {
        let hitDownIcon = this.uiGraph.get('hit_down');
        let defenseDownIcon = this.uiGraph.get('defense_down');
        if(!hitDownIcon || !defenseDownIcon) return;
        hitDownIcon.visible = false;
        defenseDownIcon.visible = false;
        
        this.spawnEffect('playerCured', () => {
            let text;
            if(this.language === 'japanese') {
                text = `状態異常回復！`;
            } else {
                text = `Bad status cured!`;
            }
            this.spawnText(text, 320, 550, () => {
                this.gameLogic.bossTurn();
            });
        });
    }

    public onPlayerAttackUpped(): void {
        let attackUpIcon = this.uiGraph.get('attack_up');
        if(!attackUpIcon) return;
        attackUpIcon.visible = true;
        
        this.spawnEffect('playerAttackUp', () => {
            let text;
            if(this.language === 'japanese') {
                text = `攻撃力アップ！`;
            } else {
                text = `Attack up!`;
            }
            this.spawnText(text, 320, 550, () => {
                this.gameLogic.bossTurn();
            });
        });
    }

    public onPlayerCriticalUpped(): void {
        let criticalUpIcon = this.uiGraph.get('critical_up');
        if(!criticalUpIcon) return;
        criticalUpIcon.visible = true;
        
        this.spawnEffect('playerCriticalUp', () => {
            let text;
            if(this.language === 'japanese') {
                text = `クリティカルアップ！`;
            } else {
                text = `Critical up!`;
            }
            this.spawnText(text, 320, 550, () => {
                this.gameLogic.bossTurn();
            });
        });
    }

    public onPlayerDvUpped(): void {
        let dvUpIcon = this.uiGraph.get('dv_up');
        if(!dvUpIcon) return;
        dvUpIcon.visible = true;
        
        this.spawnEffect('playerDvUp', () => {
            let text;
            if(this.language === 'japanese') {
                text = `回避率アップ！`;
            } else {
                text = `Evasion rate up!`;
            }
            this.spawnText(text, 320, 550, () => {
                this.gameLogic.bossTurn();
            });
        });
    }

    public onAronBetaUsed(): void {
        this.spawnEffect('playerAllGuard', () => {
            this.gameLogic.bossTurn();  
        });
    }

    public onPlayerFpDecreased(fromPercent: number, toPercent: number): void {
        this.fpGauge.scaleGauge(fromPercent, toPercent);
    }

    private spawnEffect(effectType: string | number, onEffectEnded: () => void): void {
        let effect;
        
        switch(effectType) {
            case 'playerNormalAttack': {
                effect = new NormalAttackEffect(onEffectEnded);
                effect.position.set(320, 280);
                effect.scale.set(3.0, 3.0);
                break;
            }
            case 'bossNormalAttack': {
                effect = new NormalBossAttackEffect(onEffectEnded)
                effect.position.set(320, 450);
                effect.scale.set(2.0, 2.0);
                break;
            }
            case 'bossSkill1': {
                effect = new BossSkill1Effect(onEffectEnded)
                effect.position.set(320, 400);
                effect.scale.set(1.2, 1.2);
                break;
            }
            case 'bossSkill2': {
                effect = new BossSkill2Effect(onEffectEnded)
                effect.position.set(320, 400);
                effect.scale.set(1.2, 1.2);
                break;
            }
            case 'bossSkill3': {
                effect = new BossSkill3Effect(onEffectEnded)
                effect.position.set(320, 320);
                effect.scale.set(1.0, 1.4);
                break;
            }
            case 'bossSpecialMove': {
                effect = new BossSpecialMoveEffect(onEffectEnded)
                effect.position.set(320, 320);
                effect.scale.set(1.0, 1.4);
                break;
            }
            case 'magicTool1': {
                effect = new MagicTool1Effect(onEffectEnded)
                effect.position.set(320, 450);
                effect.scale.set(1.0, 1.0);
                break;
            }
            case 'magicTool2': {
                effect = new MagicTool2Effect(onEffectEnded)
                effect.position.set(320, 450);
                effect.scale.set(1.0, 1.0);
                break;
            }
            case 'magicTool3': {
                effect = new MagicTool3Effect(onEffectEnded)
                effect.position.set(320, 320);
                effect.scale.set(1.0, 1.4);
                break;
            }
            case 'playerHpRecovered': {
                effect = new HpRecoverEffect(onEffectEnded)
                effect.position.set(320, 500);
                effect.scale.set(2.0, 2.0);
                break;
            }
            case 'playerFpRecovered': {
                effect = new FpRecoverEffect(onEffectEnded)
                effect.position.set(320, 500);
                effect.scale.set(2.0, 2.0);
                break;
            }
            case 'playerFullRecovered': {
                effect = new FullRecoverEffect(onEffectEnded)
                effect.position.set(320, 500);
                effect.scale.set(2.0, 2.0);
                break;
            }
            case 'playerCured': {
                effect = new CureEffect(onEffectEnded)
                effect.position.set(320, 500);
                effect.scale.set(2.0, 2.0);
                break;
            }
            case 'playerAttackUp': {
                effect = new AttackUpEffect(onEffectEnded)
                effect.position.set(320, 500);
                effect.scale.set(1.2, 1.1);
                break;
            }
            case 'playerCriticalUp': {
                effect = new CriticalUpEffect(onEffectEnded)
                effect.position.set(320, 500);
                effect.scale.set(1.2, 1.1);
                break;
            }
            case 'playerDvUp': {
                effect = new DvUpEffect(onEffectEnded)
                effect.position.set(320, 500);
                effect.scale.set(1.2, 1.1);
                break;
            }
            case 'playerGuard': {
                effect = new GuardEffect(onEffectEnded)
                effect.position.set(320, 500);
                effect.scale.set(1.2, 1.2);
                break;
            }
            case 'playerAllGuard': {
                effect = new AllGuardEffect(onEffectEnded)
                effect.position.set(320, 500);
                effect.scale.set(1.5, 1.5);
                break;
            }
            case SkillTypes.SKILL_1: {
                effect = new PlayerSkill1Effect(onEffectEnded)
                effect.position.set(320, 280);
                effect.scale.set(1.0, 1.0);
                break;
            }
            case SkillTypes.SKILL_2: {
                effect = new PlayerSkill2Effect(onEffectEnded)
                effect.position.set(320, 320);
                effect.scale.set(1.0, 1.0);
                break;
            }
            case SkillTypes.SKILL_3: {
                effect = new PlayerSkill3Effect(onEffectEnded)
                effect.position.set(320, 320);
                effect.scale.set(1.0, 1.4);
                break;
            }
            case SkillTypes.SKILL_4: {
                effect = new PlayerSkill4Effect(onEffectEnded)
                effect.position.set(320, 280);
                effect.scale.set(1.5, 1.5);
                break;
            }
            case SkillTypes.SKILL_5: {
                effect = new PlayerSkill5Effect(onEffectEnded)
                effect.position.set(320, 280);
                effect.scale.set(2.0, 2.0);
                break;
            }
            case SkillTypes.SKILL_6: {
                effect = new PlayerSkill6Effect(onEffectEnded)
                effect.position.set(320, 280);
                effect.scale.set(1.5, 1.5);
                break;
            }
            default: effect = new NormalAttackEffect(onEffectEnded); break;
        }
        
        this.uiGraphContainer.addChild(effect);
        this.registerUpdatingObject(effect);
    }

    private spawnText(text: string, x: number, y: number, onEnded: () => void): void {
        const pixiText = this.texts.get('battle_scene_text');
        if(!pixiText) return;
        pixiText.text = text;
        const textEffect = new TextEffect(pixiText, onEnded);
        textEffect.position.set(x, y);
        this.uiGraphContainer.addChild(textEffect);
        this.registerUpdatingObject(textEffect);
    }

    private spawnCriticalText(x: number, y: number): void {
        const pixiText = this.texts.get('critical_text');
        if(!pixiText) return;
        const textEffect = new TextEffect(pixiText, () => {});
        textEffect.position.set(x, y);
        this.uiGraphContainer.addChild(textEffect);
        this.registerUpdatingObject(textEffect);
    }

    private spawnBossState(state: number): void {
        const stateText = this.uiGraph.get('boss_state');
        if(!stateText) return;
        let text;

        if(state === BossStates.SWORD_VERTICAL) {
            if(this.language === 'japanese') {
                text = '皇帝は剣を垂直に構えている';
            } else {
                text = 'The emperor holds the sword vertically';
            }
        } else if(state === BossStates.SWORD_HORIZON) {
            if(this.language === 'japanese') {
                text = '皇帝は剣を水平に構えている';
            } else {
                text = 'The emperor holds the sword horizontally';
            }
        } else if(state === BossStates.SWORD_UP) {
            if(this.language === 'japanese') {
                text = '皇帝は剣を高く上げている';
            } else {
                text = 'The emperor is raising the sword high';
            }
        } else if(state === BossStates.SWORD_CROSS) {
            if(this.language === 'japanese') {
                text = '皇帝は剣を交差させている';
            } else {
                text = 'The emperor is crossing the swords';
            }
        } else if(state === BossStates.SWORD_DOWN) {
            if(this.language === 'japanese') {
                text = '皇帝は剣を下に下げている';
            } else {
                text = 'The emperor is lowering the sword';
            }
        } else if(state === BossStates.LOW_POSTURE) {
            if(this.language === 'japanese') {
                text = '皇帝は体勢を低くしている';
            } else {
                text = 'The emperor is in a low position';
            }
        } else if(state === BossStates.RIGHT_FOOT_FORWARD) {
            if(this.language === 'japanese') {
                text = '皇帝は右足を前に出している';
            } else {
                text = 'The emperor has his right foot forward';
            }
        } else if(state === BossStates.LEFT_FOOT_FORWARD) {
            if(this.language === 'japanese') {
                text = '皇帝は左足を前に出している';
            } else {
                text = 'The emperor has his left foot forward';
            }
        } else if(state === BossStates.RIGHT_HAND_FORWARD) {
            if(this.language === 'japanese') {
                text = '皇帝は右手を突き出している';
            } else {
                text = 'The emperor sticks out his right hand';
            }
        } else if(state === BossStates.LEFT_HAND_FORWARD) {
            if(this.language === 'japanese') {
                text = '皇帝は左手を突き出している';
            } else {
                text = 'The emperor sticks out his left hand';
            }
        } else {
            text = '';
        }

        (stateText as PIXI.Text).text = text;
        stateText.visible = true;
    }

    public onEscapeButtonTapped(): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.backToTitle.visible = !this.backToTitle.visible;
    }

    public onSkillNameTapped(skillType: number, markerName: string, caption: string,
                             soundOn: boolean = true): void {
        if(soundOn) {
            SoundManager.playSe(Resource.Audio.Se.OptionTap);
        }                         
        this.selectedSkillType = skillType;
        const marker = this.uiGraph.get(markerName);
        const skillCaption = this.uiGraph.get('skill_caption');
        if(!marker || !skillCaption) return;

        if(this.selectedSkillMarker) {
            this.selectedSkillMarker.visible = false;
        }
        marker.visible = true;
        this.selectedSkillMarker = marker;
        (skillCaption as PIXI.Text).text = caption;
    }

    public onItemNameTapped(textureName: string, markerName: string, caption: string,
                            itemName: string, itemNumberId: string, soundOn: boolean = true): void {
        if(soundOn) {
            SoundManager.playSe(Resource.Audio.Se.OptionTap);
        }
        const newTexture = PIXI.utils.TextureCache[textureName];
        const itemTexture = this.uiGraph.get('item_texture');
        const marker = this.uiGraph.get(markerName);
        const itemCaption = this.uiGraph.get('item_caption');
        
        if(!itemTexture || !marker || !itemCaption) return;

        (itemTexture as PIXI.Sprite).texture = newTexture;

        if(this.selectedItemMarker) {
            this.selectedItemMarker.visible = false;
        }
        marker.visible = true;
        this.selectedItemMarker = marker;

        (itemCaption as PIXI.Text).text = caption;

        this.selectedItemName = itemName;
        this.selectedItemNumberId = itemNumberId;
    }

    public onPageButtonTapped(pageNumber: number): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
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
                caption,
                'hpPotion',
                'item_1_number',
                false
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
                "items/aphrodisiac_01.png",
                "item_marker_1",
                caption,
                "nectar",
                "item_7_number",
                false
            );
        }
    }
    
    protected prepareUiGraphContainer(uiData: UI.Graph): void {
        for(const nodeData of uiData.nodes) {
            const factory = UiGraph.getFactory(nodeData.type) || this.getCustomUiGraphFactory(nodeData.type);
            if(!factory) continue;

            const node = factory.createUiNodeByGraphElement(nodeData);
            if(!node) continue;

            if(nodeData.events) factory.attachUiEventByGraphElement(nodeData.events, node, this);
            
            if(nodeData.type2 === 'first_select') {
                this.uiGraph.set(nodeData.id, node);
                this.first_select.addChild(node);
            } else if(nodeData.type2 === 'battle_select') {
                this.uiGraph.set(nodeData.id, node);
                this.battle_select.addChild(node);
            } else if(nodeData.type === 'message') {
                this.texts.set(nodeData.id, (node as PIXI.Text));
            } else if(nodeData.type2 === 'boss') {
                this.boss = new Boss(node as PIXI.Sprite);
            } else if(nodeData.type2 === 'item') {
                this.uiGraph.set(nodeData.id, node);
                this.itemPage.addChild(node);
            } else if(nodeData.type2 === 'item_page_1') {
                this.uiGraph.set(nodeData.id, node);
                this.itemNames1.addChild(node);
            } else if(nodeData.type2 === 'item_page_2') {
                this.uiGraph.set(nodeData.id, node);
                this.itemNames2.addChild(node);
            } else if(nodeData.type2 === 'skill') {
                this.uiGraph.set(nodeData.id, node);
                this.skillPage.addChild(node);
            } else if(nodeData.type2 === 'back_to_title') {
                this.uiGraph.set(nodeData.id, node);
                this.backToTitle.addChild(node);
            }  else {
                this.uiGraph.set(nodeData.id, node);
                this.uiGraphContainer.addChild(node);
            }
        }
    }

    private selectEffectName(bossAction: number): string {
        if(bossAction === BossActions.NORMAL_ATTACK) {
            return 'bossNormalAttack';
        } else if(bossAction === BossActions.SKILL_1) {
            return 'bossSkill1';
        } else if(bossAction === BossActions.SKILL_2) {
            return 'bossSkill2';
        } else if(bossAction === BossActions.SKILL_3) {
            return 'bossSkill3';
        } else if(bossAction === BossActions.SPECIAL_MOVE) {
            return 'bossSpecialMove';
        } else if(bossAction === BossActions.MAGIC_TOOL_1) {
            return 'magicTool1';
        } else if(bossAction === BossActions.MAGIC_TOOL_2) {
            return 'magicTool2';
        } else if(bossAction === BossActions.MAGIC_TOOL_3) {
            return 'magicTool3';
        } else {
            return '';
        }
    }

    private updatePlayerDamaged(): void {
        if(this.animationType === 'idle') return;
        
        if(this.animationType === 'damaged') {
            if(this.elapsedFrameCount === 8) {
                this.animationType = 'idle';
                this.uiGraphContainer.position.x = 0;
                return;
            }

            if(this.elapsedFrameCount  === 0) {
                this.uiGraphContainer.position.x = this.uiGraphContainer.position.x + 10;
            } else if(this.elapsedFrameCount % 2 === 0) {
                let direction;
                if(this.uiGraphContainer.position.x > 0) {
                    direction = -1;
                } else {
                    direction = 1;
                }
                this.uiGraphContainer.position.x = this.uiGraphContainer.position.x + 20 * direction;
            }
        }
    }

    private playBgmIfNeeded(): void {
        const bgmTitleName = Resource.Audio.Bgm.BossBgm;
        if(!SoundManager.hasSound(bgmTitleName)) {
            const resource = GameManager.game.loader.resources[bgmTitleName] as any;
            SoundManager.createSound(bgmTitleName, resource.buffer);
            SoundManager.playBgm(bgmTitleName, 3);
            if(SoundManager.bgmVolume !== 0) {
                SoundManager.setSoundVolume(Resource.Audio.Bgm.BossBgm, 0.005);
                this.fadeInBgm();
            } 
        }
    }

    private fadeInBgm(): void {
        const bgm = SoundManager.getSound(Resource.Audio.Bgm.BossBgm);
        if(bgm) SoundManager.fade(bgm, SoundManager.bgmVolume * 3, 1.5);
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

    public onBossHpChanged(hp: number): void {
        const bossHp = this.uiGraph.get('boss_hp');
        if(!bossHp) return;
        (bossHp as PIXI.Text).text = hp.toString();
    }

    public onPlayerHpChanged(hp: number): void {
        const playerHp = this.uiGraph.get('player_hp');
        if(!playerHp) return;
        (playerHp as PIXI.Text).text = hp.toString();
    }

    public onPlayerFpChanged(fp: number): void {
        const playerFp = this.uiGraph.get('player_fp');
        if(!playerFp) return;
        (playerFp as PIXI.Text).text = fp.toString();
    }

    public onTurnAdded(turnNumber: number): void {
        const turn = this.uiGraph.get('turn');
        if(!turn) return;
        (turn as PIXI.Text).text = turnNumber.toString();
    }

    public showEndingScene(endingType: string, turn: number, bossHp: number): void {
        if(this.isOver) return;
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        SoundManager.destroySound(Resource.Audio.Bgm.BossBgm);
        this.isOver = true;
        GameManager.loadScene(new EndingTalkScene(this.language, this.playerStatus, endingType, turn,
                                                  bossHp));
    }

    public showTitleScene(): void {  
        if(this.isOver) return;  
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        this.isOver = true;
        SoundManager.destroySound(Resource.Audio.Bgm.BossBgm);
        SoundManager.playSe(Resource.Audio.Se.OptionTap2);
        GameManager.loadScene(new TitleScene());
    }
}