'use strict';
// A Mocha reporter, which extends the `spec` runner to display and (optionally)
// enforce blanket Code Coverage metrics. Applying it to other runners, should
// be as simple as replacing the `.super_` `SpecCov` property.
//
// This was heavily inspired by Alex Seville's work on the
// [`travis-cov`](https://github.com/alex-seville/travis-cov).
//
// To use it, add the key `"spec-cov"` to the `blanket: { "config": {} }` node
// in your `package.json` file. Currently supported options are:
//
// - `threshold` - A global threshold to enforce. (defaults to 80)
// - `localThreshold` - A local threshold to enforce.
//
// The annotated source is avaible at _______ and was generated with dokku.
//
var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    Mocha = require('mocha');

var defineProperty = Object.defineProperty, keys = Object.keys;
var inherits = util.inherits;
var join = path.join;
var Base = Mocha.reporters.Base, Spec = Mocha.reporters.Spec, color = Base.color;

var CWD = process.cwd();

// Expose the SpecCov reporter
exports = module.exports = SpecCov;

// Initializes a new `SpecCov` test reporter, given a `runner` Mocha
// [`Runner`](http://git.io/0bzcAw).
function SpecCov(runner) {
  this.constructor.super_.call(this, runner);
  this.attachEvents(runner);
}

// The prototype chain and `super_` property are set here.
inherits(SpecCov, Spec);

// Attaches coverage repoting and enforcing events to the `runner`.
SpecCov.prototype.attachEvents = function(runner) {
  runner.on('end', this.check.bind(this));
};

// Checks and displays code coverage.
SpecCov.prototype.check = function() {
  var covData = global._$jscoverage;

  if(!covData) return;

  var gthreshold = this.options.threshold,
      lthreshold = this.options.localThreshold;

  // Print the header
  console.log(color('suite', '  Code coverage report:'));
  console.log(color('bright yellow', '  Global threshold - ' + gthreshold));
  if(lthreshold)
    console.log(color('bright yellow', '  Local threshold - ' + lthreshold));
  console.log();

  // Analyse and print local coverage reports
  var fnames = keys(covData),
      failed = [],
      gcov = {
        hits: 0,
        misses: 0,
        sloc: 0
      };

  for(var i = 0, len = fnames.length; i < len; i++) {
    // Remove trash out of the fname.
    var fname = fnames[i],
        data = covData[fname],
        cleanfname = fname.replace(CWD, '').slice(1),
        lcov = exports.coverage(data, lthreshold);

    gcov.hits += lcov.hits;
    gcov.misses += lcov.misses;
    gcov.sloc += lcov.sloc;

    if(lcov.ok) {
      console.log(
        '    ' +
        color('checkmark', Base.symbols.ok) + ' ' +
        color('pass', cleanfname) +
        color('pass', ' - ' + lcov.sloc + ' sloc ') +
        color('green', '(' + Math.floor(lcov.coverage) + '%' + ')')
      );
    }
    else {
      failed.push(fname);

      console.log(
        '    ' +
        color('fail', Base.symbols.err) + ' ' +
        color('pass', cleanfname) +
        color('pass', ' - ' + lcov.sloc + ' sloc ') +
        color('fail', '(' + Math.floor(lcov.coverage) + '%' + ')')
      );
    }
  }

  gcov.coverage = gcov.hits / gcov.sloc * 100;

  // Print the summary.
  console.log();
  var nfail = failed.length, npass = fnames.length - nfail;
  console.log(
    color('pass', '  Local code coverage ') +
    (nfail ?
       color('fail', 'failing for ' + nfail) + color('pass',  ' and ') : '') +
       color('bright pass', 'ok for ' + npass + ' files')
  );

  var gcovpass = gcov.coverage < gthreshold,
      gcovpercent = Math.floor(gcov.coverage) + '%';

  console.log(
    color('pass', '  Global code coverage ') +
    (gcovpass ?
       color('fail', 'below the threshold at ' + gcovpercent) :
       color('bright pass', 'above the threshold at ' + gcovpercent))
  );
  console.log();

  if(!gcovpass || nfail) {
    process && process.exit(1);
    return false;
  }
};

// Map a jscoverage data node into a easily parseable object.
// Mainly extracted from the [`json-cov`](http://git.io/9nZJxA) mocha reporter,
// with some performance improvements.
exports.coverage = function coverage(data, threshold) {
  var ret = {
    coverage: 0,
    hits: 0,
    misses: 0,
    sloc: 0,
    ok: true // Represents whether coverage is above threshold
  };

  for(var i = 0, len = data.source.length; i < len; i++) {
    var num = i + 1;

    if(data[num] === 0) {
      ret.misses++;
      ret.sloc++;
    } else if(data[num] !== undefined) {
      ret.hits++;
      ret.sloc++;
    }
  }

  ret.coverage = ret.hits / ret.sloc * 100;

  if(ret.coverage < threshold) ret.ok = false;

  return ret;
};

// Reads and parses the project's `package.json` file.
exports.readPkgJson = function readPkgJson(path) {
  var pkgJsonPath = path || join(CWD, 'package.json'),
      pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

  return pkgJson;
};

// Define an options virtual property.
defineProperty(SpecCov.prototype, 'options', {
  get: function() {
    var ctor = this.constructor;
    if(ctor._options) return ctor._options; // Return if cached.

    var pkgJson = exports.readPkgJson(),
        config = pkgJson.config,
        options = config && config.blanket && config.blanket['spec-cov'];

    // Parse default options and set the cache.
    ctor._options = options || {};
    ctor._options.threshold || (ctor._options.threshold = 80);

    return ctor._options;
  },

  set: function(options) {
    this.constructor._options = options;
  }
});
