import Delegate from '../interfaces/Delegate';
import PlayerStatus from '../entity/PlayerStatus';
import BossStatus from '../entity/BossStatus';
import ItemNames from '../enum/ItemNames';
import SkillTypes from '../enum/SkillTypes';
import PlayerStates from '../enum/PlayerStates';
import BossActions from '../enum/BossActions';
import BossStates from '../enum/BossStates';

export default class GameLogic {
    private delegator: Delegate;
    private playerStatus: PlayerStatus;
    private bossStatus: BossStatus = new BossStatus;
    private maxPlayerHp: number;
    private maxPlayerFp: number;
    private bossAction: number = 1;
    private bossState: number = 1;
    private playerHitDown: number = 0;
    private playerDefenseDown: number = 0;
    private playerAttackUp: number = 0;
    private playerCriticalUp: number = 0;
    private playerDvUp: number = 0;
    private playerDamageCut: number = 0;
    private playerDamageAdd: number = 0;
    private bossFlinched: boolean = false;
    private isUsingSkill6: boolean = false;
    private isUsingAronBeta: boolean = false;
    private turn: number = 1;

    constructor(delegator: Delegate, playerStatus: PlayerStatus) {
        this.delegator = delegator;
        this.playerStatus = playerStatus;
        this.maxPlayerHp = playerStatus.hp;
        this.maxPlayerFp = playerStatus.fp;

        this.setPlayerDamageRate();
    }

    public onAttackButtonTapped(): void {
        let damage = this.calcuBossDamage();
        if(this.bossAction === BossActions.GUARD) {
            damage = Math.round(damage / 2);
        }
        let critical = this.playerAttackCritical(0);
        if(critical) {
            damage = Math.round(damage * 1.5);
        }
        const playerAttackHitted = this.playerAttackHitted(0);
        if(!playerAttackHitted) {
            this.delegator.onPlayerAttackMissed();
        } else {
            this.bossStatus.hp -= damage;
            this.delegator.onBossHpChanged(this.bossStatus.hp);
            this.delegator.onBossDamaged(damage, critical, this.bossStatus.hp, this.turn);
        }
    }

    public onGuardButtonTapped(): void {
        this.playerStatus.state = PlayerStates.GUARD;
    }

    public bossTurn(): void {
        this.turn += 1;
        this.delegator.onTurnAdded(this.turn);

        if(this.playerHitDown !== 0) {
            this.playerHitDown -= 1;
        }
        let playerDefenseDown = false;
        if(this.playerDefenseDown !== 0) {
            this.playerDefenseDown -= 1;
            playerDefenseDown = true;
        }
        if(this.playerAttackUp !== 0) {
            this.playerAttackUp -= 1;
        }
        if(this.playerCriticalUp !== 0) {
            this.playerCriticalUp -=1;
        }
        let playerDivUp = false;
        if(this.playerDvUp !== 0) {
            this.playerDvUp -= 1;
            playerDivUp = true;
        }

        if(this.bossAction === BossActions.GUARD) {
            this.bossFlinched = false;
            this.isUsingAronBeta = false;

            this.playerStatus.state = PlayerStates.IDLE;

            this.decideBossState();
            this.decideBossAction();
            this.delegator.onBossGuarded(this.bossState, this.playerHitDown, this.playerDefenseDown,
                                         this.isUsingSkill6, this.playerAttackUp, this.playerCriticalUp,
                                         this.playerDvUp);
            return;
        }
        if(this.bossAction === BossActions.AVOID) {
            this.isUsingAronBeta = false;

            this.playerStatus.state = PlayerStates.IDLE;

            this.decideBossState();
            this.decideBossAction();
            this.delegator.onBossAvoided(this.bossState, this.playerHitDown, this.playerDefenseDown,
                                         this.isUsingSkill6, this.playerAttackUp, this.playerCriticalUp,
                                         this.playerDvUp);
            return;
        }
        if(this.bossFlinched === true) {
            this.isUsingAronBeta = false;
            this.bossFlinched = false;

            this.decideBossState();
            this.decideBossAction();
            this.delegator.onBossFlinched(this.bossState, this.playerHitDown, this.playerDefenseDown,
                                          this.isUsingSkill6, this.playerAttackUp, this.playerCriticalUp,
                                          this.playerDvUp);
            return;
        }

        let damage = this.calcuPlayerDamage();

        this.isUsingAronBeta = false;

        if(this.playerStatus.state === PlayerStates.GUARD) {
            damage = Math.round(damage / 2);
            this.playerStatus.state = PlayerStates.IDLE;
        }

        let critical = this.bossAttackCritical(this.bossAction);
        if(critical) {
            damage = Math.round(damage * 1.5);
        }

        if(playerDefenseDown) {
            damage = Math.round(damage * 2);
        }

        const bossAttackHitted = this.bossAttackHitted(this.bossAction, playerDivUp);
        if(!bossAttackHitted) {
            this.decideBossState();
            this.delegator.onBossAttackMissed(this.bossState, this.bossAction, this.playerHitDown,
                                              this.playerDefenseDown, this.isUsingSkill6,
                                              this.playerAttackUp, this.playerCriticalUp,
                                              this.playerDvUp);
            this.decideBossAction();
        } else {
            if(this.bossAction === BossActions.MAGIC_TOOL_1) {
                this.playerHitDown = 2;
            }
            if(this.bossAction === BossActions.MAGIC_TOOL_2) {
                this.playerDefenseDown = 2;
            }

            const fromHpPercent = this.playerStatus.hp / this.maxPlayerHp;
            this.playerStatus.hp -= damage;
            this.delegator.onPlayerHpChanged(this.playerStatus.hp);
            let toHpPercent = this.playerStatus.hp / this.maxPlayerHp;
            if(this.playerStatus.hp <= 0) {
                toHpPercent = 0;
            }
            
            this.decideBossState();
            this.delegator.onPlayerDamaged(damage, fromHpPercent, toHpPercent, this.bossState,
                                           this.bossAction, this.playerHitDown, this.playerDefenseDown,
                                           critical, this.isUsingSkill6, this.playerAttackUp,
                                           this.playerCriticalUp, this.playerDvUp, this.turn,
                                           this.bossStatus.hp);
            this.decideBossAction();
        }
    }

