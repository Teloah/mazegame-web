"use strict"

var canvasGame = document.getElementById("background"),
	contextGame = canvasGame.getContext("2d"),
	img = {
		bricks: 2,
		darkbricks: 28,
		ground: 54
	},
	imgSprites = new Image();
imgSprites.src = "images/sprites.png";
imgSprites.addEventListener("load", init, false);

function init() {
	// contextGame.globalAlpha = 0.5;
	paintImageRow("darkbricks", 0, 720, 0);
	paintImageColumn("darkbricks", 24, 480 - 24, 0);
	paintImageColumn("darkbricks", 24, 480 - 24, 720 - 24);
	paintImageRow("darkbricks", 0, 720, 480 - 24);
	
	fillImageRect("ground", 24, 24, 720 - 24, 480 - 24);
	
	console.log("initialized");
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
	contextGame.drawImage(imgSprites, img[sprite], 2, 24, 24, x, y, 24, 24);
}

function fillImageRect(sprite, x1, y1, x2, y2) {
	for (var x = x1; x < x2; x += 24) {
		for (var y = y1; y < y2; y += 24) {
			paintImage(sprite, x, y);
		}
	}
}