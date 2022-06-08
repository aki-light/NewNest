import GameManager from './managers/GameManager';
import StartScene from './scenes/StartScene';

export default class StartGame {
    public static startGame(): void {  
        StartGame.initGame();
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