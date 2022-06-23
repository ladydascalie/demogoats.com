Array.prototype.random = function () {
	return this[Math.floor((Math.random() * this.length))];
}

function randomBetween(min, max) {
	return Math.random() * (max - min) + min;
}

function delay(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function preload(url) {
	var img = new Image();
	img.src = url;
	return img;
}

class Goat {
	constructor() {
		this.element = document.getElementById("goat");
	}
	walk() {
		// get the goat's starting position.
		var rect = this.element.getBoundingClientRect();
		var goatStartingPosition = rect.left;
		var goatWidth = rect.width;

		// get the width of the window.
		var windowWidth = window.innerWidth;

		// get the direction of travel.
		var direction = ['right', 'left'].random();

		var num;

		switch (direction) {
			case "right":
				this.element.style.transform = "scaleX(-1)";
				num = randomBetween(goatStartingPosition, windowWidth - goatWidth)
				break;
			case "left":
				this.element.style.transform = "";
				num = randomBetween(0, goatStartingPosition);
				break;
		}

		console.log(direction, num);


		var milliseconds = 5;

		// mark that the goat is currently walking;
		this.walking = true;
		(async function (parent) {
			// going right, increment.
			if (direction === "right") {
				for (let i = goatStartingPosition; i < num; i++) {
					if (parent.dead) { return }
					parent.element.style.left = i + "px";
					await delay(milliseconds);
				}
				return
			}
			// going left, decrement.
			for (let i = goatStartingPosition; i > num; i--) {
				if (parent.dead) { return }
				parent.element.style.left = i + "px";
				await delay(milliseconds);
			}
		})(this).then(() => {
			this.walking = false;
		})
	}
}

// TODO: Use an atlas, don't be a fucking pig.
var atlas = {
	goatSkeleton: "/assets/goat-skeleton.png",
	goat: "/assets/goat.png"
}

// we'll use those in a minute.
preload("/assets/goat-skeleton.png");
preload("/assets/goat.png");

var thunder = new Audio("/assets/thunder.mp3");

var intervalId;

// no actual goats were harmed in the making of this temple.
var bolt = document.getElementById("bolt");
var btn = document.getElementById("sacrifice-btn");
btn.addEventListener("click", () => {
	clearInterval(intervalId);
	goat.dead = true;
	goat.element.setAttribute("src", "/assets/goat.png")

	// play the thunderclap, but make sure it plays again if user spams.
	thunder.currentTime = 0;
	thunder.play();

	var rect = goat.element.getBoundingClientRect();

	(async function () {
		for (let i = 0; i < 5; i++) {
			if (i % 3) {
				bolt.style.display = "inline";
				bolt.style.top = -(rect.top + rect.height / 2) + "px";
				bolt.style.left = (rect.left + rect.width / 2) + "px";
				// goat.element.style.filter = "invert(100%)";
				goat.element.setAttribute("src", "/assets/goat-skeleton.png");
			} else {
				// goat.element.style.filter = "invert(0%)";
				goat.element.setAttribute("src", "/assets/goat.png");
			}
			await delay(50);
		}
		bolt.style.display = "none";
		goat.element.setAttribute("src", "/assets/goat.png");
	})()

	goat.element.style.transform = "scaleY(-1)";
	goat.element.style.top = (rect.height / 4) + "px"
});

// capra hircus: deploy!
var goat = new Goat();
intervalId = setInterval(() => {
	if (!goat.walking || goat.dead) {
		goat.walk();
	}
}, 1000)

