import Items from "./enum/Items";
import Tiles from "./enum/Tiles";

const Resource = Object.freeze({
    UI: {
        SceneUiGraph: (sceneName: string): string => {
            return `ui_graph/${sceneName}.json`;
        },
        EscapeSceneMessage: 
            'ui_graph/escape_scene_message.json',
        EscapeSceneEnglishMessage: 
            'ui_graph/escape_scene_message_english.json',
        EscapeSceneOption:
            'ui_graph/escape_scene_option.json',
        EscapeSceneEnglishOption:
            'ui_graph/escape_scene_option_english.json',
        EscapeSceneRoomObject:
            'ui_graph/escape_scene_room_object.json',
        Stage:
            'master/stage_master.json', 
        PlayerAnimation:
            'master/player_animation_master.json',
        RoomObjectMaster:
            'master/room_object_master.json',
        Player: 
            'player/player.json',
        TileFrame:
            'stage/tile_frame.png',
        Tiles: [
            'stage/floor.png',
            'stage/wall.png',
            'stage/floor_with_shadow.png'
        ],
        Items: [
            'items/tin_statue.png',
            'items/coin.png',
            'items/banana.png',
            'items/frozen_banana.png',
            'items/salt.png',
            'items/desk_key.png',
            'items/pencil.png',
            'items/sharpened_pencil.png',
            'items/hand_mirror.png',
            'items/detergent.png',
            'items/car_key.png',
            'items/crossbow.png',
            'items/nail.png',
            'items/dvd.png'
        ],
        RoomObjects: [
            'room_object/mirror.png',
            'room_object/chair.png',
            'room_object/pig2.png',
            'room_object/clock_12_00.png'
        ],
        MessageWindow:
            'ui/message_window.png',
        OptionFrame:
            'ui/option_frame.png',
        ItemSelectFrame:
            'ui/item_select_frame.png',
        ItemPanelFrame:
            'ui/item_panel_frame.png',
        MenuBar:
            'ui/menu_bar.png',
        MenuButton:
            'ui/menu_button.png'
    },
    Dynamic: {
        items: (itemType: number): string => {
            switch(itemType) {
                case Items.NOTHING : return 'items/no_item.png';
                case Items.TIN_STATUE : return 'items/tin_statue.png';
                case Items.COIN: return 'items/coin.png';
                case Items.BANANA: return 'items/banana.png';
                case Items.FROZEN_BANANA: return 'items/frozen_banana.png';
                case Items.SALT: return 'items/salt.png';
                case Items.PENCIL: return 'items/pencil.png';
                case Items.SHARPENED_PENCIL: return 'items/sharpened_pencil.png'
                case Items.NAIL: return 'items/nail.png';
                case Items.HAND_MIRROR: return 'items/hand_mirror.png';
                case Items.DVD: return 'items/dvd.png';
                case Items.DETERGENT: return 'items/detergent.png';
                case Items.DESK_KEY: return 'items/desk_key.png';
                case Items.CROSSBOW: return 'items/crossbow.png';
                case Items.CAR_KEY: return 'items/car_key.png';
                default: return '';
            }
        },
        tiles: (tileType: number): string => {
            switch(tileType) {
                case Tiles.NormalFloor: return 'stage/floor.png';
                case Tiles.NormalWall: return 'stage/wall.png';
                case Tiles.TileWithShadow: return 'stage/floor_with_shadow.png' 
               default: return '';
            }
        }
    },
    AnimationTypes: {
        Player: Object.freeze({
            WAIT: 'wait',
            WALKUP: 'walk_up',
            WALKDOWN: 'walk_down',
            WALKLEFT: 'walk_left',
            WALKRIGHT: 'walk_right',
            CHACKUP: 'chack_up',
            CHACKDOWN: 'chack_down',
            CHACKLEFT: 'chack_left',
            CHACKRIGHT: 'chack_right'
        }),
    },
    SoundOptionIds: [
        'sound_option_frame',
        'bgm_volume',
        'se_volume',
        'bgm',
        'se',
        'bgm_volume_up',
        'bgm_volume_down',
        'se_volume_up',
        'se_volume_down'
    ],
    PinPadIds: [
        'pin_pad',
        'code_first',
        'code_second',
        'code_third',
        'pad_cancel',
        'pad_enter',
        'pad_0',
        'pad_1',
        'pad_2',
        'pad_3',
        'pad_4',
        'pad_5',
        'pad_6',
        'pad_7',
        'pad_8',
        'pad_9',
    ],
    MenuOptionIds: [
        'item_bag',
        'return',
        'sound_volume'
    ],
    RoomObjects: {
        TV: 'tv',
        DESK: 'desk',
        DOOR: 'door',
        BED: 'bed',
        GAS_STOVE: 'gas_stove',
        VENDING_MACHINE: 'vending_machine',
        FREEZER: 'freezer',
        CABINET: 'cabinet',
        BARREL: 'barrel',
        GRINDER: 'grinder',
        CAR: 'car',
        BALLOON: 'balloon',
        MIRROR: 'mirror',
        CHAIR: 'chair',
        CLOCK: 'clock',
        PIG: 'pig',
        CLOSET: 'closet',
        SAFE: 'safe',
        BOOK_SHELF: 'book_shelf'
    },
    MessageIds: {
        NothingSpecial: 'nothing_special',
        BackToTitle: 'back_to_title',
        ContinueGame: 'continue_game'  
    },
    Audio: {
        Bgm: {
            EscapeBGM: 'audio/escape_bgm.mp3',
            EndingBGM: 'audio/ending_bgm.mp3',
            TitleBgm: 'audio/title_bgm.mp3'
        },
        Se: {
            ShowNextText: 'audio/show_next_text.mp3',
            OptionTap: 'audio/option_tap.mp3',
            TileTap: 'audio/tile_tap.mp3'
        }
    },
    FontFamily: {
        Default: 'MPLUS1p-Regular'
    },
});

export default Resource;