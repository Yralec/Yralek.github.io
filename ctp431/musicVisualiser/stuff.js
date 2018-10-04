		colorMode(HSB)
		background(hueV, 20, 20, 0.006)


		/*analyser1.getByteFrequencyData(byteFrequencyData)
		bufferLength = byteFrequencyData.length
		radius = radius1
  		var c = color('white')
	    stroke(c)
  		prevX = 0
	    prevY = byteFrequencyData[0]

		for(let i = 1; i < bufferLength; ++i){
			var c = color(300*i/bufferLength, 100, 50)
			fill(c)
	    	newX = i*canvasW/bufferLength
	    	newY = (byteFrequencyData[i]*radius/256)
	    	line(prevX, prevY + canvasH/4, newX, newY + canvasH/4)
	    	line(canvasW-prevX, 3*canvasH/4 - prevY, canvasW-newX, 3*canvasH/4 - newY)
	    	prevX = newX
	    	prevY = newY
		}*/


		/*analyser2.getByteTimeDomainData(timeDomainData)
	    bufferLength = timeDomainData.length
	    radius = radius2
	    hueV += 0.2
	    hueV %= 360
	    colorMode(HSB)
	    var c = color(hueV,50,50)
	    stroke(c)
	    prevX = timeDomainData[0]*radius/256
	    prevY = 0
		for(let i = 1; i < bufferLength; ++i){
	    	newX = cos(i*2*PI/bufferLength)*(timeDomainData[i]*radius/256)
	    	newY = sin(i*2*PI/bufferLength)*(timeDomainData[i]*radius/256)
	    	line(prevX + canvasW/2, prevY + canvasH/2, newX + canvasW/2, newY + canvasH/2)
	    	prevX = newX
	    	prevY = newY
		}
		newX = timeDomainData[0]*radius/256
		newY = 0
		line(prevX + canvasW/2, prevY + canvasH/2, newX + canvasW/2, newY + canvasH/2)*/



		analyser2.getByteTimeDomainData(timeDomainData)
	    bufferLength = timeDomainData.length
	    radius = 5*radius2
	    hueV += 0.5
	    hueV %= 360
	    colorMode(HSB)
	    var c = color(hueV,70,60)
	    stroke(c)
	    strokeWeight(2)
	    prevX = 3/2*canvasW *(0-bufferLength/2)/bufferLength
	    prevY = (timeDomainData[0]-128)*2*radius/256*(0-bufferLength/2)/bufferLength
	    translate(canvasW/2, canvasH/2)
	    rotate(hueV/360*PI*2)
		for(let i = 1; i < bufferLength; ++i){
			newX = 3/2*canvasW *(i-bufferLength/2)/bufferLength
	    	newY = (timeDomainData[i]-128)*2*radius/256*(i-bufferLength/2)/bufferLength
	    	line(prevX, prevY, newX, newY)
	    	prevX = newX
	    	prevY = newY
		}