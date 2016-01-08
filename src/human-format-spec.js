const la = require('lazy-ass');
const is = require('check-more-types');

/* global describe, it */
describe('human format conversion', function () {
  const toHuman = require('./human-format');

  it('is a function', function () {
    la(is.fn(toHuman));
  });

  function checkOutput(human) {
    la(is.array(human), 'not array', human);
    la(human.every(is.defined),
      'found undefined entries in human formatted', human);
  }

  it('handles with valid timestamps', function () {
    const releases = {
      name: 'ci-publish',
      versions: [
        '1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.1.0'
      ],
      timestamps: [
        '2016-01-07T20:49:10.977Z',
        '2016-01-07T20:54:08.557Z',
        '2016-01-07T20:59:05.577Z',
        '2016-01-07T21:15:00.188Z',
        '2016-01-07T21:15:40.930Z',
        '2016-01-08T03:27:18.522Z'
      ],
      'dist-tags': {
        latest: '1.1.0'
      }
    };
    const human = toHuman(releases);
    checkOutput(human);
  });

  it('handles undefined timestamps', function () {
    const releases = {
      name: 'ci-publish',
      versions: [
        '1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.1.0'
      ],
      timestamps: undefined,
      'dist-tags': {
        latest: '1.1.0'
      }
    };
    const human = toHuman(releases);
    checkOutput(human);
  });
});
