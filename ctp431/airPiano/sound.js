var instrument = SampleLibrary.load({
	instruments: 'xylophone'
})
instrument.toMaster()

function midi2freq(midi_note_num) {
	var freq = 440.0*Math.pow(2.0,(midi_note_num-69)/12)
	return freq
}

function keyDown(midi){
	console.log(midi)
	instrument.triggerAttackRelease(midi2freq(midi), 1, undefined, 0.5)
}