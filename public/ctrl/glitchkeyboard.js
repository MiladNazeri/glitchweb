
var GlitchKeyboard = function(config, state, network) {
	var _this = this;

	function _sendStateUpdate(channel, key, newvalue) {
		// console.log('_sendStateUpdate', channel, key, newvalue);
		if (typeof(state.data[channel]) == 'undefined')
			state.data[channel] = {};
		state.data[channel][key] = newvalue;
		state.fireUpdate();
		network.sendDelta(channel, state.data[channel]);
	}

	var keymapping = {};

	function onKeyUp(msg) {
		var m = keymapping[String.fromCharCode(msg.keyCode)];
		console.log('Key up', msg.keyCode, m);
		if (typeof(m) !== 'undefined') {
			if (!m.random)
				_sendStateUpdate(m.channel, m.key, 0);
		}
	}

	function onKeyDown(msg) {
		var m = keymapping[String.fromCharCode(msg.keyCode)];
		if (msg.repeat && !m.random)
			return;

		console.log('Key down', msg.keyCode, m);
		if (typeof(m) !== 'undefined') {
			if (m.random)
				_sendStateUpdate(m.channel, m.key, Math.round(Math.random() * 127));
			else
				_sendStateUpdate(m.channel, m.key, 127);
		}
	}

	function updateConfig(channels) {
		var km = {};
		var cm = {};
		console.log('Update config', channels);
		var idx = 0;
		channels.forEach(function(x) {
			if (x.key1) km[x.key1] = { channel: idx, key: 'a' };
			if (x.key2) km[x.key2] = { channel: idx, key: 'b' };
			if (x.key3) km[x.key3] = { channel: idx, key: 'c', random: true };
			idx ++;
		});

		ccmapping = cm;
		keymapping = km;
	}

	config.addListener(function() {
		updateConfig(config.data.channels);
	});

	updateConfig(config.data.channels);

	window.addEventListener('keydown', onKeyDown.bind(this));
	window.addEventListener('keyup', onKeyUp.bind(this));
}
