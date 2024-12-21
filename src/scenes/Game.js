import Phaser from '../lib/phaser.js'
import Carrot from '../game/Carrot.js'
import { GlobalTextStyle } from '../styles.js'

export default class Game extends Phaser.Scene
{
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    /** @type {Phaser.Physics.Arcade.Group} */
    carrots

    carrotsCollected = 0
    bestScore = 0

    /** @type {Phaser.GameObjects.Text} */
    carrotsCollectedText

    /** @type {Phaser.GameObjects.Text} */
    bestScoreText

    /** @type {Phaser.GameObjects.Text} */
    pauseText

    /** @type {Phaser.GameObjects.Text} */
    restartButton

    /** @type {Phaser.GameObjects.Text} */
    menuButton

    /** @type {boolean} */
    isPaused = false

    /** @type {Phaser.GameObjects.Rectangle} */
    pauseBackground

    constructor()
    {
        super('game')
    }

    init()
    {
        this.carrotsCollected = 0
    }

    preload()
    {
        this.load.html('font-style', 'index.html');
        this.load.image('background', 'assets/bg_layer1.png')
        this.load.image('platform', 'assets/ground_cake.png')
        this.load.image('bunny-stand', 'assets/bunny1_stand.png')
        this.load.image('bunny-jump', 'assets/bunny1_jump.png')
        this.load.image('carrot', 'assets/carrot.png')

        this.load.audio('jump', 'assets/sfx/phaseJump1.wav')

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create()
    {
        const width = this.scale.width
        const height = this.scale.height

        this.add.image(width * 0.5, height * 0.5, 'background')
            .setScrollFactor(1, 0)

        this.platforms = this.physics.add.staticGroup()

        for (let i = 0; i < 5; ++i)
        {
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x, y, 'platform')
            platform.scale = 0.5

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()
        }

        this.player = this.physics.add.sprite(240, 320, 'bunny-stand')
            .setScale(0.5)

        this.physics.add.collider(this.platforms, this.player)

        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false

        this.cameras.main.startFollow(this.player)
        this.cameras.main.setDeadzone(this.scale.width * 1.5)

        this.carrots = this.physics.add.group({
            classType: Carrot
        })

        this.physics.add.collider(this.platforms, this.carrots)
        this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this)

        this.carrotsCollectedText = this.add.text(240, 10, 'Морковки: 0', { color: '#000', fontSize: 24 })
            .setScrollFactor(0)
            .setOrigin(0.5, 0)

        const savedBestScore = localStorage.getItem('bestScore')
        if (savedBestScore) {
            this.bestScore = parseInt(savedBestScore, 10)
        }

        this.bestScoreText = this.add.text(240, 40, `Лучший: ${this.bestScore}`, { color: '#000', fontSize: 24 })
            .setScrollFactor(0)
            .setOrigin(0.5, 0)

        this.pauseBackground = this.add.rectangle(width * 0.5, height * 0.5, width, height, 0x000000, 0.5)
            .setOrigin(0.5)
            .setVisible(false)
			.setScrollFactor(0)

        this.pauseText = this.add.text(width * 0.5, height * 0.5, 'Пауза', {
            fontSize: 48,
            color: '#ff0000'
        }).setOrigin(0.5).setVisible(false)

        this.restartButton = this.add.text(width * 0.5, height * 0.6, 'Перезапуск', {
            fontSize: 32,
            color: '#ffffff'
        }).setOrigin(0.5).setVisible(false).setInteractive()
        this.restartButton.on('pointerdown', () => {
            this.scene.restart()
        })

		this.restartButton.on('pointerover', () => {
            this.restartButton.setStyle({ color: '#ff0' })
        })
        
        this.restartButton.on('pointerout', () => {
            this.restartButton.setStyle({ color: '#ffffff' })
        })

        // Main Menu Button
        this.menuButton = this.add.text(width * 0.5, height * 0.7, 'В меню', {
            fontSize: 32,
            color: '#ffffff'
        }).setOrigin(0.5).setVisible(false).setInteractive()
        this.menuButton.on('pointerdown', () => {
            this.scene.start('main-menu')
        })

		this.menuButton.on('pointerover', () => {
            this.menuButton.setStyle({ color: '#ff0' })
        })
        
