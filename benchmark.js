function a() {
	var l = arguments.length;
	var args = new Array(l - 1);
	for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
	return args;
}

function b() {
	var length = arguments.length - 1,
		i = 0,
		result = [];
	while(i < length) {
		result[i] = arguments[++i];
	}
	return result;
}

function c() {
	var length = arguments.length,
			last = 0,
			current = 1,
			result = [];
	while(current < length) {
	  result[last] = arguments[current];
		last = current++;
	}
	return result;
}

function d() {
	var length = arguments.length,
			last = 0,
			current = 1,
			result = [];
	result.length = length - 1;
	while(current < length) {
	  result[last] = arguments[current];
		last = current++;
	}
	return result;
}

function benchmark(times, test) {
	var i = times;
	var start = process.hrtime();
	while(times--) {
		test();
	}
	var diff = process.hrtime(start);
	console.log("Took " + diff[0] + " seconds and " + diff[1] + " nanoseconds. ");
}

console.log(a("a", "b", "c", "d", "e"));
console.log(b("a", "b", "c", "d", "e"));
console.log(c("a", "b", "c", "d", "e"));
console.log(d("a", "b", "c", "d", "e"));

var times = 100000;
benchmark(times, function(){ a("a", "b", "c", "d", "e") });
benchmark(times, function(){ b("a", "b", "c", "d", "e") });
benchmark(times, function(){ c("a", "b", "c", "d", "e") });
benchmark(times, function(){ d("a", "b", "c", "d", "e") });
