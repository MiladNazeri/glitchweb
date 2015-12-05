
window.addEventListener('load', function() {

	var state = new GlitchState();
	var config = new GlitchConfig();

	var network = new GlitchSocket(config, state);
	var midi = new GlitchMidi(config, state, network);
	var keyboard = new GlitchKeyboard(config, state, network);

	var ui = new GlitchUI(config, state, network);

});
