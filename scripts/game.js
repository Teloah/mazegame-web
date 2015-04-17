"use strict"

var canvasGame = document.getElementById("background"),
		contextGame = canvasGame.getContext("2d"),
		imgPositions = {
			bricks: 2,
			darkbricks: 28,
			ground: 54
		},
		imgSprites = new Image();
imgSprites.src = "images/sprites.png";
imgSprites.addEventListener("load", init, false);

function init() {
	// contextGame.globalAlpha = 0.5;
	paintImageRow(imgPositions.darkbricks, 0, 720, 0);
	paintImageColumn(imgPositions.darkbricks, 24, 480 - 24, 0);
	paintImageColumn(imgPositions.darkbricks, 24, 480 - 24, 720 - 24);
	paintImageRow(imgPositions.darkbricks, 0, 720, 480 - 24);
	
	fillImageRect(imgPositions.ground, 24, 24, 720 - 24, 480 - 24);
	
	console.log("initialized");
}

function paintImageRow(position, start, end, y) {
	for (var x = start; x < end; x += 24) {
		paintImage(position, x, y);
	}
}

function paintImageColumn(position, start, end, x) {
	for (var y = start; y < end; y += 24) {
		paintImage(position, x, y);
	}
}

function paintImage(spritePos, x, y) {
	contextGame.drawImage(imgSprites, spritePos, 2, 24, 24, x, y, 24, 24);
}

function fillImageRect(spritePos, x1, y1, x2, y2) {
	for (var x = x1; x < x2; x += 24) {
		for (var y = y1; y < y2; y += 24) {
			paintImage(spritePos, x, y);
		}
	}
}