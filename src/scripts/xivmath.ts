import {ComputedSetStats, JobData, LevelStats} from "./geartypes";

/*
    Common math for FFXIV.

    These mostly come from AkhMorning, however, there is one important difference - where possible, these are normalized
    to 1. That is, if something has no impact on the final result, it should be 1, rather than 100 or 1000. If it
    grants +50% damage, then it should be 1.5, rather than 150 or 1500, and so on.
 */

/**
 * Convert skill speed to GCD speed.
 *
 * @param baseGcd The base time of the ability in question (e.g. 2.5 for most abilities).
 * @param levelStats Level stats for the level at which the computation is to be performed.
 * @param sks The skill speed stat value.
 */
export function sksToGcd(baseGcd: number, levelStats: LevelStats, sks: number): number {
    return Math.floor((100) * ((baseGcd * 1000 * (1000 - Math.floor(130 * (sks - levelStats.baseSubStat) / levelStats.levelDiv)) / 1000) / 1000)) / 100;
}

/**
 * Convert spell speed to GCD speed.
 *
 * @param baseGcd The base time of the ability in question (e.g. 2.5 for most abilities).
 * @param levelStats Level stats for the level at which the computation is to be performed.
 * @param sps The spell speed stat value.
 */
export function spsToGcd(baseGcd: number, levelStats: LevelStats, sps: number): number {
    return Math.floor((100) * ((baseGcd * 1000 * (1000 - Math.floor(130 * (sps - levelStats.baseSubStat) / levelStats.levelDiv)) / 1000) / 1000)) / 100;
}

/**
 * Convert crit stat to crit chance.
 *
 * @param levelStats Level stats for the level at which the computation is to be performed.
 * @param crit The critical hit stat value.
 */
export function critChance(levelStats: LevelStats, crit: number) {
    return Math.floor(200 * (crit - levelStats.baseSubStat) / levelStats.levelDiv + 50) / 1000.0;
}

/**
 * Convert crit stat to crit damage multiplier.
 *
 * AkhMorning equivalent: F(CRIT)
 *
 * @param levelStats Level stats for the level at which the computation is to be performed.
 * @param crit The critical hit stat value.
 */
export function critDmg(levelStats: LevelStats, crit: number) {
    // return 1 + Math.floor(200 * (crit - levelStats.baseSubStat) / levelStats.levelDiv + 400) / 1000;
    return (1400 + Math.floor(200 * (crit - levelStats.baseSubStat) / levelStats.levelDiv)) / 1000.0;
}

// TODO
export function autoCritDmg(levelStats: LevelStats, crit: number) {
    return (1400)
}

/**
 * Convert direct hit stat to direct hit chance.
 *
 * @param levelStats Level stats for the level at which the computation is to be performed.
 * @param dhit The direct hit stat value.
 */
export function dhitChance(levelStats: LevelStats, dhit: number) {
    // return 1 + Math.floor((550 * dhit - levelStats.baseSubStat) / levelStats.levelDiv) / 1000;
    return Math.floor(550 * (dhit - levelStats.baseSubStat) / levelStats.levelDiv) / 1000.0;
}

/**
 * Convert direct hit stat to direct hit multiplier. Note that this is a fixed multiplier at the moment. This
 * function is only here in case that changes in the future.
 *
 * @param levelStats Level stats for the level at which the computation is to be performed.
 * @param dhit The direct hit stat value.
 */
export function dhitDmg(levelStats: LevelStats, dhit: number) {
    return 1.25;
}

/**
 * Convert a determination stat to its respective damage multiplier.
 *
 * AkhMorning equivalent: F(DET)
 *
 * @param levelStats Level stats for the level at which the computation is to be performed.
 * @param det The determination stat value.
 */
export function detDmg(levelStats: LevelStats, det: number) {
    return (1000 + Math.floor(140 * (det - levelStats.baseMainStat) / levelStats.levelDiv)) / 1000.0;
}

/**
 * Convert a Weapon Damage value to a damage multiplier.
 *
 * AkhMorning equivalent: F(WD)
 *
 * @param levelStats Level stats for the level at which the computation is to be performed.
 * @param jobStats Job stats for the job for which the computation is to be performed.
 * @param wd The weapon damage value.
 */
