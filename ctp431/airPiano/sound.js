var instrument = SampleLibrary.load({
	instruments: 'xylophone'
})
var instrument2 = SampleLibrary.load({
	instruments: 'bass-electric'
})

var effect = new Tone.Chorus().toMaster()
var reverb = new Tone.Reverb(3).toMaster()

reverb.generate()
instrument.connect(effect)
instrument2.connect(reverb)

function midi2freq(midi_note_num) {
	var freq = 440.0*Math.pow(2.0,(midi_note_num-69)/12)
	return freq
}

function keyDown(midi, volume, num2 = false){
	if(num2){
		instrument2.triggerAttackRelease(midi2freq(midi), 1, undefined, 0.4)
	} else{
		instrument.triggerAttackRelease(midi2freq(midi), 1, undefined, volume)
	}
}