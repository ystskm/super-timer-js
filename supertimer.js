/***/
// supertiemr
(function(has_win, has_mod) {

  var NULL = null, TRUE = true, FALSE = false;
  var g;
  if(has_win) {
    g = window;
  } else {
    g = typeof self == 'undefined' ? this: self;
  }

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
  if(has_win) {
    for( var k in supr)
      window[k] = supr[k]; // change default timer to super-timer
  }
  if(has_mod) {
    module.exports = supr;
  }

  var counter = 0;
  var DefMax = Math.pow(2, 31) - 1;
  var Max = Number.MAX_VALUE;

  superTimeout.timers = {};
  superInterval.timers = {};

  function superTimeout() {

    var self = this;
    var a = Array.prototype.slice.call(arguments);
    var itv = a[1];

    if(!itv && isFunction(setImmediate)) {
      return setImmediate.apply(setImmediate, [a[0]].concat(a.slice(2)));
    }
    if(itv <= DefMax) {
      return orig.setTimeout.apply(g, a);
    }
    if(itv > Max) {
      throw new Error('Timer value is out of operation.');
    }

    var timer = orig.setTimeout.call(g, one, DefMax);
    var tid
    if(is('object', timer) && timer.id == NULL) {
      tid = timer.id = counter++;
    } else {
      tid = timer;
    }

    var value = superTimeout.timers[tid] = {
      self: self,
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
      value.working = orig.setTimeout.call(g, one, Math.min(DefMax, itv));
    }

  }

  function supercTimeout() {
    var a = Array.prototype.slice.call(arguments);
    var tid = a[0].id == NULL ? a[0]: a[0].id;
    var value = superTimeout.timers[tid];
    if(!value) {
      return orig.clearTimeout.call(g, a[0]);
    }
    delete superTimeout.timers[tid];
    return orig.clearTimeout.call(g, value.working)
  }

  function superInterval() {

    var self = this;
    var a = Array.prototype.slice.call(arguments);
    var itv = a[1];

    if(itv <= DefMax) {
      return orig.setInterval.apply(g, a);
    }
    if(itv > Max) {
      throw new Error('Timer value is out of operation.');
    }

    var timer = superTimeout(then, itv);
    var tid;
    if(is('object', timer) && timer.itv_id == NULL) {
      tid = timer.itv_id = counter++;
    } else {
      tid = timer;
    }

    var value = superInterval.timers[tid] = {
      self: self,
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
    var tid = a[0].itv_id == NULL ? a[0]: a[0].itv_id;
    var value = superInterval.timers[tid];
    if(!value) {
      return orig.clearInterval.call(g, a[0]);
    }
    delete superInterval.timers[tid];
    return supercTimeout(value.working);
  }

  // ----------------- //
  function is(ty, x) {
    return typeof x == ty;
  }
  function isFunction(x) {
    return is('function', x);
  }
  function isArray(x) {
    return Array.isArray(x);
  }

})(typeof window != 'undefined', typeof module != 'undefined');
