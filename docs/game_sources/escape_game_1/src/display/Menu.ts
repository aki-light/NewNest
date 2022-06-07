import * as PIXI from 'pixi.js';
import Resource from '../Resources';
import UpdateObject from '../interfaces/UpdateObject';
import GameManager from '../managers/GameManager';
import OptionButton from './OptionButton';
import ItemPanel from './ItemPanel';
import OptionType from '../enum/OptionType';
import Delegate from '../interfaces/Delegate';
import SoundManager from '../managers/SoundManager';
import Items from '../enum/Items';

export default class Menu extends PIXI.Container implements UpdateObject {
        public static readonly menuMoveFrame: number = 10;
        private menuBar: PIXI.Sprite;
        private menuButton: PIXI.Sprite;
        public static get resourceList(): string[] {
            return [
                Resource.UI.MenuBar, Resource.UI.MenuButton,
                Resource.UI.ItemPanelFrame
            ];
        }
        private menuMoveRate!: number;
        private isOpen: boolean = false;
        private menuOptionButtons: OptionButton[] = [];
        private itemPanels: Map<number, ItemPanel> = new Map();
        private itemPanelFrame: PIXI.Sprite;
        private texts: Map<string, PIXI.Text | OptionButton> = new Map();
        private messageWindow: PIXI.Sprite;
        private delegate: Delegate;
        private optionButtons: Map<string, OptionButton> = new Map();
        private soundOption: PIXI.Container;

        constructor(optionButtons: OptionButton[], itemPanels: ItemPanel[], soundOption: PIXI.Container,
                    texts: Map<string, PIXI.Text | OptionButton>, delegate: Delegate) {
            super();
            
            this.delegate = delegate;
            this.menuOptionButtons = optionButtons;
            this.texts = texts;
            this.soundOption = soundOption;

            texts.forEach((value, key) => {
                if(value instanceof OptionButton) {
                    this.optionButtons.set(key, value);
                }
            });
          
            const menuBarTexture = PIXI.utils.TextureCache[Resource.UI.MenuBar];
            const menuButtonTexture = PIXI.utils.TextureCache[Resource.UI.MenuButton];
            const itemPanelFrameTexture = PIXI.utils.TextureCache[Resource.UI.ItemPanelFrame];
            const windowTexture = PIXI.utils.TextureCache[Resource.UI.MessageWindow];
            this.menuBar = new PIXI.Sprite(menuBarTexture);
            this.menuButton = new PIXI.Sprite(menuButtonTexture);
            this.itemPanelFrame = new PIXI.Sprite(itemPanelFrameTexture);
            this.messageWindow = new PIXI.Sprite(windowTexture);

            this.initMenuBarAndMenuButton();
            this.initItemPanelFrameAndItemPanels(itemPanels);
            this.initMessageWindow(texts);
        }

        private initMessageWindow(texts: Map<string, PIXI.Text | OptionButton>): void {
            texts.forEach((value, key) => {
                if(!(value instanceof PIXI.Text)) {
                    value.on('pointertap', () => {
                        this.onOptionButtonTapped(value);
                    });
                }
            });

            this.messageWindow.scale.set((GameManager.game.view.width * (4 / 5) + 20) / this.messageWindow.width,
                                         (GameManager.game.view.height / 6) / this.messageWindow.height)
            this.messageWindow.anchor.set(0.5, 0.5);
            this.messageWindow.position.x = 367;

            texts.forEach((value, key) => {
                value.visible = false;
                this.messageWindow.addChild(value);
            });
            
            this.messageWindow.visible = false;
            this.addChild(this.messageWindow);
        }

        private initItemPanelFrameAndItemPanels(itemPanels: ItemPanel[]): void {
            this.itemPanelFrame.scale.set((GameManager.game.view.width * (4 / 5) + 20) / this.itemPanelFrame.width,
                                          (GameManager.game.view.height / 4 + 30) / this.itemPanelFrame.height)
            this.itemPanelFrame.position.set(100, 10);

            for(const item of itemPanels) {
                item.on('pointertap', () => {
                    this.onItemPanelTapped(item);
                });

                this.itemPanels.set(item.itemType, item);
                
                item.scale.set(((this.itemPanelFrame.texture.width - 8) / 6) / item.width,
                               (this.itemPanelFrame.texture.height / 2 - 5) / item.height);
                
                this.itemPanelFrame.addChild(item);
            }

            this.itemPanelFrame.visible = false;
            this.addChild(this.itemPanelFrame); 
        }

        private initMenuBarAndMenuButton(): void {
            this.menuButton.interactive = true;
            this.menuButton.on('pointertap', () => {
                this.onMenuButtonTapped();
            });
            this.menuBar.scale.set((GameManager.game.view.width / 7) / this.menuBar.width,
                                (GameManager.game.view.height / 2) / this.menuBar.height);
            this.menuButton.scale.set((this.menuBar.width) / this.menuButton.width,
                                   (this.menuBar.height / 6) / this.menuButton.height)
            this.menuBar.scale.y = (GameManager.game.view.height / 2 - this.menuButton.height) /
                                 this.menuBar.texture.height;
            this.menuBar.position.y = this.menuButton.height;
            this.menuMoveRate = this.menuBar.width / Menu.menuMoveFrame;
            this.menuBar.addChild(this.menuButton);
            for(const optionButton of this.menuOptionButtons) {
                optionButton.on('pointertap', () => {
                    this.onMenuOptionButtonTapped(optionButton);
                });
                optionButton.position.x = this.menuBar.texture.width / 2;
                optionButton.interactive = true;
                this.menuBar.addChild(optionButton);
            }
            this.addChild(this.menuBar);
            this.addChild(this.menuButton);
        }