    public onItemUsed(itemName: string): void {
        if(itemName === ItemNames.GreatHpPotion) {
            const fromHpPercent = this.playerStatus.hp / this.maxPlayerHp;
            this.playerStatus.hp += 1000;
            let toHpPercent = this.playerStatus.hp / this.maxPlayerHp;
            if(this.playerStatus.hp > this.maxPlayerHp) {
                this.playerStatus.hp = this.maxPlayerHp;
                toHpPercent = 1;
            }
            this.delegator.onPlayerHpRecovered(1000, fromHpPercent, toHpPercent);
            this.delegator.onPlayerHpChanged(this.playerStatus.hp);
        }
        if(itemName === ItemNames.HighHpPotion) {
            const fromHpPercent = this.playerStatus.hp / this.maxPlayerHp;
            this.playerStatus.hp += 500;
            let toHpPercent = this.playerStatus.hp / this.maxPlayerHp;
            if(this.playerStatus.hp > this.maxPlayerHp) {
                this.playerStatus.hp = this.maxPlayerHp;
                toHpPercent = 1;
            }
            this.delegator.onPlayerHpRecovered(500, fromHpPercent, toHpPercent);
            this.delegator.onPlayerHpChanged(this.playerStatus.hp);
        }
        if(itemName === ItemNames.HpPotion) {
            const fromHpPercent = this.playerStatus.hp / this.maxPlayerHp;
            this.playerStatus.hp += 300;
            let toHpPercent = this.playerStatus.hp / this.maxPlayerHp;
            if(this.playerStatus.hp > this.maxPlayerHp) {
                this.playerStatus.hp = this.maxPlayerHp;
                toHpPercent = 1;
            }
            this.delegator.onPlayerHpRecovered(300, fromHpPercent, toHpPercent);
            this.delegator.onPlayerHpChanged(this.playerStatus.hp);
        }
        if(itemName === ItemNames.GreatFpPotion) {
            const fromFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            this.playerStatus.fp += 800;
            let toFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            if(this.playerStatus.fp > this.maxPlayerFp) {
                this.playerStatus.fp = this.maxPlayerFp;
                toFpPercent = 1;
            }
            this.delegator.onPlayerFpRecovered(800, fromFpPercent, toFpPercent);
            this.delegator.onPlayerFpChanged(this.playerStatus.fp);
        }
        if(itemName === ItemNames.HighFpPotion) {
            const fromFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            this.playerStatus.fp += 400;
            let toFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            if(this.playerStatus.fp > this.maxPlayerFp) {
                this.playerStatus.fp = this.maxPlayerFp;
                toFpPercent = 1;
            }
            this.delegator.onPlayerFpRecovered(400, fromFpPercent, toFpPercent);
            this.delegator.onPlayerFpChanged(this.playerStatus.fp);
        }
        if(itemName === ItemNames.FpPotion) {
            const fromFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            this.playerStatus.fp += 250;
            let toFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            if(this.playerStatus.fp > this.maxPlayerFp) {
                this.playerStatus.fp = this.maxPlayerFp;
                toFpPercent = 1;
            }
            this.delegator.onPlayerFpRecovered(250, fromFpPercent, toFpPercent);
            this.delegator.onPlayerFpChanged(this.playerStatus.fp);
        }
        if(itemName === ItemNames.Nectar) {
            const fromHpPercent = this.playerStatus.hp / this.maxPlayerHp;
            this.playerStatus.hp += 1500;
            let toHpPercent = this.playerStatus.hp / this.maxPlayerHp;
            if(this.playerStatus.hp > this.maxPlayerHp) {
                this.playerStatus.hp = this.maxPlayerHp;
                toHpPercent = 1;
            }

            const fromFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            this.playerStatus.fp += 1500;
            let toFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            if(this.playerStatus.fp > this.maxPlayerFp) {
                this.playerStatus.fp = this.maxPlayerFp;
                toFpPercent = 1;
            }

            this.playerDefenseDown = 0;
            this.playerHitDown  = 0;
            this.delegator.onPlayerFullRecovered(fromHpPercent, toHpPercent, fromFpPercent, toFpPercent);
            this.delegator.onPlayerHpChanged(this.playerStatus.hp);
            this.delegator.onPlayerFpChanged(this.playerStatus.fp);
        }
        if(itemName === ItemNames.CurePowder) {
            this.playerDefenseDown = 0;
            this.playerHitDown  = 0;
            this.delegator.onPlayerCured();
        }
        if(itemName === ItemNames.AttackUp) {
            this.playerAttackUp = 4;
            this.delegator.onPlayerAttackUpped();
        }
        if(itemName === ItemNames.CriticalUp) {
            this.playerCriticalUp = 4;
            this.delegator.onPlayerCriticalUpped();
        }
        if(itemName === ItemNames.DvUp) {
            this.playerDvUp = 4;
            this.delegator.onPlayerDvUpped();
        }
        if(itemName === ItemNames.AronBeta) {
            this.isUsingAronBeta = true;
            this.delegator.onAronBetaUsed();
        }
    }

