# common-vimeo

simple wrapper over the Vimeo JavaScript API


## Installation

```
$ npm install common-vimeo
```

## Usage


```js
var Vimeo = require('common-vimeo');
var player = new Vimeo('id-of-iframe');

player.on('ready', function() {
  player.play();
});

```

# License

  MIT
