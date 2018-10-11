var gradientCircles = []

var byteFrequencyData
var timeDomainData

var pause = false

function mousePressed(){
	if(song.isPlaying()){
		song.pause()
	} else{
		song.play()
	}
}

function preload(){
	song = loadSound("song.mp3")
}

function setup() {
	song.play()
	createCanvas(640, 480);
	background(0, 0, 0)

	amp = new p5.Amplitude()
	fft = new p5.FFT()
}

var radius1 = 200
var radius2 = 100
var hueV = 0

var oldPower = 0

function draw() {
	if (!pause) {

		background('rgba(0,0,0,0.03)')

		timeDomainData = fft.waveform()
		byteFrequencyData = fft.analyze()

		//createGradient()
		//updateGradients()
		timeDomain()

	}
}


var theta = 0

function timeDomain() {

	var rms = amp.getLevel()
	var db = 20.0*Math.log10(rms);
	var power = 70 + db
	var distance = 0
	if (power - oldPower > 0) {
		distance = power
	} else {
		distance = 0.9 * oldPower + 0.1 * power
	}

	var size = distance * 1.8
	theta += 10 / 180
	translate(width / 2, height / 2)


	//Circle
	colorMode(HSB, 360, 100, 100, 1)
	var c = color(360 - (power/70 * 360)%360, 50, 60)
	stroke(c)
	drawSpectrumCircle(timeDomainData)

	rotate(theta)

	//Squares
	var ex = 40
	colorMode(HSB)
	var c = color((power/70 * 360)%360, 50, 60)
	stroke(c)

	translate(-width / 4, -height / 4)
	rotate(-theta)
	drawSpectrumSquare(timeDomainData, size, distance, ex)
	rotate(theta)
	translate(width / 4, height / 4)


	translate(width / 4, -height / 4)
	rotate(-theta)
	drawSpectrumSquare(timeDomainData, size, distance, ex)
	rotate(theta)
	translate(-width / 4, height / 4)


	translate(-width / 4, height / 4)
	rotate(-theta)
	drawSpectrumSquare(timeDomainData, size, distance, ex)
	rotate(theta)
	translate(width / 4, -height / 4)


	translate(width / 4, height / 4)
	rotate(-theta)
	drawSpectrumSquare(timeDomainData, size, distance, ex)
	rotate(theta)
	translate(-width / 4, -height / 4)

	translate(-width / 2, -height / 2)
	rotate(theta)

	oldPower = power

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

function getEnergy(data) {
	squareSum = 0
	for (var i = 0; i < data.length; ++i) {
		x = data[i] / 256 - 0.5
		squareSum += x * x
	}
	rms = Math.sqrt(squareSum / data.length)
	db = 20.0 * Math.log10(rms);
	return db
}