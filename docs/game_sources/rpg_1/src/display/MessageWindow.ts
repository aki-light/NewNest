import * as PIXI from 'pixi.js';
import Resource from '../Resources';
import UpdateObject from '../interfaces/UpdateObject';
import GameManager from '../managers/GameManager';
import MessageWindowDelegate from '../interfaces/MessageWindowDelegate';
import SoundManager from '../managers/SoundManager';

export default class MessgageWindow extends PIXI.Container implements UpdateObject {
        public static readonly WindowSizeUpFrame: number = 10;
        private window!: PIXI.Sprite;
        public static get resourceList(): string[] {
            return [Resource.UI.MessageWindow];
        }
        private texts: PIXI.Text[]
        private currentTextIndex = 0;
        private windowScaleX!: number;
        private windowScaleY!: number;
        private windowSizeUpRateX!: number;
        private windowSizeUpRateY!: number;
        private delegate: MessageWindowDelegate;

        constructor(texts: (PIXI.Text)[], name: PIXI.Text, delegate: MessageWindowDelegate) {
            super();
            
            this.delegate = delegate;
            this.texts = texts;
            this.initWindow(name);
        }

        private initWindow(name: PIXI.Text): void {
            const windowTexture = PIXI.utils.TextureCache[Resource.UI.MessageWindow];
            this.window = new PIXI.Sprite(windowTexture);
            this.window.interactive = true;
            this.window.on('pointertap', () => {
                this.showNextText();
            });

            this.window.scale.set((GameManager.game.view.width - 20) / this.window.width,
                                (GameManager.game.view.height / 4) / this.window.height);

            this.window.anchor.set(0.5, 0.5);

            this.window.position.set(GameManager.game.view.width / 2,
                                     (GameManager.game.view.height - this.window.height / 2) - 20);

            this.windowScaleX = this.window.scale.x;
            this.windowScaleY = this.window.scale.y;
            this.windowSizeUpRateX = this.windowScaleX / MessgageWindow.WindowSizeUpFrame;
            this.windowSizeUpRateY = this.windowScaleY / MessgageWindow.WindowSizeUpFrame;
    
            this.window.scale.set(0, 0);
            
            this.window.addChild(name);
            this.window.addChild(this.texts[0]);
            
            this.window.buttonMode = true;
            
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

            if(this.currentTextIndex === this.texts.length - 1) {
                this.delegate.onMessageWindowClosed();
                for(const text of this.texts) {
                    text.visible = true;
                }
                this.destroy();
                return;
            }
            
            const currentText = this.texts[this.currentTextIndex];   
            currentText.visible = false;
            
            const nextText = this.texts[++this.currentTextIndex]; 
            this.window.addChild(nextText);
        }

        public addText(text: PIXI.Text, addPosition: number): void {
            this.texts.splice(this.currentTextIndex + addPosition, 0, text);
        }
    }