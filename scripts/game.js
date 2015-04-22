"use strict"

var canvasGame = document.getElementById("maingame"),
	contextGame = canvasGame.getContext("2d"),
	gfx_bricks = {
		left: 2,
		width: 24
	},
	gfx_darkbricks = {
		left: 28,
		width: 24
	},
	gfx_door = {
		left: 54,
		width: 24
	},
	gfx_ground = {
		left: 80,
		width: 24
	},
	gfx_key = {
		left: 106,
		width: 13
	},
	gfx_zombie = {
		left: 123,
		width: 16
	},
	gfx_player = {
		left: 142,
		width: 15
	},
	gfx_box = {
		left: 160,
		width: 15
	},
	lastLoopTime = new Date(),
	elapsedSecs = 0,
	requestAnimFrame = window.requestAnimationFrame,
	frames = 0,
	lastFrames = 0,
	imgSprites = new Image();
imgSprites.src = "images/sprites.png";
imgSprites.onload = init;

function init() {
	// contextGame.globalAlpha = 0.5;
	requestAnimFrame(gameLoop);
	console.log("initialized");
}

function paintBorders() {
	paintImageRow(gfx_darkbricks, 0, 720, 0);
	paintImageColumn(gfx_darkbricks, 24, 480 - 24, 0);
	paintImageColumn(gfx_darkbricks, 24, 480 - 24, 720 - 24);
	paintImageRow(gfx_darkbricks, 0, 720, 480 - 24);
	paintImage(gfx_door, 0, 24);
	
	fillImageRect(gfx_ground, 24, 24, 720 - 24, 480 - 24);
	paintImage(gfx_player, 24, 24);
}

function gameLoop() {
	contextGame.clearRect(0, 0, canvasGame.width, canvasGame.height);
	paintBorders();
	paintElapsedTime();
	requestAnimFrame(gameLoop);
}

function paintElapsedTime() {
	var tickTime = new Date();
	if (tickTime - lastLoopTime > 1000) {
		lastFrames = frames;
		frames = 0;
		lastLoopTime = tickTime;
		elapsedSecs++;
	}
	frames++;
	contextGame.font = "30px Verdana";
	contextGame.fillText(elapsedSecs.toString(), 24, canvasGame.height - 24);
	contextGame.font = "15px Verdana";
	contextGame.fillText(lastFrames.toString(), 24, canvasGame.height - 50);
}
function paintImageRow(sprite, start, end, y) {
	for (var x = start; x < end; x += 24) {
		paintImage(sprite, x, y);
	}
}

function paintImageColumn(sprite, start, end, x) {
	for (var y = start; y < end; y += 24) {
		paintImage(sprite, x, y);
	}
}

function paintImage(sprite, x, y) {
	contextGame.drawImage(imgSprites, sprite.left, 2, sprite.width, 24, x, y, sprite.width, 24);
}

function fillImageRect(sprite, x1, y1, x2, y2) {
	for (var x = x1; x < x2; x += 24) {
		for (var y = y1; y < y2; y += 24) {
			paintImage(sprite, x, y);
		}
	}
}
