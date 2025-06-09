import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import Phaser from 'phaser';
import StartGame from 'game/main';
import { EventQueue } from 'game/event-queue';
import { TitleController } from '@core/title';
import packageJson from '../../../package.json';

@Component({
    selector: 'game',
    template: '<div id="game-container"></div>',
    standalone: true,
})
export class GameLauncher implements OnInit, OnDestroy {
    scene!: Phaser.Scene;
    game!: Phaser.Game;
    sceneCallback!: (scene: Phaser.Scene) => void;
    titleController = inject(TitleController);

    ngOnInit() {
        // 更新頁面標題
        this.titleController.update('the-clock-tower', ' v' + packageJson.version);
        // 初始化遊戲
        this.game = StartGame('game-container');
        // 註冊事件，當遊戲場景準備好時觸發
        EventQueue.on('current-scene-ready', (scene: Phaser.Scene) => {
            this.scene = scene;

            if (this.sceneCallback) {
                this.sceneCallback(scene);
            }
        });
    }

    ngOnDestroy() {
        if (this.game) {
            this.game.destroy(true);
        }
    }
}