    public onSkillUsed(skillType: number): void {
        if(skillType === SkillTypes.SKILL_1) {
            let damage = Math.round(this.calcuBossDamage() * 1.2);
            if(this.playerStatus.fp < 200) {
                damage = Math.round(damage / 4); 
            }
            if(this.bossAction === BossActions.GUARD) {
                damage = Math.round(damage / 2);
            }
            let critical = this.playerAttackCritical(skillType);
            if(critical) {
                damage = Math.round(damage * 1.5);
            }

            const playerAttackHitted = this.playerAttackHitted(skillType);
            if(!playerAttackHitted) {
                this.delegator.onPlayerAttackMissed();
            } else {
                this.bossStatus.hp -= damage;
                this.delegator.onBossHpChanged(this.bossStatus.hp);
                this.delegator.onBossDamaged(damage, critical, this.bossStatus.hp, this.turn);
            }
            
            const fromFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            this.playerStatus.fp -= 200;
            let toFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            if(this.playerStatus.fp <= 0) {
                this.playerStatus.fp = 0;
                toFpPercent = 0;
            }
            this.delegator.onPlayerFpChanged(this.playerStatus.fp);
            this.delegator.onPlayerFpDecreased(fromFpPercent, toFpPercent);
        }
        if(skillType === SkillTypes.SKILL_2) {
            let damage = Math.round(this.calcuBossDamage() * 1.4);
            if(this.playerStatus.fp < 340) {
                damage = Math.round(damage / 4); 
            }
            if(this.bossAction === BossActions.GUARD) {
                damage = Math.round(damage / 2);
            }
            let critical = this.playerAttackCritical(skillType);
            if(critical) {
                damage = Math.round(damage * 1.5);
            }

            const playerAttackHitted = this.playerAttackHitted(skillType);
            if(!playerAttackHitted) {
                this.delegator.onPlayerAttackMissed();
            } else {
                let randomNumber = Math.random();
                if(randomNumber <= 0.3) {
                    this.bossFlinched = true;
                }

                this.bossStatus.hp -= damage;
                this.delegator.onBossHpChanged(this.bossStatus.hp);
                this.delegator.onBossDamaged(damage, critical, this.bossStatus.hp, this.turn);
            }
            
            const fromFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            this.playerStatus.fp -= 340;
            let toFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            if(this.playerStatus.fp <= 0) {
                this.playerStatus.fp = 0;
                toFpPercent = 0;
            }
            this.delegator.onPlayerFpChanged(this.playerStatus.fp);
            this.delegator.onPlayerFpDecreased(fromFpPercent, toFpPercent);
        }
        if(skillType === SkillTypes.SKILL_3) {
            let damage = this.calcuBossDamage() * 2;
            if(this.playerStatus.fp < 450) {
                damage = Math.round(damage / 4); 
            }
            if(this.bossAction === BossActions.GUARD) {
                damage = Math.round(damage / 2);
            }
            let critical = this.playerAttackCritical(skillType);
            if(critical) {
                damage = Math.round(damage * 1.5);
            }

            const playerAttackHitted = this.playerAttackHitted(skillType);
            if(!playerAttackHitted) {
                this.delegator.onPlayerAttackMissed();
            } else {
                this.bossStatus.hp -= damage;
                this.delegator.onBossHpChanged(this.bossStatus.hp);
                this.delegator.onBossDamaged(damage, critical, this.bossStatus.hp, this.turn);
            }
            
            const fromFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            this.playerStatus.fp -= 450;
            let toFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            if(this.playerStatus.fp <= 0) {
                this.playerStatus.fp = 0;
                toFpPercent = 0;
            }
            this.delegator.onPlayerFpChanged(this.playerStatus.fp);
            this.delegator.onPlayerFpDecreased(fromFpPercent, toFpPercent);
        }
        if(skillType === SkillTypes.SKILL_4) {
            let damage = Math.round(this.calcuBossDamage() * 1.2);
            if(this.playerStatus.fp < 200) {
                damage = Math.round(damage / 4); 
            }
            
            let critical = this.playerAttackCritical(skillType);
            if(this.bossAction === BossActions.GUARD) {
                critical = true;
            }
            if(critical) {
                damage = Math.round(damage * 1.7);
            }

            const playerAttackHitted = this.playerAttackHitted(skillType);
            if(!playerAttackHitted) {
                this.delegator.onPlayerAttackMissed();
            } else {
                this.bossStatus.hp -= damage;
                this.delegator.onBossHpChanged(this.bossStatus.hp);
                this.delegator.onBossDamaged(damage, critical, this.bossStatus.hp, this.turn);
            }
            
            const fromFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            this.playerStatus.fp -= 200;
            let toFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            if(this.playerStatus.fp <= 0) {
                this.playerStatus.fp = 0;
                toFpPercent = 0;
            }
            this.delegator.onPlayerFpChanged(this.playerStatus.fp);
            this.delegator.onPlayerFpDecreased(fromFpPercent, toFpPercent);
        }
        if(skillType === SkillTypes.SKILL_5) {
            let damage = Math.round(this.calcuBossDamage() * 1.3);
            if(this.playerStatus.fp < 250) {
                damage = Math.round(damage / 4); 
            }
            if(this.bossAction === BossActions.GUARD) {
                damage = Math.round(damage / 2);
            }
            let critical = this.playerAttackCritical(skillType);
            if(this.bossAction === BossActions.AVOID) {
                critical = true;
            }
            if(critical) {
                damage = Math.round(damage * 1.5);
            }

            const playerAttackHitted = this.playerAttackHitted(skillType);
            if(!playerAttackHitted) {
                this.delegator.onPlayerAttackMissed();
            } else {
                this.bossStatus.hp -= damage;
                this.delegator.onBossHpChanged(this.bossStatus.hp);
                this.delegator.onBossDamaged(damage, critical, this.bossStatus.hp, this.turn);
            }
            
            const fromFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            this.playerStatus.fp -= 250;
            let toFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            if(this.playerStatus.fp <= 0) {
                this.playerStatus.fp = 0;
                toFpPercent = 0;
            }
            this.delegator.onPlayerFpChanged(this.playerStatus.fp);
            this.delegator.onPlayerFpDecreased(fromFpPercent, toFpPercent);
        }
        if(skillType === SkillTypes.SKILL_6 && !this.isUsingSkill6) {
            this.isUsingSkill6 = true;
            this.delegator.onSkill6Used();
        } else if(skillType === SkillTypes.SKILL_6 && this.isUsingSkill6) {
            this.isUsingSkill6 = false;

            let damage = Math.round(this.calcuBossDamage() * 2.5);
            if(this.playerStatus.fp < 250) {
                damage = Math.round(damage / 4); 
            }
            if(this.bossAction === BossActions.GUARD) {
                damage = Math.round(damage / 2);
            }
            let critical = this.playerAttackCritical(skillType);
            if(critical) {
                damage = Math.round(damage * 1.5);
            }

            const playerAttackHitted = this.playerAttackHitted(skillType);
            if(!playerAttackHitted) {
                this.delegator.onPlayerAttackMissed();
            } else {
                this.bossStatus.hp -= damage;
                this.delegator.onBossHpChanged(this.bossStatus.hp);
                this.delegator.onBossDamaged(damage, critical, this.bossStatus.hp, this.turn);
            }
            
            const fromFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            this.playerStatus.fp -= 250;
            let toFpPercent = this.playerStatus.fp / this.maxPlayerFp;
            if(this.playerStatus.fp <= 0) {
                this.playerStatus.fp = 0;
                toFpPercent = 0;
            }
            this.delegator.onPlayerFpChanged(this.playerStatus.fp);
            this.delegator.onPlayerFpDecreased(fromFpPercent, toFpPercent);
        }
    }

