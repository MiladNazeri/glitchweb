
var GlitchMidi = function(config, state, network) {
	var _this = this;
	this.mapping = config.data.mapping || {};
	config.addListener(function(x) {
		// config changed.
		_this.mapping = config.data.mapping || {};
	});

	function _sendStateUpdate(channel, key, newvalue) {
		// console.log('_sendStateUpdate', channel, key, newvalue);
		if (typeof(state.data[channel]) == 'undefined')
			state.data[channel] = {};
		state.data[channel][key] = newvalue;
		state.fireUpdate();
		network.sendDelta(channel, state.data[channel]);
	}

	var midi = null;  // global MIDIAccess object
	var output = null;
	var ccmapping = {};
	var keymapping = {};

	function onMIDIMessage( event ) {

		if (event.data[0] == 0xB0) {
			// control change
			var m = ccmapping[event.data[1]];
			console.log('got midi CC n=' + event.data[1] + ', value=' + event.data[2], m);
			if (typeof(m) !== 'undefined') {
				_sendStateUpdate(m.channel, m.key, event.data[2]);
			}
		} else if (event.data[0] == 0x80) {
			// note off
			var m = keymapping[event.data[1]];
			console.log('got midi note off, key=' + event.data[1], m);
			if (typeof(m) !== 'undefined') {
				_sendStateUpdate(m.channel, m.key, 0);
			}
		} else if (event.data[0] == 0x90) {
			// node on
			var m = keymapping[event.data[1]];
			console.log('got midi note on, key=' + event.data[1] + ', velocity=' + event.data[2], m);
			if (typeof(m) !== 'undefined') {
				_sendStateUpdate(m.channel, m.key, event.data[2]);
			}
		} else {
			console.log('got unhandled midi data:', event.data);
		}
	}

	function onMIDISuccess( midiAccess ) {
		console.log( "MIDI ready!", midiAccess );

		for (var entry of midiAccess.inputs) {
			var input = entry[1];
			console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
				"' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
				"' version:'" + input.version + "'" );
		}

		for (var entry of midiAccess.outputs) {
			var output = entry[1];
			console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
				"' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
				"' version:'" + output.version + "'" );
		}

		midiAccess.inputs.forEach(function(entry) {
			entry.onmidimessage = onMIDIMessage;
		});
	}

	function onMIDIFailure(msg) {
		console.log( "Failed to get MIDI access - " + msg );
	}

	function updateConfig(channels) {
		var km = {};
		var cm = {};
		console.log('Update config', channels);
		var idx = 0;
		channels.forEach(function(x) {
			if (x.midicc1) cm[x.midicc1] = { channel: idx, key: 'a' };
			if (x.midicc2) cm[x.midicc2] = { channel: idx, key: 'b' };
			if (x.midicc3) cm[x.midicc3] = { channel: idx, key: 'c' };

			if (x.midikey1) km[x.midikey1] = { channel: idx, key: 'a' };
			if (x.midikey2) km[x.midikey2] = { channel: idx, key: 'b' };
			if (x.midikey3) km[x.midikey3] = { channel: idx, key: 'c' };

			idx ++;
		});

		ccmapping = cm;
		keymapping = km;
	}

	config.addListener(function() {
		updateConfig(config.data.channels);
	});

	updateConfig(config.data.channels);

	navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );
}