        public isDestroyed(): boolean {
            return this._destroyed;
        }

        public update(_delta: number): void {
            if(this.isDestroyed()) return;
            
            if(this.isOpen && this.menuBar.position.x < 0) {
                this.menuBar.position.x += this.menuMoveRate;
            }
            if(!this.isOpen && this.menuBar.position.x > -this.menuBar.width) {
                this.menuBar.position.x -= this.menuMoveRate;
            } 
            
        }

        public updateItemPanels(itemTypes: number[]): void {
            this.itemPanels.forEach((value, key) => {
                value.removeItem();
            });

            for(const itemType of itemTypes) {
                if(itemType === Items.FROZEN_BANANA) {
                    const panel = this.itemPanels.get(Items.BANANA);
                    if(!panel) continue;
                    panel.hasItem = true;
                    const texture = PIXI.utils.TextureCache[Resource.Dynamic.items(Items.FROZEN_BANANA)];
                    panel.optionButton.texture = texture;
                    panel.itemType = Items.FROZEN_BANANA;
                    panel.itemTextId = 'frozen_banana_text';
                    panel.optionId = 'use_frozen_banana'
                }
                if(itemType === Items.SHARPENED_PENCIL) {
                    const panel = this.itemPanels.get(Items.PENCIL);
                    if(!panel) continue;
                    panel.hasItem = true;
                    const texture = PIXI.utils.TextureCache[Resource.Dynamic.items(Items.SHARPENED_PENCIL)];
                    panel.optionButton.texture = texture;
                    panel.itemType = Items.SHARPENED_PENCIL;
                    panel.itemTextId = 'sharpened_pencil_text';
                    panel.optionId = 'use_sharpened_pencil'
                }

                const itemPanel = this.itemPanels.get(itemType);
                if(!itemPanel) continue;
                itemPanel.addItem();
            }
        }

        private onOptionButtonTapped(optionButton: OptionButton): void {
            SoundManager.playSe(Resource.Audio.Se.OptionTap);
            if(optionButton.isActive) {
                if(optionButton.optionType === OptionType.DoNoting) {
                    this.messageWindow.visible = false;
                    this.menuOptionButtons.forEach((value, key) => {
                        value.deactivate();
                    });
                }
                this.delegate.onOptionSelected(optionButton.optionType);
            } else {
                this.optionButtons.forEach((value, key) => {
                    value.deactivate();
                });
                optionButton.activate();
            }
        }

        private onItemPanelTapped(itemPanel: ItemPanel): void {
            SoundManager.playSe(Resource.Audio.Se.OptionTap);
            this.itemPanels.forEach((value, key) => {
                value.deactivate();
            });
            this.texts.forEach((value, key) => {
                value.visible = false;
            });
            this.messageWindow.visible = false;
            itemPanel.activate();
            if(itemPanel.hasItem) {
                const text = this.texts.get(itemPanel.itemTextId);
                if(!text) return;
                this.messageWindow.position.y = 260;
                this.messageWindow.visible = true;
                text.visible = true;
            }
        }

        private onMenuOptionButtonTapped(menuOptionButton: OptionButton): void {
            SoundManager.playSe(Resource.Audio.Se.OptionTap);
            if(menuOptionButton.isActive) {
                menuOptionButton.deactivate();
                this.toggleDisplay(menuOptionButton.optionType, false);
            } else {
                this.menuOptionButtons.forEach((value, key) => {
                    value.deactivate();
                    this.toggleDisplay(value.optionType, false);
                });
                this.toggleDisplay(menuOptionButton.optionType, true);
                menuOptionButton.activate();
            }
        }
        
        private onMenuButtonTapped(): void {
            SoundManager.playSe(Resource.Audio.Se.OptionTap);
            this.isOpen = !this.isOpen;
            if(!this.isOpen) {
                this.menuOptionButtons.forEach((value, key) => {
                    value.deactivate();
                    this.toggleDisplay(value.optionType, false);
                });
                this.itemPanels.forEach((value, key) => {
                    value.deactivate();
                });
                this.texts.forEach((value, key) => {
                    value.visible = false;
                });
                this.messageWindow.visible = false;
            } 
        }

        private toggleDisplay(optionType: number | undefined, visible: boolean) {
            if(optionType === OptionType.ShowItems) {
                this.itemPanelFrame.visible = visible;
                
                if(!visible) {
                    this.itemPanels.forEach((value, key) => {
                        value.deactivate();
                    });
                    this.texts.forEach((value, key) => {
                        value.visible = false;
                        if(value instanceof OptionButton) {
                            value.deactivate();
                        }
                    });
                    this.messageWindow.visible = false;
                }
            }

            if(optionType === OptionType.ShowBackToTitle) {
                this.messageWindow.position.y = 270;
                this.messageWindow.visible = visible;
                const textOption1 = this.texts.get(Resource.MessageIds.BackToTitle);
                const textOption2 = this.texts.get(Resource.MessageIds.ContinueGame);
                if(!textOption1) return;
                if(!textOption2) return;
                textOption1.visible = visible;
                if(textOption1 instanceof OptionButton) {
                    textOption1.activate();
                }
                textOption2.visible = visible;
            }

            if(optionType === OptionType.ShowSoundVolume) {
                this.soundOption.visible = visible;
            }
        }
    }