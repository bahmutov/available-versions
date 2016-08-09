'use strict';

const la = require('lazy-ass');
const is = require('check-more-types');
const replaceLinks = require('./replace-links');

/* global describe, it */
describe('replace links', () => {
  it('is a function', () => {
    la(is.fn(replaceLinks));
  });

  it('replaces SHA links', () => {
    const s = 'foo ([a00ed3e7](https://something/a00ed3e7))';
    const r = replaceLinks(s);
    la(r === 'foo a00ed3e7', r);
  });

  it('replaces SHA links surrounded by text', () => {
    const s = 'foo ([a00ed3e7](https://something/a00ed3e7)) bar';
    const r = replaceLinks(s);
    la(r === 'foo a00ed3e7 bar', r);
  });

  it('replaces in full github url', () => {
    const s = '([c1e87cc9](https://github.com/bahmutov/manpm/commit/c1e87cc9))';
    const r = replaceLinks(s);
    la(r === 'c1e87cc9', r);
  });

  it('replaces in longer string', () => {
    const s = 'Finds section by text in the heading ' +
      '([c1e87cc9](https://github.com/bahmutov/manpm/commit/c1e87cc9))';
    const r = replaceLinks(s);
    la(r === 'Finds section by text in the heading c1e87cc9', r);
  });

  it('replaces in string with markdown', () => {
    const s = '* **search:** Finds section by text in the heading ' +
      '([c1e87cc9](https://github.com/bahmutov/manpm/commit/c1e87cc9))';
    const r = replaceLinks(s);
    la(r === '* **search:** Finds section by text in the heading c1e87cc9', r);
  });
});
