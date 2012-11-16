var Joystick = require('joystick');

var j = new Joystick();

var buttons = {
	0: 'select',
	1: 'left analog',
	2: 'right analog', 
	3: 'start',
	4: 'up',
	5: 'right', 
	6: 'down', 
	7: 'left',
	8: 'l2',
	9: 'r2',
	10: 'l1', 
	11: 'r1', 
	12: 'triangle', 
	13: 'circle',
	14: 'cross', 
	15: 'square',
	16: 'connect'
};

j.listen("./js0out");

j.on('button', function(e) {
	console.log(buttons[e.number] + ' ' + (e.value ? 'pressed' : 'released'));
});
