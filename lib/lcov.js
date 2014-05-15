'use strict';
// A utility class, which takes a `blanket` coverage object and returns a
// representation of its `lcov` coverage data, which can then be outputted in
// various ways.
//
// This was heavily inspired by Steven Looman's work on the
// [`mocha-lcov-reporter`](http://git.io/glqA9w)
//
var fs = require('fs');

// Expose The LCov generator.
exports = module.exports = LCov;

// Initializes a new `LCov` instance, given a `jscoverage` `blanket` coverage
// object - generally extracted from `global._$jscoverage`.
function LCov(jscoverage) {
  var fnames = Object.keys(jscoverage);

  this.output = '';

  for(var i = 0, len = fnames.length; i < len; i++) {
    var fname = fnames[i],
        data = jscoverage[fname];

    this.output += exports.reportFile(fname, data);
  }
}

// Writes the `lcov` output to a file.
LCov.prototype.toFile = function(path) {
  fs.writeFileSync(path, this.output);
};

// Returns the `lcov` output as a String.
LCov.prototype.toString = function() {
  return this.output;
};

// Generates the `lcov` report for a file.
exports.reportFile = function reportFile(fname, data) {
  var ret = 'SF:' + fname + '\n';

  for(var num = 1, len = data.source.length; num <= len; num++) {
    if(data[num] !== undefined) {
      ret += 'DA:' + num + ',' + data[num] + '\n';
    }
  }

  ret += 'end_of_record\n';

  return ret;
};
