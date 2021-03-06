/* todo: 
 * provide events for button presses/axis movements/init events
 * automatic reconnect, currently just throws exception on disconnect
 */

var 
	fs = require('fs'),
	events = require('events');
	bindings = require('../build/Release/joystick');

exports = module.exports = Joystick;

/* Constructor */
function Joystick() {
	events.EventEmitter.call(this);
};

var prototype = Joystick.prototype = Object.create(events.EventEmitter.prototype, {
	constructor: {
		value: Joystick,
		enumberable: false,
		writable: true,
		configurable: true
	}
});

/* Constants */
prototype.EVENT_BUTTON = 0x01 /* button pressed/released */
prototype.EVENT_AXIS   = 0x02 /* joystick moved */
prototype.EVENT_INIT   = 0x80 /* initial state of device */

/* Public */
prototype.log = function() {
	Array.prototype.unshift.call(arguments, '[Joystick]');
	console.log.apply(console.log, arguments);
}

prototype.listen = function(device, callback) {
	var stream_options = {
		flags: "r",
		bufferSize: 8
	};

	var stream = fs.createReadStream(device, stream_options);
	var self = this;
  stream.on('open', function(fd) {
			open.bind(self)(fd);
			if(callback) { callback(fd); }
	});

	stream.on('data', data.bind(this));
	stream.on('end', end.bind(this));
	stream.on('error', error.bind(this));
	stream.on('close', close.bind(this));

	this.device = device;
	this.stream = stream;
	return this;
}

prototype.close = function(callback) {
	this.stream.close(callback);
	return this;
};

prototype.parse = function(data) {
	var e = {
		time: data.readUInt32LE(0),
		value: data.readInt16LE(4),
		type: data.readUInt8(6),
		number: data.readUInt8(7)
	};
	if(e.type & this.EVENT_INIT) {
		e.init = true;
		e.type -= this.EVENT_INIT;
	}
	else {
		e.init = false;
	}
	return e;
};

/* Private */
open = function(fd) {
	this.buttons = buttons(fd);
	this.axes = axes(fd);
	this.name = name(fd);
};

data = function(data) {
	var e = this.parse(data);
	var type = e.type;
	delete e.type;
	switch(type) {
		case this.EVENT_BUTTON:
			this.emit('button', e);
			break;
		case this.EVENT_AXIS:
			this.emit('axis', e);
			break;
	}
};

end = function() {
	this.log('end');
};

error = function(exception) {
	this.log('error', exception);
	throw exception;
};

close = function() {
	this.log('close');
};

buttons = function(fd) {
	var result = {};
	var return_code = bindings.buttons(fd, result);
	if(return_code < 0) {
		throw new Error('error reading button number ' + return_code);
	}
	return result.buttons;
};

axes = function(fd) {
	var result = {};
	var return_code = bindings.axes(fd, result);
	if(return_code < 0) {
		throw new Error('error reading axis number ' + return_code);
	}
	return result.axes;
};

name = function(fd) {
	var result = {};
	var return_code = bindings.name(fd, result);
	if(return_code < 0) {
		throw new Error('error reading joystick name ' + return_code);
	}
	return result.name;
};




