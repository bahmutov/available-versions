/* global gt */
var available = require('../..');

gt.async('deps-ok', function () {
  gt.arity(available, 2);
  available({
    name: 'deps-ok'
  }).then(function (info) {
    gt.equal(info.name, 'deps-ok');
  }).catch(function (err) {
    gt.ok(false, 'cannot fetch info, error', err);
  }).then(function () {
    gt.start();
  });
});

gt.async('deps-ok with version', function () {
  available({
    name: 'deps-ok',
    version: '1.0.0'
  }).then(function (info) {
    gt.equal(info.name, 'deps-ok');
  }).catch(function (err) {
    gt.ok(false, 'cannot fetch info, error', err);
  }).then(function () {
    gt.start();
  });
});

gt.async('@bahmutov/csv with scope', function () {
  available({
    name: '@bahmutov/csv'
  }).then(function (info) {
    gt.equal(info.name, '@bahmutov/csv');
  }).catch(function (err) {
    gt.ok(false, 'cannot fetch info, error', err);
  }).then(function () {
    gt.start();
  });
});

gt.async('deps-ok as string', function () {
  available('deps-ok')
  .then(function (info) {
    gt.equal(info.name, 'deps-ok');
  }).catch(function (err) {
    gt.ok(false, 'cannot fetch info, error', err);
  }).then(function () {
    gt.start();
  });
});
