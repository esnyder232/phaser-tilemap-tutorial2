export default class MainScene extends Phaser.Scene {
	constructor(config) {
		super(config);

		this.controls = {};
		this.marker = {};
		this.shiftKey = false;
		this.groundLayer = {};
	}

	init() {
		console.log('init on ' + this.scene.key + ' start');

	}

	preload() {
		console.log('preload on ' + this.scene.key + ' start');
		
		this.load.image("tiles", "assets/tilesets/0x72-industrial-tileset-32px-extruded.png");
		this.load.tilemapTiledJSON("map", "assets/tilemaps/platformer-simple.json");

	}
	  
	create() {
		console.log('create on ' + this.scene.key + ' start');

		this.map = this.make.tilemap({key: "map"});
		var tiles = this.map.addTilesetImage("0x72-industrial-tileset-32px-extruded", "tiles");
		
		//some setup as static layers
		this.map.createDynamicLayer("Background", tiles);
		this.groundLayer = this.map.createDynamicLayer("Ground", tiles);
		this.map.createDynamicLayer("Foreground", tiles);




		this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

		//setup the arrows to control the cmaera
		this.cursors = this.input.keyboard.createCursorKeys();
		var controlConfig = {
			camera: this.cameras.main,
			left: this.cursors.left,
			right: this.cursors.right,
			up: this.cursors.up,
			down: this.cursors.down,
			speed: 0.5
		}

		this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

		//limit the camera to the map size
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

		//create a simple graphic that can be used to show which tile the mouse is over
		this.marker = this.add.graphics();
		this.marker.lineStyle(5, 0xffffff, 1);
		this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
		this.marker.lineStyle(3, 0xff4f78, 1);
		this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);

		//help text that has a "fixed" position on the screen
		this.add.text(16, 16, "Arrow keys to scroll\nLeft-click to draw tiles\nShift + left-click to erase", 
		{
			font: "18px monospace",
			fill: "#000000",
			padding: {x: 20, y: 10},
			backgroundColor: "#ffffff"
		}).setScrollFactor(0);
	}
	  
	update(timeElapsed, dt) {
		//camera controlls
		this.controls.update(dt);

		//convert the moust position to world position within the camera
		var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
		
		// Place the marker in world space, but snap it to the tile grid. If we convert world -> tile and
		// then tile -> world, we end up with the position of the tile under the pointer
		var pointerTileXY = this.groundLayer.worldToTileXY(worldPoint.x, worldPoint.y);
		
		var snappedWorldPoint = this.groundLayer.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
		this.marker.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);

		//draw or erase tiles (only within the ground layer)
		if(this.input.manager.activePointer.isDown) {
			if(this.shiftKey.isDown) {
				this.groundLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
			} else {
				this.groundLayer.putTileAtWorldXY(353, worldPoint.x, worldPoint.y);
			}
		}

	}
}

