import Config from '../Config';
import * as PIXI from 'pixi.js';
import Scene from '../scenes/Scene';
import SoundManager from './SoundManager';
import IndexedDBManager from '../managers/IndexedDBManager';

export default class GameManager {
    public static game: PIXI.Application;
    private static sceneTransitionOutFinished: boolean = true;
    private static currentScene?: Scene;
    private static sceneResourceLoaded: boolean = false;

    public static start(params: {
        width: number,
        height: number,
        backgroundColor?: number
    }): void {
        GameManager.game = new PIXI.Application(params);

        IndexedDBManager.init(
            (_e) => { throw new Error('indexed db could not be initialized'); },
            () => { SoundManager.loadSoundOptionFromDB() }
        );

        SoundManager.init();
        
        const node = document.getElementById('play-game');
        if(!node) return;
        node.appendChild(GameManager.game.view);
        
        GameManager.game.loader.baseUrl = Config.ResourceBaseUrl;
        GameManager.game.ticker.add((delta: number) => {
            GameManager.currentScene?.update(delta);
            SoundManager.update(delta);
        });
        
        GameManager.resizeCanvas();
        window.addEventListener('resize', GameManager.resizeCanvas);
    }

    public static transitionInIfPossible(newScene: Scene): boolean {
        if(!GameManager.sceneResourceLoaded || !GameManager.sceneTransitionOutFinished) {
            return false;
        }

        GameManager.currentScene?.destroy();
        GameManager.currentScene = newScene;

        GameManager.game.stage.addChild(newScene);

        newScene.beginTransitionIn(() => {});
        
        return true;
    }

    public static loadScene(newScene: Scene): void {
        if(GameManager.currentScene) {
            GameManager.sceneResourceLoaded = false;
            GameManager.sceneTransitionOutFinished = false;

            newScene.beginLoadResource(() => {
                GameManager.sceneResourceLoaded = true;
                GameManager.transitionInIfPossible(newScene);
            });

            GameManager.currentScene.beginTransitionOut(() => {
                GameManager.sceneTransitionOutFinished = true;
                GameManager.transitionInIfPossible(newScene);
            });
        } else {
            GameManager.sceneTransitionOutFinished = true;
            newScene.beginLoadResource(() => {
                GameManager.sceneResourceLoaded = true;
                GameManager.transitionInIfPossible(newScene);
            });
        }
    }

    public static resizeCanvas(): void {
        const game = GameManager.game;
        const renderer = game.renderer;
        
        let canvasWidth;
        let canvasHeight;

        const rendererWidthRatio = renderer.width / renderer.height;
        const windowWidthRatio = window.innerWidth / window.innerHeight;

        if(windowWidthRatio > rendererWidthRatio) {
            canvasWidth = window.innerHeight * (renderer.width / renderer.height);
            canvasHeight = window.innerHeight;
        } else {
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerWidth * (renderer.height / renderer.width); 
        }

        if(canvasWidth >= 500 || canvasHeight >= 500) {
            canvasWidth = 500;
            canvasHeight = 500;
        }

        game.view.style.width = `${canvasWidth - 20}px`;
        game.view.style.height = `${canvasHeight - 20}px`;
    }
}