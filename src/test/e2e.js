/* global gt */
var available = require('../..');

gt.async('deps-ok', function () {
  gt.arity(available, 2);
  available({
    name: 'deps-ok'
  }).then(function (info) {
    gt.equal(info.name, 'deps-ok');
  }).fail(function (err) {
    gt.ok(false, 'cannot fetch info, error', err);
  }).finally(function () {
    gt.start();
  }).done();
});

gt.async('deps-ok as string', function () {
  available('deps-ok')
  .then(function (info) {
    gt.equal(info.name, 'deps-ok');
  }).fail(function (err) {
    gt.ok(false, 'cannot fetch info, error', err);
  }).finally(function () {
    gt.start();
  }).done();
});