    private calcuPlayerDamage(): number {
        if(this.isUsingAronBeta) {
            return 0;
        }

        if(this.bossAction === BossActions.NORMAL_ATTACK) {
            return Math.floor((Math.random() * (200 - 100 + 1) + 100) * this.playerDamageCut);
        } else if(this.bossAction === BossActions.SKILL_1) {
            return Math.floor((Math.random() * (300 - 100 + 1) + 100) * this.playerDamageCut);
        } else if(this.bossAction === BossActions.SKILL_2) {
            return Math.floor((Math.random() * (400 - 200 + 1) + 200) * this.playerDamageCut);
        } else if(this.bossAction === BossActions.SKILL_3) {
            return Math.floor((Math.random() * (500 - 300 + 1) + 300) * this.playerDamageCut);
        } else if(this.bossAction === BossActions.MAGIC_TOOL_1) {
            return Math.floor((Math.random() * (300 - 250 + 1) + 250) * this.playerDamageCut);
        } else if(this.bossAction === BossActions.MAGIC_TOOL_2) {
            return Math.floor((Math.random() * (200 - 150 + 1) + 150) * this.playerDamageCut);
        } else if(this.bossAction === BossActions.MAGIC_TOOL_3) {
            return Math.floor((Math.random() * (500 - 400 + 1) + 400) * this.playerDamageCut);
        } else if(this.bossAction === BossActions.SPECIAL_MOVE) {
            return Math.floor((Math.random() * (700 - 500 + 1) + 500) * this.playerDamageCut);
        } else {
            return 0;
        }
    }