export function wdMulti(levelStats: LevelStats, jobStats: JobData, wd: number) {
    const mainStatJobMod = jobStats.jobStatMulipliers[jobStats.mainStat];
    return Math.floor((levelStats.baseMainStat * mainStatJobMod / 1000) + wd);
}

/**
 * Convert a spell speed amount to a DoT/HoT tick multiplier.
 *
 * AkhMorning equivalent: F(SPD)
 *
 * @param sps The spell speed.
 */
export function spsTickMulti(sps: number) {
    return (1000 + Math.floor(130 * (sps - 400) / 1900)) / 1000;
}

/**
 * Convert a skill speed amount to a DoT/HoT tick multiplier.
 *
 * AkhMorning equivalent: F(SPD)
 *
 * @param sks The skill speed.
 */
export function sksTickMulti(sks: number) {
    return (1000 + Math.floor(130 * (sks - 400) / 1900)) / 1000;
}

// TODO: only works for 90 and non-tank?
/**
 * Convert a main stat value to a damage multiplier.
 *
 * AkhMorning equivalent: F(AP) or F(ATK)
 *
 * @param levelStats
 * @param jobStats
 * @param mainstat
 */
export function mainStatMulti(levelStats: LevelStats, jobStats: JobData, mainstat: number) {
    if (jobStats.role === 'Tank') {
        // TODO: what is the number here?
        return (Math.floor(195 * (mainstat - levelStats.baseMainStat) / levelStats.baseMainStat) + 100) / 100;
    }
    else {
        return (Math.floor(195 * (mainstat - levelStats.baseMainStat) / levelStats.baseMainStat) + 100) / 100;
    }
}

export function pietyHealingMulti(levelStats: LevelStats, piety: number) {
    return 200 + (Math.floor(150 * (piety - levelStats.baseMainStat) / levelStats.levelDiv));
}

/**
 * Convert a tenacity stat value to its respective damage multiplier.
 *
 * AkhMorning equivalent: F(TNC)
 *
 * @param levelStats
 * @param tenacity
 */
export function tenacityDmg(levelStats: LevelStats, tenacity: number) {
    return 1000 + Math.floor(100 * (tenacity - levelStats.baseSubStat) / levelStats.levelDiv) / 1000;
}

/**
 * Convert direct hit stat to a damage multiplier for auto-DH abilities. Having more direct hit will provide more
 * damage in cases where the ability automatically direct hits.
 *
 * @param levelStats Level stats for the level at which the computation is to be performed.
 * @param dhit The direct hit stat value.
 */
export function autoDhBonusDmg(levelStats: LevelStats, dhit: number) {
    return Math.floor(140 * ((dhit - levelStats.baseMainStat) / levelStats.levelDiv) + 1000);
}

/**
 * Convert a piety stat to (MP regen)/tick amount.
 *
 * @param levelStats Level stats for the level at which the computation is to be performed.
 * @param piety The piety stat.
 */
export function mpTick(levelStats: LevelStats, piety: number) {
    return 200 + Math.floor(150 * (piety - levelStats.baseMainStat) / levelStats.levelDiv);
}

const fl = Math.floor;

/**
 * Computes base damage. Does not factor in crit/dh RNG nor damage variance.
 *
 * TODO: where to factor in extra damage from buffs?
 */
