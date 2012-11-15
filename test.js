var Joystick = require('joystick');

var j = new Joystick();

j.listen("/dev/input/js0");
console.log(require('util').inspect(j, true));
j.listen('button', function(e) {
	console.log("Button " + e.number + (e.value ? 'pressed' : 'released'));
});
