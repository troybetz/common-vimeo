/**
 * Module dependencies
 */

var EventEmitter = require('events');
var loadAPI = require('./lib/load-api');
var prepareEmbed = require('./lib/prepare-embed');

var sdk;

/**
 * Expose `Vimeo`
 */

module.exports = Vimeo;

/**
 * Create new `Vimeo` player
 *
 * @param {String} id of embedded video
 */

function Vimeo(id) {
  sdk = loadAPI();
  prepareEmbed(id);
  this.createPlayer(id);
}

/**
 * Mixin events
 */

Vimeo.prototype = new EventEmitter();

/**
 * Play the video.
 *
 * @api public
 */

Vimeo.prototype.play = function() {
  this.player.api('play');
};

/**
 * Pause the video.
 *
 * @api public
 */

Vimeo.prototype.pause = function() {
  this.player.api('pause');
};

/**
 * Destroy a player
 *
 * @api public
 */

Vimeo.prototype.destroy = function() {
  this.unbindEvents();
  delete this.player;
};

/**
 * Create a controller for the embedded video
 *
 * @param {String} id of embedded video
 * @api private
 */

Vimeo.prototype.createPlayer = function(id) {
  var self = this;
  
  sdk(function(err, Froogaloop) {
    self.player = window.Froogaloop(id);
    self.bindEvents();
  });
};

/**
 * Bind events to player
 *
 * @api private
 */

Vimeo.prototype.bindEvents = function() {
  var self = this;

  self.player.addEvent('ready', function() {
    self.emit('ready');

    self.player.addEvent('play', function() {
      self.emit('play');
    });

    self.player.addEvent('pause', function() {
      self.emit('pause');
    });

    self.player.addEvent('finish', function() {
      self.emit('end');
    });
  });
};

/**
 * Unbind all player events
 *
 * @api private
 */

Vimeo.prototype.unbindEvents = function() {
  this.player.removeEvent('ready');
  this.player.removeEvent('play');
  this.player.removeEvent('pause');
  this.player.removeEvent('finish');
};
