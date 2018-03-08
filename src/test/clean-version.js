// gt.module('clean-version');

// var clean = require('../clean-version');

// gt.test('basic', function () {
//   gt.arity(clean, 3, 'function expecting N arguments');
// });

// gt.test('clean 1.2.0', function () {
//   var cleaned = clean('1.2.0', 'mocha');
//   gt.string(cleaned, 'returns a string');
//   gt.equal(cleaned, '1.2.0', 'version is already clean');
// });

// gt.test('clean version with 2 digits', function () {
//   var cleaned = clean('~1.8', 'mocha');
//   gt.string(cleaned, 'returns a string');
//   gt.equal(cleaned, '1.8.0', 'adds zero');
// });

// gt.test('clean latest versions', function () {
//   // TODO use console.pop to grab output and check for error message
//   var cleaned = clean('latest', 'gt');
//   gt.undefined(cleaned, 'returns undefined when cannot clean');
// });
