import Phaser from 'phaser';
import GameManagerScene from './scenes/game-manager-scene.js'

export default class App {
	constructor() {
		this.game = {};
		this.config = {};

		this.config = {
			type: Phaser.AUTO,
			backgroundColor: '#1d212d',
			width: 800,
			height:600,
			parent: 'game-div',
			physics: {
				default: 'matter',				
				matter: {
					debug: true,
					gravity: {
						y: 1
					}
				}
			}
		}

		this.game = new Phaser.Game(this.config);
		this.game.scene.add('game-manager-scene', GameManagerScene, true);
	}	
}

//feels like a hacky way to start...oh well. Its simple atleast.
var app = new App();