    private calcuBossDamage(): number {
        if(this.playerAttackUp) {
            return Math.floor((Math.random() * (180 - 140 + 1) + 140) * this.playerDamageAdd);
        } else {
            return Math.floor((Math.random() * (150 - 100 + 1) + 100) * this.playerDamageAdd);
        }
    }

    private bossAttackHitted(attackType: number, playerDvUp: boolean): boolean {
        let percent: number = 0;
        if(attackType === BossActions.NORMAL_ATTACK) {
            percent = 1.0;
        } else if(attackType === BossActions.SKILL_1) {
            percent = 0.95;
        } else if(attackType === BossActions.SKILL_2) {
            percent = 0.95;
        } else if(attackType === BossActions.SKILL_3) {
            percent = 0.95;
        } else if(attackType === BossActions.MAGIC_TOOL_1) {
            percent = 0.85;
        } else if(attackType === BossActions.MAGIC_TOOL_2) {
            percent = 0.9;
        } else if(attackType === BossActions.MAGIC_TOOL_3) {
            percent = 0.95;
        } else if(attackType === BossActions.SPECIAL_MOVE) {
            percent = 0.95;
        }
    
        percent =  percent - this.playerStatus.dv * 0.02;
        if(this.playerStatus.dv === 1) {
            percent =  percent - 0.02;
        } else if(this.playerStatus.dv === 2) {
            percent =  percent - 0.04;
        } else if(this.playerStatus.dv === 3) {
            percent =  percent - 0.06;
        } else if(this.playerStatus.dv === 4) {
            percent =  percent - 0.08;
        } else if(this.playerStatus.dv === 5) {
            percent =  percent - 0.1;
        } else if(this.playerStatus.dv === 6) {
            percent =  percent - 0.12;
        } else if(this.playerStatus.dv === 7) {
            percent =  percent - 0.15;
        } else if(this.playerStatus.dv === 8) {
            percent =  percent - 0.20;
        } else if(this.playerStatus.dv === 9) {
            percent =  percent - 0.25;
        } else if(this.playerStatus.dv === 10) {
            percent =  percent - 0.3;
        }
        if(playerDvUp) {
            percent -= 0.5;
        }
        
        let randomNumber = Math.random();
        if(randomNumber <= percent) {
            return true;
        } else {
            return false;
        }
    }

    private playerAttackHitted(attackType: number): boolean {
        if(this.bossAction === BossActions.AVOID && attackType !== SkillTypes.SKILL_5) {
            return false;
        }

        let percent: number = 0;
        if(attackType === 0) {
            percent = 0.5;
        } else if(attackType === SkillTypes.SKILL_1) {
            percent = 0.45;
        } else if(attackType === SkillTypes.SKILL_2) {
            percent = 0.45;
        } else if(attackType === SkillTypes.SKILL_3) {
            percent = 0.45;
        } else if(attackType === SkillTypes.SKILL_4) {
            percent = 0.45;
        } else if(attackType === SkillTypes.SKILL_5) {
            percent = 1.05;
        } else if(attackType === SkillTypes.SKILL_6) {
            percent = 0.55;
        }
        
        if(this.playerStatus.hit === 1) {
            percent += 0.2;
        } else if(this.playerStatus.hit === 2) {
            percent += 0.25;
        } else if(this.playerStatus.hit === 3) {
            percent += 0.3;
        } else if(this.playerStatus.hit === 4) {
            percent += 0.35;
        } else if(this.playerStatus.hit === 5) {
            percent += 0.4;
        } else if(this.playerStatus.hit === 6) {
            percent += 0.45;
        } else if(this.playerStatus.hit === 7) {
            percent += 0.5;
        } else if(this.playerStatus.hit === 8) {
            percent += 1.0;
        } else if(this.playerStatus.hit === 9) {
            percent += 1.2;
        } else if(this.playerStatus.hit === 10) {
            percent += 1.45;
        }

        if(this.playerHitDown) {
            percent = percent / 2;
        }
        
        let randomNumber = Math.random();
        if(randomNumber <= percent) {
            return true;
        } else {
            return false;
        }
    }

    private playerAttackCritical(attackType: number): boolean {
        let percent: number = 0;
        if(attackType === 0) {
            percent = 0.15;
            percent += this.playerStatus.crit * 0.04;
        } else if(attackType === SkillTypes.SKILL_1) {
            percent = 0.3;
            percent += this.playerStatus.crit * 0.06;
        } else if(attackType === SkillTypes.SKILL_2) {
            percent = 0.05;
            percent += this.playerStatus.crit * 0.04;
        } else if(attackType === SkillTypes.SKILL_3) {
            percent = 0.1;
            percent += this.playerStatus.crit * 0.08;
        } else if(attackType === SkillTypes.SKILL_4) {
            percent = 0.05;
            percent += this.playerStatus.crit * 0.04;
        } else if(attackType === SkillTypes.SKILL_5) {
            percent = 0.05;
            percent += this.playerStatus.crit * 0.04;
        } else if(attackType === SkillTypes.SKILL_6) {
            percent = 0.05;
            percent += this.playerStatus.crit * 0.04;
        }

        if(this.playerCriticalUp) {
            percent += 0.5;
        }
        
        let randomNumber = Math.random();
        if(randomNumber <= percent) {
            return true;
        } else {
            return false;
        }
    }

