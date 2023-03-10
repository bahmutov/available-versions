# available-versions

Fetches new versions for a given NPM package higher than given version.

[![NPM][available-versions-icon]][available-versions-url]

[![ci](https://github.com/bahmutov/available-versions/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/bahmutov/available-versions/actions/workflows/ci.yml)
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

A table with versions, timestamps and relative age

```sh
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

For most modules, it will also fetch release notes from GitHub, for example

```sh
$ vers manpm@1.10.0
manpm since 1.10.0 from git+https://github.com/bahmutov/manpm.git
------------------------------------------------------------------------------------------------------------
version  age       release                                                                          dist-tag
-------  --------  -------------------------------------------------------------------------------  --------
1.10.1   8 months  github: parsing github url (a00ed3e7)
1.10.2   6 months  node5: testing on node 4 and 5, fixed get, (0ffdc31a, closes #22)
1.10.3   6 months  node: supporting older versions of node without harmony, (88ef0a4d, closes #21)
1.10.4   6 months  log: removed extra console log statement (30d2da81)
1.10.5   5 months  deps: upgraded a lot of deps, trying to see if #23 is still broken (2ed9051e)
1.10.6   4 months  readme: fixed getting readme by downgrading simple-get, (e7e15a25, closes #24)   latest
```

The comments are clipped and cleaned up to be a single line, I recommend
using [semantic-release](https://github.com/semantic-release/semantic-release)
to make sure the output is useful.

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

## Supported servers

Public and private NPM registries, GitHub (public) and GitLab
(public and private) servers. For private GitLab server, you should have
environment variable `GITLAB_AUTH_TOKEN` set with your
[personal access token](https://gitlab.com/profile/account).

```sh
GITLAB_AUTH_TOKEN=xxxyyyy vers @org/my-module
```

I recommend using [as-a](https://github.com/bahmutov/as-a) to simplify
using environment variables. In this case you would do something like this

```sh
as-a gitlab vers @org/my-module
```

## Debug

To debug this program, run it with `DEBUG=vers` variable

    DEBUG=vers releases chalk

### Small print

Author: Gleb Bahmutov &copy; 2014

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)
- [Cypress Tips & Tricks Newsletter](https://cypresstips.substack.com/)
- [my Cypress courses](https://cypress.tips/courses)

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
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
