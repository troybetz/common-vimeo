/**
 * Module dependencies
 */

var load = require('require-sdk');

/**
 * Expose `loadAPI`
 */

module.exports = loadAPI;

/**
 * Load the Vimeo iframe wrapper API
 *
 * @returns {Function}
 */

function loadAPI() {
  var sdk = load('//f.vimeocdn.com/js/froogaloop2.min.js');
  return sdk;
}
