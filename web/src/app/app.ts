import { Component, inject, viewChild } from '@angular/core';
import { GameLauncher } from './core/game-launcher';
import { MainMenu } from '../game/scenes/MainMenu';
import { CommonModule } from '@angular/common';
import { EventQueue } from '../game/event-queue';
import { TitleController } from '@core/title';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.html',
})
export class App {
    titleController = inject(TitleController);
    public spritePosition = { x: 0, y: 0 };
    public canMoveSprite = false;

    // New way to get the component instance
    phaserRef = viewChild.required(GameLauncher);

    constructor() {
        this.titleController.update('loading', '...');
        // You can now safely set up your EventBus subscriptions here
        EventQueue.on('current-scene-ready', (scene: Phaser.Scene) => {
            this.canMoveSprite = scene.scene.key !== 'MainMenu';
        });
    }

    // public changeScene() {
    //     const scene = this.phaserRef().scene as MainMenu;
    //     if (scene) {
    //         scene.changeScene();
    //     }
    // }

    // public moveSprite() {
    //     const scene = this.phaserRef().scene as MainMenu;
    //     if (scene) {
    //         scene.moveLogo(({ x, y }) => {
    //             this.spritePosition = { x, y };
    //         });
    //     }
    // }

    // public addSprite() {
    //     const scene = this.phaserRef().scene;
    //     if (scene) {
    //         const x = Phaser.Math.Between(64, scene.scale.width - 64);
    //         const y = Phaser.Math.Between(64, scene.scale.height - 64);

    //         const star = scene.add.sprite(x, y, 'star');

    //         scene.add.tween({
    //             targets: star,
    //             duration: 500 + Math.random() * 1000,
    //             alpha: 0,
    //             yoyo: true,
    //             repeat: -1,
    //         });
    //     }
    // }
}