export function baseDamage(stats: ComputedSetStats, potency: number, autoDH: boolean = false, autoCrit: boolean = false) {

    // Multiplier from main stat
    const mainStatMulti = stats.mainStatMulti;
    // Multiplier from weapon damage
    const wdMulti = stats.wdMulti;
    // Multiplier for a successful crit
    const critMulti = stats.critMulti;
    // Crit chance
    // const critRate = gear.computedStats.critChance + extraBuffCritRate;
    const critRate = stats.critChance;
    // Dh chance
    // const dhRate = gear.computedStats.dhitChance + extraBuffDhRate;
    const dhRate = stats.dhitChance;
    // Multiplier for a successful DH
    const dhMulti = stats.dhitMulti;
    // Det multiplier
    const detMulti = stats.detMulti;
    // Extra damage from auto DH bonus
    const autoDhBonus = stats.autoDhBonus;
    const tncMulti = 1000 / 1000 // if tank you'd do Funcs.fTEN(stats.tenacity, level) / 1000
    const detAutoDhMulti = fl((detMulti + autoDhBonus) * 1000) / 1000;
    const traitMulti = stats.traitMulti;

    // console.log({
    //     mainStatMulti: mainStatMulti, wdMulti: wdMulti, critMulti: critMulti, critRate: critRate, dhRate: dhRate, dhMulti: dhMulti, detMulti: detMulti, tncMulti: tncMulti, traitMulti: traitMulti
    // });

    // Base action potency and main stat multi
    const basePotency = fl(potency * mainStatMulti * 100) / 100;
    // Factor in determination and auto DH multiplier
    const afterDet = fl(basePotency * (autoDH ? detAutoDhMulti : detMulti) * 100) / 100;
    // Factor in Tenacity multiplier
    const afterTnc = fl(afterDet * tncMulti * 100) / 100;
    // Factor in weapon damage multiplier
    const afterWeaponDamage = fl(afterTnc * wdMulti);
    // const d5 = fl(fl(afterWeaponDamage * critMulti) * DH_MULT)
    // Factor in auto crit multiplier
    const afterAutoCrit = autoCrit ? fl(afterWeaponDamage * (1 + (critRate * (critMulti - 1)))) : afterWeaponDamage;
    // Factor in auto DH multiplier
    const afterAutoDh = autoDH ? fl(afterAutoCrit * (1 + (dhRate * (dhMulti - 1)))) : afterAutoCrit;
    // Factor in trait multiplier
    const afterTrait = fl(fl(afterAutoDh * traitMulti) / 100);
    // console.log([basePotency, afterDet, afterTnc, afterWeaponDamage, d5, afterAutoCrit, afterAutoDh, afterTrait]);

    return afterTrait;
}

export function baseHealing(stats: ComputedSetStats, potency: number, autoDH: boolean = false, autoCrit: boolean = false) {

    // Multiplier from main stat
    const mainStatMulti = stats.mainStatMulti;
    // Multiplier from weapon damage
    const wdMulti = stats.wdMulti;
    // Multiplier for a successful crit
    const critMulti = stats.critMulti;
    // Crit chance
    // const critRate = gear.computedStats.critChance + extraBuffCritRate;
    const critRate = stats.critChance;
    // Dh chance
    // Det multiplier
    const detMulti = stats.detMulti;
    // Extra damage from auto DH bonus
    const tncMulti = 1000 / 1000 // if tank you'd do Funcs.fTEN(stats.tenacity, level) / 1000
    const traitMulti = stats.traitMulti;

    // Base action potency and main stat multi
    const basePotency = fl(potency * mainStatMulti * 100) / 100;
    // Factor in determination and auto DH multiplier
    const afterDet = fl(basePotency * detMulti * 100) / 100;
    // Factor in Tenacity multiplier
    const afterTnc = fl(afterDet * tncMulti * 100) / 100;
    // Factor in weapon damage multiplier
    const afterWeaponDamage = fl(afterTnc * wdMulti);
    // const d5 = fl(fl(afterWeaponDamage * critMulti) * DH_MULT)
    // Factor in auto crit multiplier
    const afterAutoCrit = autoCrit ? fl(afterWeaponDamage * (1 + (critRate * (critMulti - 1)))) : afterWeaponDamage;
    // Factor in auto DH multiplier
    // Factor in trait multiplier
    const afterTrait = fl(fl(afterAutoCrit * traitMulti) / 100);
    // console.log([basePotency, afterDet, afterTnc, afterWeaponDamage, d5, afterAutoCrit, d7, afterTrait]);

    return afterTrait;
}

export function applyDhCrit(baseDamage: number, stats: ComputedSetStats) {
    return baseDamage * (1 + stats.dhitChance * (stats.dhitMulti - 1)) * (1 + stats.critChance * (stats.critMulti - 1));
}

export function applyCrit(baseDamage: number, stats: ComputedSetStats) {
    return baseDamage * (1 + stats.critChance * (stats.critMulti - 1));

}

