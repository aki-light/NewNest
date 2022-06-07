import * as PIXI from 'pixi.js';
import Resource from '../Resources';
import UpdateObject from '../interfaces/UpdateObject';
import GameManager from '../managers/GameManager';
import Delegate from '../interfaces/Delegate';
import OptionButton from './OptionButton';
import SoundManager from '../managers/SoundManager';

export default class MessgageWindow extends PIXI.Container implements UpdateObject {
        public static readonly WindowSizeUpFrame: number = 10;
        private window: PIXI.Sprite;
        public static get resourceList(): string[] {
            return [Resource.UI.MessageWindow];
        }
        private textsAndOptions: (PIXI.Text | OptionButton[])[]
        private currentTextIndex = 0;
        private windowScaleX: number;
        private windowScaleY: number;
        private windowSizeUpRateX: number;
        private windowSizeUpRateY: number;
        private delegate: Delegate;

        constructor(textsAndOptions: (PIXI.Text | OptionButton[])[], delegate: Delegate) {
            super();
            
            for(const value of textsAndOptions) {
                if(!(value instanceof PIXI.Text)) {
                    for(const optionButton of value) {
                        optionButton.deactivate();
                        optionButton.on('pointertap', () => {
                            this.onOptionButtonTapped(optionButton);
                        });    
                    }
                    value[0].activate();
                }
            }
            this.delegate = delegate;
            this.textsAndOptions = textsAndOptions;
            const windowTexture = PIXI.utils.TextureCache[Resource.UI.MessageWindow];
            this.window = new PIXI.Sprite(windowTexture);
            this.window.interactive = true;
            this.window.on('pointertap', () => {
                this.showNextText();
            });
            this.window.scale.set((GameManager.game.view.width - 10) / this.window.width,
                                ((GameManager.game.view.height / 3) - 10) / this.window.height);
            this.window.anchor.set(0.5, 0.5);
            this.window.position.set(GameManager.game.view.width / 2,
                                     (GameManager.game.view.height - this.window.height / 2) - 5);
            this.windowScaleX = this.window.scale.x;
            this.windowScaleY = this.window.scale.y;
            this.windowSizeUpRateX = this.windowScaleX / MessgageWindow.WindowSizeUpFrame;
            this.windowSizeUpRateY = this.windowScaleY / MessgageWindow.WindowSizeUpFrame;
    
            this.window.scale.set(0, 0);
            
            if(this.textsAndOptions[0] instanceof PIXI.Text) {
                this.window.addChild(this.textsAndOptions[0]);
            }
            this.addChild(this.window);
        }

        public isDestroyed(): boolean {
            return this._destroyed;
        }

        public update(_delta: number): void {
            if(this.isDestroyed()) return;
            if(this.window.scale.x === this.windowScaleX && this.window.scale.y === this.windowScaleY) {
                return;
            }
            this.window.scale.set(this.window.scale.x + this.windowSizeUpRateX,
                                  this.window.scale.y + this.windowSizeUpRateY);
            if(this.window.scale.x >= this.windowScaleX) {
                this.window.scale.x = this.windowScaleX;
            }
            if(this.window.scale.y >= this.windowScaleY) {
                this.window.scale.y = this.windowScaleY;
            }
        }

        private showNextText(): void {
            SoundManager.playSe(Resource.Audio.Se.ShowNextText);
            this.window.interactive = true;

            if(this.currentTextIndex === this.textsAndOptions.length - 1) {
                this.delegate.onMessageWindowClosed();

                for(const value of this.textsAndOptions) {
                    if(!(value instanceof PIXI.Text)) {
                        for(const optionButton of value) {
                            optionButton.removeListener('pointertap');
                        }
                    }
                }
                this.destroy();
                return;
            }
            
            const currentText = this.textsAndOptions[this.currentTextIndex];
            if(currentText instanceof PIXI.Text) {
                currentText.visible = false;
            } else {
                for(const optionButton of currentText) {
                    optionButton.visible = false;
                }
            }
            
            const nextText = this.textsAndOptions[++this.currentTextIndex];
            if(nextText instanceof PIXI.Text) {
                this.window.addChild(nextText);
            } else {
                this.window.interactive = false;

                if(nextText.length === 2) {
                    nextText[0].position.set(-190, 0);
                    nextText[1].position.set(190, 0);
                } else if(nextText.length === 3) {
                    nextText[0].position.set(-300, 0),
                    nextText[1].position.set(0, 0);
                    nextText[2].position.set(300, 0);
                } else if(nextText.length === 4) {
                    nextText[0].position.set(-190, -35);
                    nextText[1].position.set(-190, 35);
                    nextText[2].position.set(190, -35);
                    nextText[3].position.set(190, 35);
                } else if(nextText.length === 5) {
                    nextText[0].position.set(-300, -35);
                    nextText[1].position.set(-300, 35);
                    nextText[2].position.set(0, -35);
                    nextText[3].position.set(0, 35);
                    nextText[4].position.set(300, -35);
                } else if(nextText.length === 6) {
                    nextText[0].position.set(-300, -35);
                    nextText[1].position.set(-300, 35);
                    nextText[2].position.set(0, -35);
                    nextText[3].position.set(0, 35);
                    nextText[4].position.set(300, -35);
                    nextText[5].position.set(300, 35);
                } else {
                    nextText[0].position.set(0, 0);
                }

                for(const optionButton of nextText) {
                    optionButton.visible = true;
                    this.window.addChild(optionButton);
                }
            }
        }
        
        private onOptionButtonTapped(optionButton: OptionButton): void {
            if(optionButton.isActive) {
                if(optionButton.optionType) {
                    this.delegate.onOptionSelected(optionButton.optionType);
                }
                this.showNextText();
            } else {
                const currnenText = this.textsAndOptions[this.currentTextIndex];
                if(!(currnenText instanceof PIXI.Text)) {
                    for(const option of currnenText) {
                        option.deactivate();
                    }
                }
                SoundManager.playSe(Resource.Audio.Se.OptionTap);
                optionButton.activate();
            }
        }

        public addText(text: PIXI.Text | OptionButton[], addPosition: number): void {
            if(!(text instanceof PIXI.Text)) {
                for(const optionButton of text) {
                    optionButton.removeListener('pointertap');
                    optionButton.deactivate();
                    optionButton.on('pointertap', () => {
                        this.onOptionButtonTapped(optionButton);
                    });    
                }
                text[0].activate();
            }

            this.textsAndOptions.splice(this.currentTextIndex + addPosition, 0, text);
        }
    }