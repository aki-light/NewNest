export default interface Delegate {
    onPlayerAttackMissed(): void;
    onBossDamaged(damage: number, critical: boolean, bossHp: number, turn: number): void;
    onBossAttackMissed(bossState: number, bossAction: number, hitDown: number,
                       defenseDown: number, isUsingSkill6: boolean,
                       attackUp: number, criticalUp: number, divUp: number): void;
    onPlayerDamaged(damage: number, fromPercent: number,toPercent: number, bossState: number,
                    bossAction: number, hitDown: number, defenseDown: number, critical: boolean,
                    isUsingSkill6: boolean, attackUp: number, criticalUp: number, divUp: number,
                    turn: number, bossHp: number): void;
    onPlayerHpRecovered(amount: number, fromPercent: number, toPercent: number): void;
    onPlayerFpRecovered(amount: number, fromPercent: number, toPercent: number): void;
    onPlayerFullRecovered(fromHpPercent: number, toHpPercent: number, fromFPPercent: number, toFpPercent: number): void;
    onPlayerFpDecreased(fromPercent: number, toPercent:  number): void;
    onBossGuarded(bossState: number, hitDown: number, defenseDown: number, isUsingSkill6: boolean,
                  attackUp: number, criticalUp: number, divUp: number): void;
    onBossAvoided(bossState: number, hitDown: number, defenseDown: number, isUsingSkill6: boolean,
                  attackUp: number, criticalUp: number, divUp: number): void;
    onBossFlinched(bossState: number, hitDown: number, defenseDown: number, isUsingSkill6: boolean,
                   attackUp: number, criticalUp: number, divUp: number): void;
    onSkill6Used(): void;
    onPlayerCured(): void;
    onPlayerAttackUpped(): void;
    onPlayerCriticalUpped(): void;
    onPlayerDvUpped(): void;
    onAronBetaUsed(): void;
    onBossHpChanged(hp: number): void;
    onPlayerHpChanged(hp: number): void;
    onPlayerFpChanged(fp: number): void;
    onTurnAdded(turn: number): void;
}