    private bossAttackCritical(attackType: number): boolean {
        let percent: number = 0;
        if(attackType === BossActions.NORMAL_ATTACK) {
            percent = 0.15;
        } else if(attackType === BossActions.SKILL_1) {
            percent = 0.2;
        } else if(attackType === BossActions.SKILL_2) {
            percent = 0.15;
        } else if(attackType === BossActions.SKILL_3) {
            percent = 0.15;
        } else if(attackType === BossActions.SPECIAL_MOVE) {
            percent = 0.3;
        } 
        
        let randomNumber = Math.random();
        if(randomNumber < percent) {
            return true;
        } else {
            return false;
        }
    }

    private decideBossState(): void {
        if(10500 <= this.bossStatus.hp) {
            const bossStates = [
                BossStates.SWORD_VERTICAL,
                BossStates.SWORD_HORIZON,
                BossStates.SWORD_UP,
                BossStates.SWORD_CROSS,
                BossStates.SWORD_DOWN,
                BossStates.RIGHT_FOOT_FORWARD,
                BossStates.LEFT_FOOT_FORWARD,
                BossStates.RIGHT_HAND_FORWARD,
                BossStates.LEFT_HAND_FORWARD
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.8) {
                this.bossState = bossStates[0];
            } else if(randomNumber >= 0.6 && randomNumber < 0.8) {
                this.bossState = bossStates[1];
            } else if(randomNumber >= 0.4 && randomNumber < 0.6) {
                this.bossState = bossStates[2];
            } else if(randomNumber >= 0.25 && randomNumber < 0.4) {
                this.bossState = bossStates[3];
            } else if(randomNumber >= 0.2 && randomNumber < 0.25) {
                this.bossState = bossStates[4];
            } else if(randomNumber >= 0.15 && randomNumber < 0.2) {
                this.bossState = bossStates[5];
            } else if(randomNumber >= 0.1 && randomNumber < 0.15) {
                this.bossState = bossStates[6];
            } else if(randomNumber >= 0.05 && randomNumber < 0.1) {
                this.bossState = bossStates[7];
            } else if(randomNumber >= 0 && randomNumber < 0.05) {
                this.bossState = bossStates[8];
            }
        } else if(6000 <= this.bossStatus.hp && this.bossStatus.hp < 10500) {
            const bossStates = [
                BossStates.SWORD_VERTICAL,
                BossStates.SWORD_HORIZON,
                BossStates.SWORD_UP,
                BossStates.SWORD_CROSS,
                BossStates.SWORD_DOWN,
                BossStates.RIGHT_FOOT_FORWARD,
                BossStates.LEFT_FOOT_FORWARD,
                BossStates.RIGHT_HAND_FORWARD,
                BossStates.LEFT_HAND_FORWARD
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.85) {
                this.bossState = bossStates[0];
            } else if(randomNumber >= 0.7 && randomNumber < 0.85) {
                this.bossState = bossStates[1];
            } else if(randomNumber >= 0.55 && randomNumber < 0.7) {
                this.bossState = bossStates[2];
            } else if(randomNumber >= 0.45 && randomNumber < 0.55) {
                this.bossState = bossStates[3];
            } else if(randomNumber >= 0.4 && randomNumber < 0.45) {
                this.bossState = bossStates[4];
            } else if(randomNumber >= 0.3 && randomNumber < 0.4) {
                this.bossState = bossStates[5];
            } else if(randomNumber >= 0.2 && randomNumber < 0.3) {
                this.bossState = bossStates[6];
            } else if(randomNumber >= 0.1 && randomNumber < 0.2) {
                this.bossState = bossStates[7];
            } else if(randomNumber >= 0 && randomNumber < 0.1) {
                this.bossState = bossStates[8];
            }
        } else if(3000 <= this.bossStatus.hp && this.bossStatus.hp < 6000) {
            const bossStates = [
                BossStates.SWORD_VERTICAL,
                BossStates.SWORD_HORIZON,
                BossStates.SWORD_UP,
                BossStates.SWORD_CROSS,
                BossStates.SWORD_DOWN,
                BossStates.RIGHT_FOOT_FORWARD,
                BossStates.LEFT_FOOT_FORWARD,
                BossStates.RIGHT_HAND_FORWARD,
                BossStates.LEFT_HAND_FORWARD
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.95) {
                this.bossState = bossStates[0];
            } else if(randomNumber >= 0.9 && randomNumber < 0.95) {
                this.bossState = bossStates[1];
            } else if(randomNumber >= 0.75 && randomNumber < 0.9) {
                this.bossState = bossStates[2];
            } else if(randomNumber >= 0.6 && randomNumber < 0.75) {
                this.bossState = bossStates[3];
            } else if(randomNumber >= 0.5 && randomNumber < 0.6) {
                this.bossState = bossStates[4];
            } else if(randomNumber >= 0.4 && randomNumber < 0.5) {
                this.bossState = bossStates[5];
            } else if(randomNumber >= 0.3 && randomNumber < 0.4) {
                this.bossState = bossStates[6];
            } else if(randomNumber >= 0.15 && randomNumber < 0.3) {
                this.bossState = bossStates[7];
            } else if(randomNumber >= 0 && randomNumber < 0.15) {
                this.bossState = bossStates[8];
            }
        } else if(1 <= this.bossStatus.hp && this.bossStatus.hp < 3000) {
            const bossStates = [
                BossStates.SWORD_VERTICAL,
                BossStates.SWORD_HORIZON,
                BossStates.SWORD_UP,
                BossStates.SWORD_CROSS,
                BossStates.SWORD_DOWN,
                BossStates.RIGHT_FOOT_FORWARD,
                BossStates.LEFT_FOOT_FORWARD,
                BossStates.RIGHT_HAND_FORWARD,
                BossStates.LEFT_HAND_FORWARD,
                BossStates.LOW_POSTURE
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.95) {
                this.bossState = bossStates[0];
            } else if(randomNumber >= 0.9 && randomNumber < 0.95) {
                this.bossState = bossStates[1];
            } else if(randomNumber >= 0.8 && randomNumber < 0.9) {
                this.bossState = bossStates[2];
            } else if(randomNumber >= 0.7 && randomNumber < 0.8) {
                this.bossState = bossStates[3];
            } else if(randomNumber >= 0.6 && randomNumber < 0.7) {
                this.bossState = bossStates[4];
            } else if(randomNumber >= 0.5 && randomNumber < 0.6) {
                this.bossState = bossStates[5];
            } else if(randomNumber >= 0.4 && randomNumber < 0.5) {
                this.bossState = bossStates[6];
            } else if(randomNumber >= 0.3 && randomNumber < 0.4) {
                this.bossState = bossStates[7];
            } else if(randomNumber >= 0.2 && randomNumber < 0.3) {
                this.bossState = bossStates[8];
            } else if(randomNumber >= 0 && randomNumber < 0.2) {
                this.bossState = bossStates[9];
            }
        }
    }