        this.menuButton.on('pointerout', () => {
            this.menuButton.setStyle({ color: '#ffffff' })
        })

        this.input.keyboard.on('keydown-ESC', () => {
            if (this.isPaused) {
                this.resumeGame()
            } else {
                this.pauseGame()
            }
        })
    }

    update(t, dt)
    {
        if (this.isPaused) {
            this.pauseText.setPosition(this.cameras.main.worldView.centerX, this.cameras.main.worldView.centerY)
            this.restartButton.setPosition(this.cameras.main.worldView.centerX, this.cameras.main.worldView.centerY + 50)
            this.menuButton.setPosition(this.cameras.main.worldView.centerX, this.cameras.main.worldView.centerY + 100)
        }

        if (!this.player)
        {
            return
        }

        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child

            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 700)
            {
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()
                this.addCarrotAbove(platform)
            }
        })

        const touchingDown = this.player.body.touching.down

        if (touchingDown)
        {
            this.player.setVelocityY(-470)
            this.player.setTexture('bunny-jump')

            this.sound.play('jump', {volume: 0.2});
        }

        const vy = this.player.body.velocity.y
        if (vy > 0 && this.player.texture.key !== 'bunny-stand')
        {
            this.player.setTexture('bunny-stand')
        }

        if (this.cursors.left.isDown && !touchingDown)
        {
            this.player.setVelocityX(-300)
        }
        else if (this.cursors.right.isDown && !touchingDown)
        {
            this.player.setVelocityX(300)
        }
        else
        {
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)

        const bottomPlatform = this.findBottomMostPlatform()
        if (this.player.y > bottomPlatform.y + 300)
        {
            if (this.carrotsCollected > this.bestScore) {
                this.bestScore = this.carrotsCollected
                localStorage.setItem('bestScore', this.bestScore)
            }

            this.scene.start('game-over', { bestScore: this.bestScore, score: this.carrotsCollected })
        }    
    }

    pauseGame()
    {
        this.isPaused = true
        this.physics.world.pause() 
        this.pauseBackground.setVisible(true)
        this.pauseText.setVisible(true)
        this.restartButton.setVisible(true)
        this.menuButton.setVisible(true)
    }


    resumeGame()
    {
        this.isPaused = false
        this.physics.world.resume()
        this.pauseBackground.setVisible(false)
        this.pauseText.setVisible(false)
        this.restartButton.setVisible(false)
        this.menuButton.setVisible(false)
    }

    /**
     * 
     * @param {Phaser.GameObjects.Sprite} sprite 
     */
    horizontalWrap(sprite)
    {
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprite.x < -halfWidth)
        {
            sprite.x = gameWidth + halfWidth
        }
        else if (sprite.x > gameWidth + halfWidth)
        {
            sprite.x = -halfWidth
        }
    }

    /**
     * 
     * @param {Phaser.GameObjects.Sprite} sprite 
     */
    addCarrotAbove(sprite)
    {
        const y = sprite.y - sprite.displayHeight

        /** @type {Phaser.Physics.Arcade.Sprite} */
        const carrot = this.carrots.get(sprite.x, y, 'carrot')

        carrot.setActive(true)
        carrot.setVisible(true)

        this.add.existing(carrot)

        carrot.body.setSize(carrot.width, carrot.height)

        this.physics.world.enable(carrot)

        return carrot
    }

    /**
     * 
     * @param {Phaser.Physics.Arcade.Sprite} player 
     * @param {Carrot} carrot 
     */
    handleCollectCarrot(player, carrot)
    {
        this.carrots.killAndHide(carrot)

        this.physics.world.disableBody(carrot.body)

        this.carrotsCollected++

        this.carrotsCollectedText.text = `Морковки: ${this.carrotsCollected}`
    }

    findBottomMostPlatform()
    {
        const platforms = this.platforms.getChildren()
        let bottomPlatform = platforms[0]

        for (let i = 1; i < platforms.length; ++i)
        {
            const platform = platforms[i]

            if (platform.y < bottomPlatform.y)
            {
                continue
            }

            bottomPlatform = platform
        }

        return bottomPlatform
    }
}
