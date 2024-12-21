import Phaser from '../lib/phaser.js'
import { GlobalTextStyle } from '../styles.js'

export default class GameOver extends Phaser.Scene
{
	constructor()
	{
		super('game-over')
	}

	init(data)
	{
		this.bestScore = data.bestScore || 0
		this.score = data.score || 0
	}

	create()
	{
		const width = this.scale.width
		const height = this.scale.height

		this.add.text(width * 0.5, height * 0.4, 'Конец игры', {
			fontSize: 48,
			color: '#ff0000'
		}).setOrigin(0.5)

		this.add.text(width * 0.5, height * 0.5, `Счёт: ${this.score}`, {
			fontSize: 32,
			color: '#000'
		}).setOrigin(0.5)

		this.add.text(width * 0.5, height * 0.6, `Лучший: ${this.bestScore}`, {
			fontSize: 32,
			color: '#000'
		}).setOrigin(0.5)

		this.input.keyboard.once('keydown-SPACE', () => {
			this.scene.start('game')
		})
	}
}
