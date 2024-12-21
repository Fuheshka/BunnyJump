import Phaser from '../lib/phaser.js'
import { GlobalTextStyle } from '../styles.js'

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('main-menu')
    }

    preload() {
        this.load.image('main-menu-background1', 'assets/main_bg1.png')
        this.load.image('main-menu-background2', 'assets/main_bg2.png')
        this.load.image('main-menu-background3', 'assets/main_bg3.png')
        this.load.image('main-menu-background4', 'assets/main_bg4.png')
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.image(width * 0.5, height * 0.5, 'main-menu-background1')
            .setScrollFactor(0)
            .setOrigin(0.5)
            .setDisplaySize(width, height);

        this.add.image(width * 0.5, height * 0.5, 'main-menu-background2')
            .setScrollFactor(0)
            .setOrigin(0.5)
            .setDisplaySize(width, height);

        this.add.image(width * 0.5, height * 0.5, 'main-menu-background3')
            .setScrollFactor(0)
            .setOrigin(0.5)
            .setDisplaySize(width, height); 

        this.add.image(width * 0.5, height * 0.5, 'main-menu-background4')
            .setScrollFactor(0)
            .setOrigin(0.5)
            .setDisplaySize(width, height); 

        this.add.text(width * 0.5, height * 0.3, 'Bunny Jump', {
            fontSize: 64,
            color: '#ffffff'
        }).setOrigin(0.5)

        const startButton = this.add.text(width * 0.5, height * 0.5, 'Начать игру', {
            fontSize: 32,
            color: '#ffffff'
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('game')
            })

        startButton.on('pointerover', () => {
            startButton.setStyle({ color: '#ff0' })
        })

        startButton.on('pointerout', () => {
            startButton.setStyle({ color: '#ffffff' })
        })


        const exitButton = this.add.text(width * 0.5, height * 0.6, 'Выход', {
            fontSize: 32,
            color: '#ffffff'
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.game.destroy(true)
            })

        exitButton.on('pointerover', () => {
            exitButton.setStyle({ color: '#ff0' })
        })

        exitButton.on('pointerout', () => {
            exitButton.setStyle({ color: '#ffffff' })
        })

        // Кнопка перехода к настройкам
        // const settingsButton = this.add.text(width * 0.5, height * 0.7, 'Settings', {
        // 	fontSize: 32,
        // 	color: '#ffffff'
        // })
        // .setOrigin(0.5)
        // .setInteractive()
        // .on('pointerdown', () => {
        // 	this.scene.start('settings')
        // })
    }
}
