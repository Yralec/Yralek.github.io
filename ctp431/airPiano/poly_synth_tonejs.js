var synth = new Tone.PolySynth(48, Tone.MonoSynth).toMaster();

// one octave up
synth.set("detune", 0);

synth.set({
	oscillator:{
		type:"square"
	},
	filter:{
		Q:6,
		type:"lowpass",
		frequency: 1000,
		rolloff:-24
	},
	filterEnvelope:{
		attack:0,
		decay:1,
		sustain:1.0,
		release:0.0001,
		baseFrequency: 1000,
		octaves:0
	},
	envelope:{
		attack:0.0,
		decay:0,
		sustain:1,
		release:0.3
	}
});

function midi2freq(midi_note_num) {
	var freq = 440.0*Math.pow(2.0,(midi_note_num-69)/12)
	return freq
}

// Qwerty-Hancock note on/off handlers
function keyDown(midi_note_num) {
	synth.triggerAttack(midi2freq(midi_note_num), undefined, 0.5);
};

function keyUp(midi_note_num) {
	synth.triggerRelease(midi2freq(midi_note_num));
};

function majorChordDown(midi_note_num){
	keyDown(midi_note_num)
	keyDown(midi_note_num+4)
	keyDown(midi_note_num+7)
}

function majorChordUp(midi_note_num){
	keyUp(midi_note_num)
	keyUp(midi_note_num+4)
	keyUp(midi_note_num+7)
}

function minorChordDown(midi_note_num){
	keyDown(midi_note_num)
	keyDown(midi_note_num+3)
	keyDown(midi_note_num+7)
}

function minorChordUp(midi_note_num){
	keyUp(midi_note_num)
	keyUp(midi_note_num+3)
	keyUp(midi_note_num+7)
}

function play(midi_note_num){
	keyDown(midi_note_num)
}

function release(midi_note_num){
	keyUp(midi_note_num)
}