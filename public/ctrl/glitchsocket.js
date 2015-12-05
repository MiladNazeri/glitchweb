
var GlitchSocket = function(config, state) {
	console.log('GlitchSocket: Connecting...');

	this.id = localStorage.getItem('glitchclient_id') || '';
	console.log('Previous id: ' + this.id);
	this.password = 'password';

	var _this = this;
	this.socket = io();

	setTimeout(function() {
		console.log('GlitchSocket: Connected.');
		_this.socket.emit('hello', {
			admin: true,
			id: _this.id,
			password: _this.password
		});
	}, 1000);

	this.socket.on('welcome', function(data) {
		console.log('GlitchSocket: Got welcome', data);
		if (data.id) {
			console.log('Assigned id ' + data.id);
			localStorage.setItem('glitchclient_id', data.id);
			_this.id = data.id;
		}
		if (data.state) {
			state.data = data.state;
			state.fireUpdate();
		}
	});

	this.socket.on('state', function(data) {
		// console.log('GlitchSocket: Got state', data);
		if (data.origin != _this.id) {
		}
	});

	this.socket.on('connections', function(data) {
		console.log('GlitchSocket: Got connections', data.clients);
	});

/*
	state.addListener(function() {
		var pkt = { origin: _this.id, state: state.data };
		console.log('State changed locally, send to server', pkt);
		_this.socket.emit('state', pkt);
	});
*/
}

GlitchSocket.prototype.sendDelta = function(state_id, state_value) {
	var pkt = { origin: this.id, state_id: state_id, state_value: state_value };
	console.log('State changed locally, send delta to server', pkt);
	this.socket.emit('delta', pkt);
}
