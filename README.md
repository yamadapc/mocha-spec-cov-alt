mocha-spec-cov-alt
==================
A Mocha reporter, which extends the `spec` runner to display and (optionally)
enforce blanket Code Coverage metrics. Applying it to other runners, should
be as simple as replacing the `.super_` `SpecCov` property.

This was heavily inspired by Alex Seville's work on the
[`travis-cov`](https://github.com/alex-seville/travis-cov).

![screenshot][screenshot.png]

Install it with:
```
npm install mocha-spec-cov-alt
```

To use it, add the key `"spec-cov"` to the `blanket: { "config": {} }` node
in your `package.json` file. Currently supported options are:

- `threshold` - A global threshold to enforce. (defaults to 80)
- `localThreshold` - A local threshold to enforce.

The annotated source is avaible at yamadapc.github.io/mocha-spec-cov-alt and was
generated with dokku.

## License
Copyright (c) 2014 Pedro Tacla Yamada. Licensed under the MIT license.
Please refer to the [LICENSE](LICENSE) file for more info.
