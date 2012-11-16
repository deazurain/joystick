ioctl = require('./build/Release/ioctl');
fs = require('fs');

fd = fs.openSync('/dev/input/js0', 'r');

var JSIOCGBUTTONS = 0x80016A12;
var buf = new Buffer(4);
console.log(ioctl.ioctl(fd, JSIOCGBUTTONS, buf));
console.log(buf);
