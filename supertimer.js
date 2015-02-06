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
    var value = superTimeout.timers[timer] = {
      self: this,
      working: timer,
      args: a
    };
    return timer;

    function one() {
      itv -= DefMax;
      if(itv <= 0) {
        delete superTimeout.timers[timer];
        return a[0].apply(value.self, a.slice(2));
      }
      value.working = orig.setTimeout(one, Math.min(DefMax, itv));
    }

  }

  function supercTimeout() {
    var a = Array.prototype.slice.call(arguments);
    var tid = a[0], value = superTimeout.timers[tid];
    if(!value)
      return orig.clearTimeout(tid);
    return orig.clearTimeout(value.working)
  }

  function superIntrval() {
    var a = Array.prototype.slice.call(arguments);
    var itv = a[1];

    if(itv <= DefMax)
      return orig.setInterval.apply(orig.setInterval, a);
    if(itv > Max)
      throw new Error('Timer value is out of operation.');

    var timer = orig.setTimeout(one, DefMax);
    var value = superInterval.timers[timer] = {
      self: this,
      working: timer,
      args: a
    };
    return timer;

    function one() {
      itv -= DefMax;
      if(itv <= 0) {
        itv = a[1];
        a[0].apply(value.self, a.slice(2));
      }
      value.working = orig.setTimeout(one, Math.min(DefMax, itv));
    }

  }

  function supercIntrval() {
    var a = Array.prototype.slice.call(arguments);
    var tid = a[0], value = superInterval.timers[tid];
    if(!value)
      return orig.clearInterval(tid);
    return orig.clearTimeout(value.working)
  }

})(typeof window != 'undefined', typeof module != 'undefined');
