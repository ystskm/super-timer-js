/***/
// supertiemr
(function(has_win, has_mod) {

  var orig = {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval
  };

  var supr = {
    setTimeout: superTimeout,
    clearTimeout: supercTimeout,
    setInterval: superInterval,
    clearInterval: supercInterval
  };

  // exports
  has_win && (function() {
    for( var k in supr)
      window[k] = supr[k];
  })();
  has_mod && (module.exports = supr);

  var counter = 0;
  var DefMax = Math.pow(2, 31) - 1;
  var Max = Number.MAX_VALUE;

  superTimeout.timers = {};
  superInterval.timers = {};

  function superTimeout() {

    var a = Array.prototype.slice.call(arguments);
    var itv = a[1];

    if(!itv && typeof setImmediate == 'function')
      return setImmediate.apply(setImmediate, [a[0]].concat(a.slice(2)));
    if(itv <= DefMax)
      return orig.setTimeout.apply(orig.setTimeout, a);
    if(itv > Max)
      throw new Error('Timer value is out of operation.');

    var timer = orig.setTimeout(one, DefMax);
    var tid = typeof timer == 'object' && timer.id == null
      ? (timer.id = counter++): timer;

    var value = superTimeout.timers[tid] = {
      self: this,
      working: timer,
      args: a
    };
    return timer;

    function one() {
      itv -= DefMax;
      if(itv <= 0) {
        delete superTimeout.timers[tid];
        return a[0].apply(value.self, a.slice(2));
      }
      value.working = orig.setTimeout(one, Math.min(DefMax, itv));
    }

  }

  function supercTimeout() {
    var a = Array.prototype.slice.call(arguments);
    var tid = a[0].id == null ? a[0]: a[0].id;
    var value = superTimeout.timers[tid];
    if(!value)
      return orig.clearTimeout(a[0]);
    delete superTimeout.timers[tid];
    return orig.clearTimeout(value.working)
  }

  function superInterval() {
    var a = Array.prototype.slice.call(arguments);
    var itv = a[1];

    if(itv <= DefMax)
      return orig.setInterval.apply(orig.setInterval, a);
    if(itv > Max)
      throw new Error('Timer value is out of operation.');

    var timer = superTimeout(then, itv);
    var tid = typeof timer == 'object' && timer.itv_id == null
      ? (timer.itv_id = counter++): timer;

    var value = superInterval.timers[tid] = {
      self: this,
      working: timer,
      args: a
    };
    return timer;

    function then() {
      a[0].apply(value.self, a.slice(2));
      value.working = superTimeout(then, itv);
    }

  }

  function supercInterval() {
    var a = Array.prototype.slice.call(arguments);
    var tid = a[0].itv_id == null ? a[0]: a[0].itv_id;
    var value = superInterval.timers[tid];
    if(!value)
      return orig.clearInterval(a[0]);
    delete superInterval.timers[tid];
    return supercTimeout(value.working);
  }

})(typeof window != 'undefined', typeof module != 'undefined');
