import * as PIXI from 'pixi.js';
import GameManager from "./managers/GameManager";

const Resource = Object.freeze({
    UI: {
        SceneUiGraph: (sceneName: string): string => {
            return `ui_graph/${sceneName}.json`;
        },
        MessageWindow:
            'ui/message_window.png',
        OptionFrame:
            'ui/option_frame.png',
    },
    Texts: {
        InventoryScene: {
            Ja: 'ui_graph/inventory_scene_text.json',
            En: 'ui_graph/inventory_scene_text_en.json'
        },
        TalkScene: {
            Ja: 'ui_graph/talk_scene_text.json',
            En: 'ui_graph/talk_scene_text_en.json'
        },
        EndingTalkScene: {
            Ja: 'ui_graph/ending_talk_scene_text.json',
            En: 'ui_graph/ending_talk_scene_text_en.json'
        },
        ScoreScene: {
            Ja: 'ui_graph/score_scene_text.json',
            En: 'ui_graph/score_scene_text_en.json'
        },
        BattleScene: {
            Ja: 'ui_graph/battle_scene_text.json',
            En: 'ui_graph/battle_scene_text_en.json'
        }
    },
    Static: {
          NormalAttack: 'effects/normal_attack.json',
          NormalBossAttack: 'effects/normal_boss_attack.json',
          HpRecover: 'effects/hp_recover.json',
          FpRecover: 'effects/fp_recover.json',
          FullRecover: 'effects/full_recover.json',
          Cure: 'effects/cure.json',
          AttackUp: 'effects/attack_up.json',
          CriticalUp: 'effects/critical_up.json',
          DvUp: 'effects/dv_up.json',
          Guard: 'effects/guard.json',
          AllGuard: 'effects/all_guard.json',
          PlayerSkill1: 'effects/player_skill_1.json',
          PlayerSkill2_0: 'effects/player_skill_2-0.json',
          PlayerSkill2_1: 'effects/player_skill_2-1.json',
          PlayerSkill3: 'effects/player_skill_3.json',
          PlayerSkill4: 'effects/player_skill_4.json',
          PlayerSkill5: 'effects/player_skill_5.json',
          PlayerSkill6_0: 'effects/player_skill_6-0.json',
          PlayerSkill6_1: 'effects/player_skill_6-1.json',
          BossSkill1: 'effects/boss_skill_1.json',
          BossSkill2: 'effects/boss_skill_2.json',
          BossSkill3_0: 'effects/boss_skill_3-0.json',
          BossSkill3_1: 'effects/boss_skill_3-1.json',
          BossSpecialMove: 'effects/boss_special_move.json',
          MagicTool1: 'effects/magic_tool_1.json',
          MagicTool2: 'effects/magic_tool_2.json',
          MagicTool3_0: 'effects/magic_tool_3-0.json',
          MagicTool3_1: 'effects/magic_tool_3-1.json',
          MagicTool3_2: 'effects/magic_tool_3-2.json',
          BossTexture: {
              Idle: 'ui/boss.png',
              Damaged: 'ui/boss_damaged.png'
          },
          GaugeFrame: 'ui/gauge_frame.png',
          HpBar: 'ui/hp_bar.png',
          FpBar: 'ui/fp_bar.png',
          GaugeEmpty: 'ui/gauge_empty.png'  
    },
    TextureFrame: {
        NormalAttack: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`normal_attack-${index}.png`];
        },
        NormalBossAttack: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`boss_normal_attack_${index}.png`];
        },
        BossSkill1: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`boss_skill_1_${index}.png`];
        },
        BossSkill2: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`boss_skill_2_${index}.png`];
        },
        BossSkill3: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`boss_skill_3_${index}.png`];
        },
        BossSpecialMove: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`boss_special_move_${index}.png`];
        },
        MagicTool1: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`magic_tool_1_${index}.png`];
        },
        MagicTool2: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`magic_tool_2_${index}.png`];
        },
        MagicTool3: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`magic_tool_3_${index}.png`];
        },
        HpRecover: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`hp_recover_${index}.png`];
        },
        FpRecover: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`fp_recover_${index}.png`];
        },
        FullRecover: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`full_recover_${index}.png`];
        },
        Cure: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`cure_${index}.png`];
        },
        AttackUp: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`attack_up_${index}.png`];
        },
        CriticalUp: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`critical_up_${index}.png`];
        },
        DvUp: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`dv_up_${index}.png`];
        },
        PlayerSkill1: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`player_skill_1_${index}.png`];
        },
        PlayerSkill2: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`player_skill_2_${index}.png`];
        },
        PlayerSkill3: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`player_skill_3_${index}.png`];
        },
        PlayerSkill4: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`player_skill_4_${index}.png`];
        },
        PlayerSkill5: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`player_skill_5_${index}.png`];
        },
        PlayerSkill6: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`player_skill_6_${index}.png`];
        },
        Guard: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`guard_${index}.png`];
        },
        AllGuard: (index: number = 1): PIXI.Texture => {
            return PIXI.utils.TextureCache[`all_guard_${index}.png`];
        }
    },
    EquipMents: [
        'equipments/armor4_01.png',
        'equipments/armor4_03.png',
        'equipments/armor6_04.png',
        'equipments/armor7_01.png',
        'equipments/armor1.png',
        'equipments/boots1_01.png',
        'equipments/boots3_02.png',
        'equipments/bow6_03.png',
        'equipments/bracelet_02.png',
        'equipments/cloak3_03.png',
        'equipments/crown01_01.png',
        'equipments/clothes11_03.png',
        'equipments/circlet.png',
        'equipments/greave2_01.png',
        'equipments/greave1_02.png',
        'equipments/greave1_04.png',
        'equipments/gauntlet_02.png',
        'equipments/gauntlet_01.png',
        'equipments/gauntlet_03.png',
        'equipments/helm4.png',
        'equipments/helm5_02.png',
        'equipments/helm5_04.png',
        'equipments/helm6_01.png',
        'equipments/helm1_01.png',
        'equipments/helm3_03.png',
        'equipments/katana.png',
        'equipments/kukri2_02.png',
        'equipments/ninjahood2_01.png',
        'equipments/ninjatou_01.png',
        'equipments/ninjaclothes_01.png',
        'equipments/ninjasocks_01.png',
        'equipments/gloves1_04.png',
        'equipments/gloves1_01.png',
        'equipments/gloves1_01.png',
        'equipments/gloves2.png',
        'equipments/ring2.png',
        'equipments/shuriken1.png',
        'equipments/sword12_01.png',
        'equipments/sword05.png',
        'equipments/treasure05_04.png',
        'equipments/treasure07_02.png',
        'equipments/weapon03_01.png',
        'equipments/weapon04_03.png',
        'equipments/weapon08_03.png',
        'equipments/weapon11_01.png',
        'equipments/weapon12_03.png',
        'equipments/weapon15_03.png',
    ],
    Items: [
        'items/potion1_01.png',
        'items/potion1_05.png',
        'items/potion2_02.png',
        'items/potion2_03.png',
        'items/potion3_01.png',
        'items/potion3_04.png',
        'items/aphrodisiac_01.png',
        'items/powder_04.png',
        'items/testtube_02.png',
        'items/testtube_04.png',
        'items/testtube_05.png',
        'items/supertesttube.png'
    ],
    ItemList: [
        'greatHpPotion',
        'greatFpPotion',
        'highHpPotion',
        'highFpPotion',
        'hpPotion',
        'fpPotion',
        'nectar',
        'curePowder',
        'attackUp',
        'criticalUp',
        'dvUp',
        'aronBeta'
    ],
    ItemNumberAndItemName: {
        'item_1_number': 'hpPotion',
        'item_2_number': 'highHpPotion',
        'item_3_number': 'greatHpPotion',
        'item_4_number': 'fpPotion',
        'item_5_number': 'highFpPotion',
        'item_6_number': 'greatFpPotion',
        'item_7_number': 'nectar',
        'item_8_number': 'curePowder',
        'item_9_number': 'dvUp',
        'item_10_number': 'attackUp',
        'item_11_number': 'criticalUp',
        'item_12_number': 'aronBeta'
    },
    VolumeBars: [
        'ui/sound_option/volume_bar_0.png',
        'ui/sound_option/volume_bar_1.png',
        'ui/sound_option/volume_bar_2.png',
        'ui/sound_option/volume_bar_3.png',
        'ui/sound_option/volume_bar_4.png',
        'ui/sound_option/volume_bar_5.png',
        'ui/sound_option/volume_bar_6.png',
        'ui/sound_option/volume_bar_7.png',
        'ui/sound_option/volume_bar_8.png',
        'ui/sound_option/volume_bar_9.png',
        'ui/sound_option/volume_bar_10.png',
    ],
    Audio: {
        Bgm: {
            TitleBgm: 'audio/title_bgm.mp3',
            TalkBgm: 'audio/talk_scene_bgm.mp3',
            BossBgm: 'audio/boss_bgm.mp3'
        },
        Se: {
            ShowNextText: 'audio/next_text.mp3',
            OptionTap: 'audio/option_tap.mp3',
            OptionTap2: 'audio/option_tap2.mp3',
            OptionTap3: 'audio/option_tap3.mp3',
            Equip: 'audio/equip.mp3',
            minus: 'audio/minus.mp3',
            plus: 'audio/plus.mp3',
            Hit: 'audio/hit.mp3',
            Guard: 'audio/guard.mp3',
            AllGuard: 'audio/all_guard.mp3',
            HpRecover: 'audio/hp_recover.mp3',
            FpRecover: 'audio/fp_recover.mp3',
            FullRecover: 'audio/full_recover.mp3',
            Cure: 'audio/cure.mp3',
            StatusUp: 'audio/status_up.mp3',
            NormalAttack: 'audio/normal_attack.mp3',
            PlayerSkill2: 'audio/player_skill_2.mp3',
            PlayerSkill3: 'audio/player_skill_3.mp3',
            PlayerSkill4: 'audio/player_skill_4.mp3',
            PlayerSkill6: 'audio/player_skill_6.mp3',
            BossSkill_2: 'audio/boss_skill_2.mp3',
            SpecialMove1: 'audio/special_move_1.mp3',
            SpecialMove2: 'audio/special_move_2.mp3',
            MagicTool1: 'audio/magic_tool_1.mp3',
            MagicTool2: 'audio/magic_tool_2.mp3',
            MagicTool3: 'audio/magic_tool_3.mp3'
        }
    },
    FontFamily: {
        Default: 'MPLUS1p-Regular'
    },
    MaxFrameIndex: (resourceKey: string): number => {
        const json = GameManager.game.loader.resources[resourceKey];
        if(!json || !json.data || !json.data.frames) return -1;
        return Object.keys(json.data.frames).length;
    }
});

export default Resource;