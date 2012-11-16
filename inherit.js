var util = require("util");
var events = require("events");

function MyStream() {
	events.EventEmitter.call(this);
}

var p = MyStream.prototype = Object.create(events.EventEmitter.prototype, {
	constructor: {
		value: MyStream,
		enumerable: false,
		writable: true,
		configurable: true
	}
});

p.write = function(data) {
	this.emit('data', data);
}

var stream = new MyStream();

console.log(stream instanceof events.EventEmitter); // true

stream.on('data', function(data) {
	console.log('Received data: "' + data + '"');
});

stream.write("It works!"); // Received data: "It works!"
