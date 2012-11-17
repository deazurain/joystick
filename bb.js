
/* Try to fill a buffer with a c++ binding
 * src/bb.cc
 */

var b = new Buffer(7);

var bb = require('./build/Release/bb');

console.log('Buffer before:', b);

bb.fill(b, 7);

console.log('Buffer after:', b);
