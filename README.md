mocha-spec-cov-alt
==================
[![Gitter chat](https://badges.gitter.im/yamadapc/mocha-spec-cov-alt.png)](https://gitter.im/yamadapc/mocha-spec-cov-alt)
[![peerDependency Status](https://david-dm.org/yamadapc/mocha-spec-cov-alt/peer-status.svg)](https://david-dm.org/yamadapc/mocha-spec-cov-alt#info=peerDependencies)
[![Analytics](https://ga-beacon.appspot.com/UA-54450544-1/mocha-spec-cov-alt/README)](https://github.com/igrigorik/ga-beacon)
- - -

A Mocha reporter, which extends the `spec` runner to display and (optionally)
enforce blanket Code Coverage metrics. Applying it to other runners, should
be as simple as replacing the `.super_` `SpecCov` property.

I wrote a [blog post about it](http://blog.yamadapc.com.br/code-coverage-enforcement-for-nodejs)
a while back.

![screenshot](screenshot.png)

This was heavily inspired by Alex Seville's work on the
[`travis-cov`](https://github.com/alex-seville/travis-cov).

Install it with:
```
npm install mocha-spec-cov-alt
```

## Simple usage
The easiest way to set this up, right now, is to run:
```bash
$ npm i -g mocha-spec-cov-alt
# ...
/usr/local/bin/mocha-spec-cov-alt -> /usr/local/lib/node_modules/mocha-spec-cov-alt/bin/index.js
mocha-spec-cov-alt@0.2.0 /usr/local/lib/node_modules/mocha-spec-cov-alt
$ mocha-spec-cov-alt
Adding mocha-spec-cov-alt to your package.json... OK
Adding `mocha`, `mocha-spec-cov-alt` and `blanket` through npm:
mocha@2.0.1 node_modules/mocha
├── escape-string-regexp@1.0.2
├── diff@1.0.8
├── growl@1.8.1
├── commander@2.3.0
├── jade@0.26.3 (commander@0.6.1, mkdirp@0.3.0)
├── debug@2.0.0 (ms@0.6.2)
├── mkdirp@0.5.0 (minimist@0.0.8)
└── glob@3.2.3 (inherits@2.0.1, graceful-fs@2.0.3, minimatch@0.2.14)

blanket@1.1.6 node_modules/blanket
├── falafel@0.1.6
├── esprima@1.0.4
└── xtend@2.1.2 (object-keys@0.4.0)
```

This will automatically add all the required nodes to your `package.json` file,
install the dependencies and quit. You can then run tests with `npm test`.

## Usage

To use it, add the key `"spec-cov"` to the `"config": { "blanket": {} }` node
in your `package.json` file. Currently supported options are:

- `threshold` - A global threshold to enforce. (defaults to 80)
- `localThreshold` - A local threshold to enforce.
- `lcovOutput` - A path to a file to output `lcov` data to, for use with
  CodeClimate or CoverAlls. (by default, the file won't be generated)

You should then run mocha with:
```
mocha --require blanket -R mocha-spec-cov-alt
```

For more info on setting-up blanket, see: https://github.com/alex-seville/blanket

The annotated source is avaible at https://yamadapc.github.io/mocha-spec-cov-alt
and was generated with docco.

## License
Copyright (c) 2014 Pedro Tacla Yamada. Licensed under the MIT license.
Please refer to the [LICENSE](LICENSE) file for more info.
