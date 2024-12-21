import Phaser from './lib/phaser.js'

import Game from './scenes/Game.js'
import GameOver from './scenes/GameOver.js'
import MainMenu from './scenes/MainMenu.js'

export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 480,
	height: 640,
	scene: [MainMenu, Game, GameOver],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 500
			},
			debug: false
		}
	}
})
