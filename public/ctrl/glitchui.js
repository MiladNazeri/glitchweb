

var GlitchUI = function(config, state, network) {
	var _this = this;

	function _sendStateUpdate(channel, key, newvalue) {
		// console.log('_sendStateUpdate', channel, key, newvalue);
		if (typeof(state.data[channel]) == 'undefined')
			state.data[channel] = {};
		state.data[channel][key] = newvalue;
		state.fireUpdate();
		network.sendDelta(channel, state.data[channel]);
	}


	var ReactChannelKnob = React.createClass({
		render: function() {
			return React.createElement('div', {

			}, [
				'knob'
			]);
		}
	});

	var ReactChannelFader = React.createClass({
		render: function() {
			return React.createElement('div', {

			}, [
				'knob'
			]);
		}
	});

	var ReactChannelReact = React.createClass({
		render: function() {
			return React.createElement('div', {

			}, [
				'knob'
			]);
		}
	});

	var ReactChannel = React.createClass({
		displayName: 'ReactChannel',
		getInitialState: function() {
			return {
				faderDrag: false,
			}
		},
		_faderMouseDown: function(x) {
			var b = ReactDOM.findDOMNode(this).getBoundingClientRect();
			var localY = x.clientY - b.top - 150;
			var localH = 360;
			var pct = localY * 100 / 360;
			var val = 127 - (localY * 127 / 360);

			// console.log('_faderMouseDown', localX, localY, pct, val);
			// console.log('_setStateValue: ' + pct);

			_sendStateUpdate(this.props.index, 'a', Math.round(val));

			this.setState({
				faderDrag: true
			});
		},
		_faderMouseUp: function(x) {
			// console.log('_faderMouseUp', x.pageX, x.pageY);
			this.setState({
				faderDrag: false
			});
		},
		_faderMouseMove: function(x) {
			// console.log('_faderMouseMove', x.pageX, x.pageY);
			if (this.state.faderDrag) {
				var b = ReactDOM.findDOMNode(this).getBoundingClientRect();
				var localY = x.clientY - b.top - 150;
				var localH = 360;
				var pct = localY * 100 / 360;
				var val = 127 - (localY * 127 / 360);

				_sendStateUpdate(this.props.index, 'a', Math.round(val));
				// console.log('_setStateValue: ' + pct);
			}
		},
		render: function() {
			// console.log('ReactChannel::render', this.props);

			var _this = this;

			var mystate = this.props.state[this.props.index];
			if (typeof(mystate) == 'undefined') {
				mystate = { a: 0, b: 0, c: 0, '_': false };
			}

			var a_pct = (~~mystate.a * 100.0 / 127.0) + '%';
			var a_txt = '' + Math.round(~~mystate.a);

			var b_pct = (~~mystate.b * 100.0 / 127.0) + '%';
			var b_txt = '' + Math.round(~~mystate.b);

			var c_pct = (~~mystate.c * 100.0 / 127.0) + '%';
			var c_txt = '' + Math.round(~~mystate.c);

			return React.createElement('div', { className: 'channel' }, [
				React.createElement('div', { className: 'header' }, [
					React.createElement('b', {}, [
						'#' + this.props.index,
					]),
					React.createElement('select', {}, [
						React.createElement('option', {}, [ '- Unassigned -' ]),
						React.createElement('option', {}, [ '#1 (unassigned)' ]),
						React.createElement('option', {}, [ '#4 (ch 1)' ]),
					]),
					React.createElement('i', {}, [
						'X' + JSON.stringify(mystate)
					]),
					React.createElement('i', {}, [
						'midi KBD 36, 37, 37'
					]),
					React.createElement('i', {}, [
						'pc KBD Q/A/Z'
					])
				]),
				React.createElement('div', {
					className: 'fader',
					onMouseDown: this._faderMouseDown,
					onMouseMove: this._faderMouseMove,
					onMouseUp: this._faderMouseUp,
					onMouseLeave: this._faderMouseUp
				}, [
					React.createElement('div', { className: _this.state.faderDrag ? 'fill drag' : 'fill', style: { height: a_pct } }),
					React.createElement('div', { className: 'overlay' }, [ a_txt ]),
				]),
				React.createElement('div', { className: 'knob' }, [
					React.createElement('div', { className: 'fill', style: { width: b_pct } }),
					React.createElement('div', { className: 'overlay' }, [ b_txt ]),
				]),
				React.createElement('div', { className: 'knob2' }, [
					React.createElement('div', { className: 'fill', style: { width: c_pct } }),
					React.createElement('div', { className: 'overlay' }, [ c_txt ]),
				])
			]);
		}
	});

	var ReactChannels = React.createClass({
		displayName: 'ReactChannels',
		render: function() {
			// console.log('ReactChannels::render', this.props);
			var channels = [];
			var i = 0;
			var _this = this;
			this.props.channels.forEach(function(x) {
				channels.push(React.createElement(ReactChannel, {
					key: 'channel' + i,
					index: i,
					channel: x,
					state: _this.props.state
				}));
				i ++;
			});

			channels.push(React.createElement('br', {}));

			return React.createElement('div', {
			}, channels);
		}
	});

	function redraw() {
		var el = document.getElementById('channels');
		ReactDOM.render(React.createElement(ReactChannels, {
			channels: config.data.channels || [],
			state: state.data || {}
		}, []), el);
	}

	var clientsel = document.getElementById('clients');

	this.mapping = state.data.mapping || {};
	state.addListener(function(x) {
		// config changed.
		// _this.mapping = config.data.mapping || {};
		try {
			stateel.value = JSON.stringify(state.data, null, 0);
		} catch(e) {
		}
		redraw();
	});

	this.mapping = config.data.mapping || {};
	config.addListener(function(x) {
		// config changed.
		_this.mapping = config.data.mapping || {};
	});

	redraw();


}
