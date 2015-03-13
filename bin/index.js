#!/usr/bin/env node
'use strict';
var child = require('child_process');
var fs = require('fs');
var path = require('path');

var cwd = process.cwd();
var pkgjsonpth = path.join(cwd, 'package.json');
var files = fs.readdirSync(cwd);
if(files.indexOf('package.json') === -1) {
  fail('No `package.json` found.');
}

var json;
try {
  json = require(pkgjsonpth);
} catch(err) {
  fail('Failed to read your `package.json`');
}

if(!json.scripts) json.scripts = {};

if(json.scripts.test) {
  json.scripts.test += ' &&  mocha --require blanket -R mocha-spec-cov-alt';
} else {
  json.scripts.test = 'mocha --require blanket -R mocha-spec-cov-alt';
}

if(!json.config) json.config = {};
json.config.blanket = extend({
  'data-cover-never': [
    'node_modules'
  ],
  'pattern': [
    'lib', 'YOUR', 'MODULE', 'DIRECTORIES', 'HERE'
  ],
  'spec-cov': {
    'threshold': 80,
    'localThreshold': 80,
  }
}, json.config.blanket || {});

process.stdout.write('Adding mocha-spec-cov-alt to your package.json...');
fs.writeFileSync(pkgjsonpth, JSON.stringify(json, null, 2));
process.stdout.write(' OK\n');
console.log('Adding `mocha`, `mocha-spec-cov-alt` and `blanket` through npm:');
var npm = child.spawn('npm', [
  'install', '--save-dev', 'mocha-spec-cov-alt', 'mocha@2.1', 'blanket',
]);
npm.stdout.pipe(process.stdout);

/**
 * Merges two objects together, overwriting the second's properties onto the
 * first.
 *
 * @param {Object} target
 * @param {Object} source
 * @return {Object} result The modified `target` parameter
 */

function extend(target, source) {
  var keys = Object.keys(source);
  for(var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    target[key] = source[key];
  }
  return target;
}

/**
 * Prints error message and exits with non-zero code
 * @param {{String|Error}
 */

function fail(err) {
  console.error(err.message || err);
  process.exit(err.code || 1);
}