    private decideBossAction(): void {
        if(this.bossState === BossStates.SWORD_VERTICAL) {
            const actions = [
                BossActions.NORMAL_ATTACK,
                BossActions.SKILL_1,
                BossActions.SKILL_2,
                BossActions.GUARD
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.3) {
                this.bossAction = actions[0];
            } else if(randomNumber >= 0.2 && randomNumber < 0.3) {
                this.bossAction = actions[1];
            } else if(randomNumber >= 0.1 && randomNumber < 0.2) {
                this.bossAction = actions[2];
            } else if(randomNumber >= 0 && randomNumber < 0.1) {
                this.bossAction = actions[3];
            }
        }
        if(this.bossState === BossStates.SWORD_HORIZON) {
            const actions = [
                BossActions.NORMAL_ATTACK,
                BossActions.SKILL_1,
                BossActions.GUARD,
                BossActions.AVOID
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.5) {
                this.bossAction = actions[0];
            } else if(randomNumber >= 0.3 && randomNumber < 0.5) {
                this.bossAction = actions[1];
            } else if(randomNumber >= 0.15 && randomNumber < 0.3) {
                this.bossAction = actions[2];
            } else if(randomNumber >= 0 && randomNumber < 0.15) {
                this.bossAction = actions[3];
            }
        }
        if(this.bossState === BossStates.SWORD_DOWN) {
            const actions = [
                BossActions.AVOID,
                BossActions.SKILL_1,
                BossActions.NORMAL_ATTACK,
                BossActions.MAGIC_TOOL_2
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.5) {
                this.bossAction = actions[0];
            } else if(randomNumber >= 0.4 && randomNumber < 0.5) {
                this.bossAction = actions[1];
            } else if(randomNumber >= 0.2 && randomNumber < 0.4) {
                this.bossAction = actions[2];
            } else if(randomNumber >= 0 && randomNumber < 0.2) {
                this.bossAction = actions[3];
            }
        }
        if(this.bossState === BossStates.SWORD_CROSS) {
            const actions = [
                BossActions.SKILL_3,
                BossActions.SKILL_2,
                BossActions.NORMAL_ATTACK
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.5) {
                this.bossAction = actions[0];
            } else if(randomNumber >= 0.25 && randomNumber < 0.5) {
                this.bossAction = actions[1];
            } else if(randomNumber >= 0 && randomNumber < 0.25) {
                this.bossAction = actions[2];
            }
        }
        if(this.bossState === BossStates.SWORD_UP) {
            const actions = [
                BossActions.SKILL_2,
                BossActions.SKILL_3,
                BossActions.NORMAL_ATTACK,
                BossActions.GUARD
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.5) {
                this.bossAction = actions[0];
            } else if(randomNumber >= 0.3 && randomNumber < 0.5) {
                this.bossAction = actions[1];
            } else if(randomNumber >= 0.15 && randomNumber < 0.3) {
                this.bossAction = actions[2];
            } else if(randomNumber >= 0 && randomNumber < 0.15) {
                this.bossAction = actions[3];
            }
        }
        if(this.bossState === BossStates.LOW_POSTURE) {
            const actions = [
                BossActions.SKILL_2,
                BossActions.SKILL_3,
                BossActions.SPECIAL_MOVE
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.8) {
                this.bossAction = actions[0];
            } else if(randomNumber >= 0.5 && randomNumber < 0.8) {
                this.bossAction = actions[1];
            } else if(randomNumber >= 0 && randomNumber < 0.5) {
                this.bossAction = actions[2];
            }
        }
        if(this.bossState === BossStates.RIGHT_HAND_FORWARD) {
            const actions = [
                BossActions.MAGIC_TOOL_1,
                BossActions.MAGIC_TOOL_2,
                BossActions.NORMAL_ATTACK,
                BossActions.GUARD
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.6) {
                this.bossAction = actions[0];
            } else if(randomNumber >= 0.3 && randomNumber < 0.6) {
                this.bossAction = actions[1];
            } else if(randomNumber >= 0.15 && randomNumber < 0.3) {
                this.bossAction = actions[2];
            } else if(randomNumber >= 0 && randomNumber < 0.15) {
                this.bossAction = actions[3];
            }
        }
        if(this.bossState === BossStates.LEFT_HAND_FORWARD) {
            const actions = [
                BossActions.MAGIC_TOOL_1,
                BossActions.MAGIC_TOOL_3,
                BossActions.NORMAL_ATTACK,
                BossActions.GUARD
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.8) {
                this.bossAction = actions[0];
            } else if(randomNumber >= 0.3 && randomNumber < 0.8) {
                this.bossAction = actions[1];
            } else if(randomNumber >= 0.15 && randomNumber < 0.3) {
                this.bossAction = actions[2];
            } else if(randomNumber >= 0 && randomNumber < 0.15) {
                this.bossAction = actions[3];
            }
        }
        if(this.bossState === BossStates.RIGHT_FOOT_FORWARD) {
            const actions = [
                BossActions.GUARD,
                BossActions.NORMAL_ATTACK,
                BossActions.MAGIC_TOOL_1,
                BossActions.SKILL_2
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.5) {
                this.bossAction = actions[0];
            } else if(randomNumber >= 0.3 && randomNumber < 0.5) {
                this.bossAction = actions[1];
            } else if(randomNumber >= 0.1 && randomNumber < 0.3) {
                this.bossAction = actions[2];
            } else if(randomNumber >= 0 && randomNumber < 0.1) {
                this.bossAction = actions[3];
            }
        }
        if(this.bossState === BossStates.LEFT_FOOT_FORWARD) {
            const actions = [
                BossActions.GUARD,
                BossActions.AVOID,
                BossActions.MAGIC_TOOL_2,
                BossActions.SKILL_3
            ];
            const randomNumber = Math.random();
            if(randomNumber >= 0.7) {
                this.bossAction = actions[0];
            } else if(randomNumber >= 0.4 && randomNumber < 0.7) {
                this.bossAction = actions[1];
            } else if(randomNumber >= 0.2 && randomNumber < 0.4) {
                this.bossAction = actions[2];
            } else if(randomNumber >= 0 && randomNumber < 0.2) {
                this.bossAction = actions[3];
            }
        }
    }

