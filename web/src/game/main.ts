import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game, Scene } from 'phaser';
import { Preloader } from './scenes/Preloader';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    // 畫面大小
    width: '100%',
    height: '100%',
    parent: 'game-container',
    mode: Phaser.Scale.RESIZE,
    backgroundColor: '#028af8', // 和 style.css 中的 --app-color-primary 一致
    // 物理性質
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 0,
                x: 0,
            },
        },
    },
    // 場景設定
    scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
};
// Resize 可以參考 https://medium.com/@tajammalmaqbool11/full-screen-size-and-responsive-game-in-phaser-3-e563c2d60eab
const StartGame = (parent: string) => {
    // 建立 Phaser 遊戲實例
    const game = new Game({ ...config, parent });
    // 監聽網頁方向變化和大小調整事件
    const onChangeScreen = () => {
        game.scale.resize(window.innerWidth, window.innerHeight);
        // 如果當前場景有 resize 方法，則調用它
        if (game.scene.scenes.length > 0) {
            let currentScene = game.scene.scenes[0];
            if (typeof (currentScene as any).resize === 'function') {
                (currentScene as any).resize();
            }
        }
    };
    // 監聽螢幕方向變化
    const _orientation =
        screen.orientation || (screen as any).mozOrientation || (screen as any).msOrientation;
    // 如果螢幕方向變化事件存在，則添加事件監聽器
    _orientation.addEventListener('change', () => {
        onChangeScreen();
    });
    // 監聽螢幕大小調整事件
    window.addEventListener('resize', () => {
        onChangeScreen();
    });

    return game;
};

export default StartGame;
