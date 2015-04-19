"use strict"

var canvasGame = document.getElementById("maingame"),
	contextGame = canvasGame.getContext("2d"),
	img = {
		bricks: 2,
		darkbricks: 28,
		door: 54,
		ground: 80,
		key: 106,
		zombie: 123,
		player: 142,
		box: 160
	},
	img_width = {
		bricks: 24,
		darkbricks: 24,
		door: 24,
		ground: 24,
		key: 13,
		zombie: 16,
		player: 15,
		box: 15
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
	paintImageRow("darkbricks", 0, 720, 0);
	paintImageColumn("darkbricks", 24, 480 - 24, 0);
	paintImageColumn("darkbricks", 24, 480 - 24, 720 - 24);
	paintImageRow("darkbricks", 0, 720, 480 - 24);
	paintImage("door", 0, 24);
	
	fillImageRect("ground", 24, 24, 720 - 24, 480 - 24);
	paintImage("player", 24, 24);
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
	contextGame.drawImage(imgSprites, img[sprite], 2, img_width[sprite], 24, x, y, img_width[sprite], 24);
}

function fillImageRect(sprite, x1, y1, x2, y2) {
	for (var x = x1; x < x2; x += 24) {
		for (var y = y1; y < y2; y += 24) {
			paintImage(sprite, x, y);
		}
	}
}