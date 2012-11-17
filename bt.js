
bt = require('./build/Release/bt');

function Counter(initial) {
	this.count = initial || 0;
}

Counter.version = "version 0.0.0";

Counter.prototype.log = function() {
	console.log('Counter (' + Counter.version + '): ' + this.count);
}

Counter.prototype.increment = function() {
	this.count++;
}

c = new Counter(10);

console.log('from javascript');
c.increment();
c.log();

console.log('from c++');
bt.run(c);
