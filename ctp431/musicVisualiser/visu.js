var song
var snowflakes = []


function setup(){
	song = loadSound("song.mp3")
	createCanvas(640, 480)

	amp = new p5.Amplitude()
	//amp.setInput(song)


	//lowPassFilter = new p5.LowPass();
	//song.disconnect()
	//song.connect(lowPassFilter)

	highPassFilter = new p5.HighPass();
	song.disconnect()
	song.connect(highPassFilter)

	fft = new p5.FFT()

	background(200)
}

function mousePressed(){
	if(song.isPlaying()){
		song.pause()
	} else{
		song.play()
	}
}

function draw(){
	background(200)

	var dirY = (mouseY / height - 0.5) * 4;
	var dirX = (mouseX / width - 0.5) * 4;


	var t = frameCount/60

	var rms = amp.getLevel()
	var spectrum = fft.analyze()
	var waveform = fft.waveform()

	if(rms > 0.15){
		for (let flake of snowflakes) {
	 	   flake.bounce(rms) // update snowflake position
		}
	}

	// create a random number of snowflakes each frame
	for (var i = 0; i < random(2); i++) {
		snowflakes.push(new snowflake()); // append snowflake object
	}

	noStroke()
	var c = color("black")
	fill(c)
	// loop through snowflakes with a for..of loop
	for (let flake of snowflakes) {
	    flake.update(t) // update snowflake position
	    flake.display() // draw snowflake
	}
}

var gravity = 3
// snowflake class
function snowflake() {
	// initialize coordinates
	this.posX = 0
	this.posY = 3* height/4 + random(-50, 0)
	this.initialangle = random(0, 2 * PI)
	this.size = random(2, 5)
	this.speedY = pow(this.size, 0.5)
	this.maxSpeedY = 2*pow(this.size, 0.5)
	this.lifeTime = 180

	// radius of snowflake spiral
	// chosen so the snowflakes are uniformly spread out in area
	this.radius = sqrt(random(pow(width / 2, 2)))

	this.update = function(time) {
		// x position follows a circle
		let w = 0.6 // angular speed
		let angle = w * time + this.initialangle
		this.posX = width/2 + this.radius * sin(angle)

		// different size snowflakes fall at slightly different y speeds
		this.posY += this.speedY
		if(this.speedY < this.maxSpeedY){
			this.speedY = min(this.speedY + gravity, this.maxSpeedY)
		}

		// delete snowflake if past end of screen
		if (this.posY > height + 10 || this.posY < -10 || this.lifeTime < 0) {
			let index = snowflakes.indexOf(this)
			snowflakes.splice(index, 1)
		}
		this.lifeTime -= 1
	};

	this.bounce = function(power) {
		this.speedY -= 2+power*15
	}

	this.display = function() {
		ellipse(this.posX, this.posY, this.size)
	};
}

function drawGradient(x, y, radius, hue) {
  for (var r = radius; r > 0; --r) {
    fill(hue, 90, 90);
    ellipse(x, y, r, r);
    hue = (hue + 1) % 360;
  }
}

//https://p5js.org/examples/simulate-snowflakes.html
//https://p5js.org/examples/color-radial-gradient.html