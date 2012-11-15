var Joystick = require('/home/mick/nodejs/joystick/joystick.js');

var j = new Joystick;

j.listen("/dev/input/js0");
