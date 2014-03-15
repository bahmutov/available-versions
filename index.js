var available = require('./src/available');

if (module.parent) {
  module.exports = available;
} else {
  var name = process.argv[2] || 'deps-ok@0.1.0';
  var query = {
    name: name.split('@')[0],
    version: name.split('@')[1]
  };

  available(query).then(function (versions) {
    console.log('available versions for', name);
    console.log(versions);
  }).done();
}
