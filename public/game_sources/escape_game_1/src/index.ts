import GameManager from './managers/GameManager';
import StartScene from './scenes/StartScene';
import * as WebFont from 'webfontloader';
import Resource from './Resources';
import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export default class StartGame {
    public static startGame(): void {
        WebFont.load({
            custom: {
                families: [
                    Resource.FontFamily.Default
                ],
                urls: [`${publicRuntimeConfig.staticFolder}/font.css`]
            },
            active: () => {
              
               StartGame.initGame();
            },
            timeout: 15000
        });
    }

    private static initGame() {
        GameManager.start({
            width: 640,
            height: 640,
            backgroundColor: 0x000000
        });
        GameManager.loadScene(new StartScene());
    }
}