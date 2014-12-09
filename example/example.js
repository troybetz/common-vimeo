/**
 * Module dependencies
 */

var Vimeo = require('../');

/**
 * Create new player
 */

window.player = new Vimeo('vimeo-embed');

/**
 * Event handlers
 */

player.on('ready', function() {
  console.log('READY');
  console.warn('Chill: errors from froogaloop and CordivaCommunicationsProxy are normal.');

  /**
   * Bind button controls
   */
  
  bindPlay(player);
  bindPause(player);
  bindDestroy(player);
});

player.on('play', function() {
  console.log('PLAYING');
});

player.on('pause', function() {
  console.log('PAUSED');
});

player.on('end', function() {
  console.log('ENDED');
});

/**
 * Player controls
 */

function bindPlay(player) {
  var play = document.getElementById('play');

  play.addEventListener('click', function() {
    player.play();
  });
}

function bindPause(player) {
  var pause = document.getElementById('pause');

  pause.addEventListener('click', function() {
    player.pause();
  });
}

function bindDestroy(player) {
  var destroy = document.getElementById('destroy');

  destroy.addEventListener('click', function() {
    player.destroy();
    console.log('DESTROYED');
    console.warn('Events & methods are no longer bound to player.');
  });
}


