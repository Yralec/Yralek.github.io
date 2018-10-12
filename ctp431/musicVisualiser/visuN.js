var log44100 = Math.log(44100)
var gradientCircles = []
var particleArray = []
var lower_freqs = [22, 44, 88, 177, 355, 710, 1420, 2840, 5680, 11360]
var upper_freqs = [44, 88, 177, 355, 710, 1420, 2840, 5680, 11360, 22720]
var center_freqs = [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]
var radialGradients = []
var alphaVal = 0.2
var rms = 0;
var t = 0
var particleColoringCooldown = 30

var byteFrequencyData
var timeDomainData

var pause = false

function mousePressed(){
	if(song.isPlaying()){
		song.pause()
		pause = true
	} else{
		song.play()
		pause = false
	}
}

function preload(){
	song = loadSound("song.mp3")
}

function setup() {
	song.play()
	createCanvas(640, 640);
	background(0, 0, 0)

	amp = new p5.Amplitude()
	fft = new p5.FFT()
}

var radius1 = 200
var radius2 = 100
var hueV = 0

var power = 0
var oldPower = 0

function draw() {
	if (!pause) {

		var rms = amp.getLevel()
		var db = 20.0*Math.log10(rms);
		power = 70 + db

		background('rgba(0,0,0,'+alphaVal+')')

		timeDomainData = fft.waveform()
		byteFrequencyData = fft.analyze()

		//createGradient()
		//updateGradients()
		//timeDomain()
		particles()
		if(power - oldPower > 0.1){
			particleColoring()
			particleColoring()
		}
		oldPower = power
	}
}

function particles(){
	push()
	t = frameCount/60

	rms = amp.getLevel()

	//for(var i = 0; i < 10; ++i){
		//var energy = fft.getEnergy(lower_freqs[i], upper_freqs[i])
		for (let particle of particleArray) {
 		   particle.bounce(rms)		//0.2*Math.sqrt(energy/(255*4)))
		}
	//}


	for (var i = 0; i < random(Math.round(rms*5)); i++) {
		particleArray.push(new particle())
	}

	translate(width/2, height/2)
	noStroke()
	var c = color("white")
	fill(c)
	for (let particle of particleArray) {
	    particle.update(t)
	    particle.display()
	}
	pop()
}

function particleColoring(){
	var centroid = fft.getCentroid()

	particleColoringCooldown = 30
	colorMode(HSB)

	var index = random(10)
	var startAngle = (2*PI*index/10)%(2*PI)
	var endAngle = (2*PI*(index+1)/10)%(2*PI)
	var c = color(index*36, 80, 80)

	for(let particle of particleArray){
		if(particle.initialangle > startAngle && particle.initialangle < endAngle){
			particle.colour = c
		}
	}
}

var theta = 0

function timeDomain() {
	push()

	var distance = 0
	if (power - oldPower > 0) {
		distance = power
	} else {
		distance = 0.9 * oldPower + 0.1 * power
	}

	var size = distance * 1.8
	theta += rms*5*10 / 180
	translate(width / 2, height / 2)


	//Circle
	colorMode(HSB, 360, 100, 100, 1)
	var c = color(360 - (power/70 * 360)%360, 50, 60)
	stroke(c)
	//drawSpectrumCircle(timeDomainData)

	rotate(theta)

	var divisor = 4 + 5*rms
	//Squares
	var ex = 40
	colorMode(HSB)
	var c = color((3*power/70 * 360)%360, 50, 60)
	stroke(c)

	translate(-width / divisor, -height / divisor)
	rotate(-theta)
	drawSpectrumSquare(timeDomainData, size, distance, ex)
	rotate(theta)
	translate(width / divisor, height / divisor)


	translate(width / divisor, -height / divisor)
	rotate(-theta)
	drawSpectrumSquare(timeDomainData, size, distance, ex)
	rotate(theta)
	translate(-width / divisor, height / divisor)


	translate(-width / divisor, height / divisor)
	rotate(-theta)
	drawSpectrumSquare(timeDomainData, size, distance, ex)
	rotate(theta)
	translate(width / divisor, -height / divisor)


	translate(width / divisor, height / divisor)
	rotate(-theta)
	drawSpectrumSquare(timeDomainData, size, distance, ex)
	rotate(theta)
	translate(-width / divisor, -height / divisor)

	translate(-width / 2, -height / 2)
	rotate(theta)

	pop()
}

