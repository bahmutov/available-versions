var name = 'deps-ok';

var available = require('./src/available');
available({
  name: name
}).then(function (versions) {
  console.log('available versions for', name);
  console.log(versions);
}).done();
