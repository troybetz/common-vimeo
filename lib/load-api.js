/**
 * Module dependencies
 */

var load = require('require-sdk');

/**
 * Expose `loadAPI`
 */

module.exports = loadAPI;

/**
 * Load the SoundCloud Widget API
 *
 * @returns {Function}
 */

function loadAPI() {
  var sdk = load('http://f.vimeocdn.com/js/froogaloop2.min.js');
  return sdk;
}