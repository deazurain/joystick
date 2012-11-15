/* todo: 
 * parse data
 * provide events for button presses/axis movements/init events
 * automatic reconnect, currently just throws exception on disconnect
 */

fs = require('fs');

exports = module.exports = Joystick = function() {};

var p = Joystick.prototype;	// public properties
var h = {}; // private properties (have to be bound)

// bind function that prepends this as an argument
var bind = function(o, f) {
	return function() {
		Array.prototype.unshift.call(arguments, o);
		return f.apply(o, arguments);
	};
};

/* CONSTANTS */
p.EVENT_BUTTON = 0x01 /* button pressed/released */
p.EVENT_AXIS   = 0x02 /* joystick moved */
p.EVENT_INIT   = 0x80 /* initial state of device */

/* PUBLIC */
p.listen = function(device, callback) {
	var self = this;
	self.device = device;
	self.stream = fs.createReadStream(self.device, 
			{	flags: "r", 
				bufferSize: 8 });
	if(callback) {
		self.stream.on('open', callback);
	}
	self.stream.on('data', bind(self, h.data));
	self.stream.on('end', bind(self, h.end));
	self.stream.on('error', bind(self, h.error));
	self.stream.on('close', bind(self, h.close));
	return self
}

p.close = function(callback) {
	var self = this;
	self.stream.close(callback);
	return self;
};

/* PRIVATE */
h.data = function(self, data) {
	console.log('data', data);
};

h.end = function(self) {
	console.log('end');
};

h.error = function(self, exception) {
	console.log('error', exception);
	throw exception;
};

h.close = function(self) {
	console.log('close');
};

