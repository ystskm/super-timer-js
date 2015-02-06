var nodeunit = require('nodeunit');
var supr = require('../supertimer');

module.exports = nodeunit.testCase({
  'normal': function(t) {
    t.expect(4);

    supr.setTimeout(function() {
      t.ok(true);
    }, 1000);

    var timer = supr.setInterval(function() {
      t.ok(true);
    }, 1000);

    setTimeout(function() {
      supr.clearInterval(timer);
      setTimeout(function() {
        t.done();
      }, 2000);
    }, 3200);

  },
  'over': function(t) {
    t.expect(2);

    var timert = supr.setTimeout(function() {
      t.ok(true);
    }, Math.pow(2, 32));

    var timeri = supr.setInterval(function() {
      t.ok(true);
    }, Math.pow(2, 32));

    setTimeout(function() {

      supr.clearTimeout(timert);
      supr.clearInterval(timeri);

      t.equal(Object.keys(supr.setTimeout.timers).length, 0, 'setTimeout');
      t.equal(Object.keys(supr.setInterval.timers).length, 0, 'setInterval');

      setTimeout(function() {
        t.done();
      }, 2000);

    }, 3200);

  }
});
