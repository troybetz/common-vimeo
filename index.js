/**
 * Module dependencies
 */

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
 * Create a controller for the embedded video
 *
 * @param {String} id of embedded video
 * @api private
 */

Vimeo.prototype.createPlayer = function(id) {
  var self = this;
  
  sdk(function(err, Froogaloop) {
    self.player = window.Froogaloop(id);
  });
};
