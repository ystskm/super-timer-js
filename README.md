# super-timer
  
[![Version](https://badge.fury.io/js/super-timer.png)](https://npmjs.org/package/super-timer)
[![Build status](https://travis-ci.org/ystskm/super-timer-js.png)](https://travis-ci.org/ystskm/super-timer-js)  
  

## Install

Install with [npm](http://npmjs.org/):

    npm install supertimer
    
## API - Set WebSocket, candidate hosts and options

```js
    var supr = require('supertimer');
    var timer = supr.setTimeout(function(){ console.log('END.') }, Number.MAX_VALUE);
    // => execute "END" after a long-long time.
```

### also use on browser

```html
<script type="text/javascript" src="supertimer.js"></script>
<script type="text/javascript">

    setTimeout(function(){ console.log('END.') }, Number.MAX_VALUE);
    // => execute "END" after a long-long time.

</script>
```
