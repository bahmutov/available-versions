# available-versions

Fetches new versions for a given NPM package higher than given version.

[![NPM][available-versions-icon]][available-versions-url]

[![Build status][ci-image]][ci-url]
[![Coverage Status][available-versions-coverage-image]][available-versions-coverage-url]
[![dependencies][dependencies-image]][dependencies-url]
[![dev dependencies][dev-dependencies-image]][dev-dependencies-url]
[![semantic-release][semantic-image] ][semantic-url]
[![manpm](https://img.shields.io/badge/manpm-%E2%9C%93-3399ff.svg)](https://github.com/bahmutov/manpm)

for Node >= 4

## Install and use

    npm install -g available-versions

Installs several aliases, use any one you like `available`, `versions`, `vers` or `releases`

What are all releases for library `lazy-ass`?

    releases lazy-ass

What are new releases after `1.0.0`?

    releases lazy-ass@1.0.0
    releases lazy-ass 1.0.0

## Output

A table with versios, timestamps and relative age

```
$ vers babel@6.1.15
babel since 6.1.15
--------------------------
version  age      dist-tag
-------  -------  --------
6.1.16   a month
6.1.17   a month
6.1.18   a month
6.2.4    19 days
6.3.13   10 days  stable
```

## API

You can use this module from other modules

    var available = require('available-versions');
    var query = {
      name: 'deps-ok',
      version: '0.1.0' // version is optional
    };
    available(query).then(function (result) {
      console.log(result.name);
      console.log(result.versions); // array of versions
    });

You can also pass second argument to keep version cleanup error messages quiet

    available(query, true) ...

## Debug

To debug this program, run it with `DEBUG=vers` variable

    DEBUG=vers releases chalk

### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/available-versions/issues?state=open) on Github

## MIT License

Copyright (c) 2014 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[available-versions-icon]: https://nodei.co/npm/available-versions.svg?downloads=true
[available-versions-url]: https://npmjs.org/package/available-versions
[ci-image]: https://travis-ci.org/bahmutov/available-versions.svg?branch=master
[ci-url]: https://travis-ci.org/bahmutov/available-versions
[available-versions-coverage-image]: https://coveralls.io/repos/bahmutov/available-versions/badge.svg
[available-versions-coverage-url]: https://coveralls.io/r/bahmutov/available-versions
[dependencies-image]: https://david-dm.org/bahmutov/available-versions.svg
[dependencies-url]: https://david-dm.org/bahmutov/available-versions
[dev-dependencies-image]: https://david-dm.org/bahmutov/available-versions/dev-status.svg
[dev-dependencies-url]: https://david-dm.org/bahmutov/available-versions#info=devDependencies
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