    private setPlayerDamageRate(): void {
        if(this.playerStatus.def === 1) {
            this.playerDamageCut = 1.0;
        } else if(this.playerStatus.def === 2) {
            this.playerDamageCut = 0.96
        } else if(this.playerStatus.def === 3) {
            this.playerDamageCut = 0.91
        } else if(this.playerStatus.def === 4) {
            this.playerDamageCut = 0.86
        } else if(this.playerStatus.def === 5) {
            this.playerDamageCut = 0.81
        } else if(this.playerStatus.def === 6) {
            this.playerDamageCut = 0.78
        } else if(this.playerStatus.def === 7) {
            this.playerDamageCut = 0.75
        } else if(this.playerStatus.def === 8) {
            this.playerDamageCut = 0.73
        } else if(this.playerStatus.def === 9) {
            this.playerDamageCut = 0.71
        } else if(this.playerStatus.def === 10) {
            this.playerDamageCut = 0.69
        }

        if(this.playerStatus.atk === 1) {
            this.playerDamageAdd = 1.2;
        } else if(this.playerStatus.atk === 2) {
            this.playerDamageAdd = 1.3;
        } else if(this.playerStatus.atk === 3) {
            this.playerDamageAdd = 1.4;
        } else if(this.playerStatus.atk === 4) {
            this.playerDamageAdd = 1.5;
        } else if(this.playerStatus.atk === 5) {
            this.playerDamageAdd = 1.6;
        } else if(this.playerStatus.atk === 6) {
            this.playerDamageAdd = 1.65;
        } else if(this.playerStatus.atk === 7) {
            this.playerDamageAdd = 1.7;
        } else if(this.playerStatus.atk === 8) {
            this.playerDamageAdd = 1.75;
        } else if(this.playerStatus.atk === 9) {
            this.playerDamageAdd = 1.8;
        } else if(this.playerStatus.atk === 10) {
            this.playerDamageAdd = 1.85;
        }
    }
}