function drawSpectrumSquare(data, size, length, expansion) {
	bufferLength = data.length
	sideLength = bufferLength / 4

	for (var side = 0; side < 4; ++side) {
		for (var i = 1; i < sideLength - 1; ++i) {
			normalisedData1 = data[side * sideLength + i] * expansion
			normalisedData2 = data[side * sideLength + i + 1] * expansion
			switch (side) {
				case 0:
					x1 = i * size / sideLength - size / 2
					x2 = (i + 1) * size / sideLength - size / 2
					y1 = normalisedData1 - length
					y2 = normalisedData2 - length
					break;
				case 1:
					y1 = i * size / sideLength - size / 2
					y2 = (i + 1) * size / sideLength - size / 2
					x1 = normalisedData1 + length
					x2 = normalisedData2 + length
					break;
				case 2:
					x1 = size - i * size / sideLength - size / 2
					x2 = size - (i + 1) * size / sideLength - size / 2
					y1 = normalisedData1 + length
					y2 = normalisedData2 + length
					translate
					break;
				case 3:
					y1 = size - i * size / sideLength - size / 2
					y2 = size - (i + 1) * size / sideLength - size / 2
					x1 = normalisedData1 - length
					x2 = normalisedData2 - length
					break;
			}
			line(x1, y1, x2, y2)
		}
	}
}

function drawSpectrumCircle(data) {
	bufferLength = data.length
	radius = 5 * radius2
	hueV += 0.5
	hueV %= 360
	//strokeWeight(2)
	prevX = 3 / 2 * width * (0 - bufferLength / 2) / bufferLength
	prevY = data[0] * radius * (0 - bufferLength / 2) / bufferLength
	rotate(hueV / 360 * PI * 2)
	for (let i = 1; i < bufferLength; ++i) {
		newX = 3 / 2 * width * (i - bufferLength / 2) / bufferLength
		newY = data[i] * radius * (i - bufferLength / 2) / bufferLength
		line(prevX, prevY, newX, newY)
		prevX = newX
		prevY = newY
	}
	rotate(-hueV / 360 * PI * 2)
}

function createGradient(hue) {
	var x = Math.floor((Math.random() - 0.4) * width)
	var y = Math.floor((Math.random() - 0.4) * height)
	gradientCircles.push([x, y, 1])
}

function updateGradients() {
	colorMode(HSBA)
	for (var i = 0; i < gradientCircles.length; ++i) {
		if (gradientCircles[i][2] > maxGradientRadius) {
			gradientCircles.splice(i, 1)
		} else {
			var x = gradientCircles[i][0]
			var y = gradientCircles[i][1]
			var r = gradientCircles[i][2]
			fill(r * 10, 0.8, 0.8, 0.6)
			ellipse(x, y, r)
		}
	}
}

var gravity = -1
// snowflake class
function particle(){

	this.radius = 0
	this.initialangle = random(0, 2 * PI)
	this.size = random(2, 5)
	this.speed = pow(this.size, 0.5)
	this.maxSpeed = -2*pow(this.size, 0.5)
	this.lifeTime = 60
	this.minRadius = 25
	this.colour = color('white')

	this.update = function(time) {


		this.speed = Math.max(this.speed + gravity, this.maxSpeed)
		if(this.radius == this.minRadius && this.speed < 0){
			this.speed = 0
		} else if(this.radius == 0.8*width/2 && this.speed > 0){
			this.speed = 0
		}

		this.radius = Math.min(0.8*width/2, Math.max(this.radius + this.speed, this.minRadius))


		if (this.lifeTime < 0) {
			let index = particleArray.indexOf(this)
			particleArray.splice(index, 1)
		}
		this.lifeTime -= 1
	};

	this.bounce = function(strength) {
		//if(strength > 0.1){
			if(power - oldPower > 0){

				this.speed += power/10 //*strength
			}
		//}
	}

	this.display = function() {
		fill(this.colour)
		var posX = this.radius * cos(this.initialangle)
		var posY = this.radius * sin(this.initialangle)
		ellipse(posX, posY, this.size)
	};
}