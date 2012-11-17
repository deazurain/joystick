var ioctl = require('./build/Release/ioctl');

var fs = require('fs');

var fd = fs.openSync('/dev/input/js0', 'r');
var JSIOCGBUTTONS = 0x80016A12;
var buf = new Buffer(4);

console.log('File descriptor: ' + fd);
console.log('Operation: ' + JSIOCGBUTTONS);
console.log('Buffer:', buf);
console.log(ioctl.ioctl(fd, JSIOCGBUTTONS, buf));
console.log(buf);
