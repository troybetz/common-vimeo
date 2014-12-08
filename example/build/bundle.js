(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Module dependencies
 */

var Vimeo = require('../');

/**
 * Create new player
 */

window.player = new Vimeo('vimeo-embed');

},{"../":2}],2:[function(require,module,exports){
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
    var el = document.getElementById(id);
    self.player = window.Froogaloop(id);
    self.player.addEvent('ready', function() {
      console.log("READY");
      self.player.api('play');
    });
  });
};

},{"./lib/load-api":3,"./lib/prepare-embed":4}],3:[function(require,module,exports){
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

},{"require-sdk":5}],4:[function(require,module,exports){
/**
 * Expose `prepareEmbed`
 */

module.exports = prepareEmbed;

/**
 * Prepare an iframe for API control. 
 *
 * Embedded Vimeo videos require `api` & `player_id`
 * parameters set to be controlled.
 *
 * @param {String} embedID - id of iframe to prepare
 */

function prepareEmbed(embedID) {
  var embed = document.getElementById(embedID);

  if (!isEmbeddedVideo(embed)) {
    throw new Error('embed must be an iframe');
  }

  enableAPIControl(embed);
}

/**
 * Enable API control via `embed.src` parameters
 *
 * @param {Object} embed
 */

function enableAPIControl(embed) {
  if (!isAPIEnabled(embed)) {
    embed.src += '?api=1&player_id=' + embed.id;
  }
}

/**
 * Determine if required `src` parameters are included in `embed`
 *
 * @param {Object} embed
 * @returns {Boolean}
 */

function isAPIEnabled(embed) {
  var regex = '\/?api=1&player_id=' + embed.id;
  regex = new RegExp(regex);
  return regex.test(embed.src);
}

/**
 * @param {Object} [embed]
 * @returns {Boolean}
 */

function isEmbeddedVideo(embed) {
  return embed && embed.tagName === 'IFRAME';
}

},{}],5:[function(require,module,exports){
var pubsub = require("pubsub");
var loadScript = require("load-script");

module.exports = requireSDK;

function requireSDK (url, global) {
  var onReady = pubsub();

  var hasManualTrigger;
  var isLoading;
  var isLoaded;

  load.trigger = setManualTrigger;

  return load;

  function isAlreadyLoaded () {
    return window[global];
  }

  function load (callback) {
    if (isAlreadyLoaded() || isLoaded) {
      return callback && callback(undefined, window[global]);
    }

    callback && onReady.subscribe(callback);

    if (isLoading) return;

    isLoading = true;

    if (!url) return;

    loadScript(url, function (error) {
      if (hasManualTrigger) return;

      if (error) {
        isLoaded = true;
        return onReady.publish(error);
      }

      trigger();
    });

  };

  function trigger () {
    isLoaded = true;
    onReady.publish(undefined, global ? window[global] : undefined);
  }

  function setManualTrigger () {
    hasManualTrigger = true;
    return trigger;
  }


}

},{"load-script":6,"pubsub":7}],6:[function(require,module,exports){

module.exports = function load (src, cb) {
  var head = document.head || document.getElementsByTagName('head')[0]
  var script = document.createElement('script')

  cb = cb || function() {};

  script.type = 'text/javascript'
  script.charset = 'utf8'
  script.async = true
  script.src = src

  var onend = 'onload' in script ? stdOnEnd : ieOnEnd
  onend(script, cb)

  // some good legacy browsers (firefox) fail the 'in' detection above
  // so as a fallback we always set onload
  // old IE will ignore this and new IE will set onload
  if (!script.onload) {
    stdOnEnd(script, cb);
  }

  head.appendChild(script)
}

function stdOnEnd (script, cb) {
  script.onload = function () {
    this.onerror = this.onload = null
    cb()
  }
  script.onerror = function () {
    // this.onload = null here is necessary
    // because even IE9 works not like others
    this.onerror = this.onload = null
    cb(new Error('Failed to load ' + this.src))
  }
}

function ieOnEnd (script, cb) {
  script.onreadystatechange = function () {
    if (this.readyState != 'complete' && this.readyState != 'loaded') return
    this.onreadystatechange = null
    cb(null, true) // there is no way to catch loading errors in IE8
  }
}

},{}],7:[function(require,module,exports){
module.exports = PubSub;

function PubSub(mix){

  var proxy = mix || function pubsubProxy(){
    arguments.length && sub.apply(undefined, arguments);
  };

  function sub(callback){
    subscribe(proxy, callback);
  }

  function subOnce(callback){
    once(proxy, callback);
  }

  function unsubOnce(callback){
    unsubscribeOnce(proxy, callback);
  }

  function unsub(callback){
    unsubscribe(proxy, callback);
  }

  function pub(){
    var args = [proxy];
    Array.prototype.push.apply(args, arguments);
    publish.apply(undefined, args);
  }

  proxy.subscribers        = [];
  proxy.subscribersForOnce = [];

  proxy.subscribe          = sub;
  proxy.subscribe.once     = subOnce;
  proxy.unsubscribe        = unsub;
  proxy.unsubscribe.once   = unsubOnce;
  proxy.publish            = pub;

  return proxy;
}

/**
 * Publish "from" by applying given args
 *
 * @param {Function} from
 * @param {...Any} args
 */
function publish(from){

  var args = Array.prototype.slice.call(arguments, 1);

  if (from && from.subscribers && from.subscribers.length > 0) {
    from.subscribers.forEach(function(cb, i){
      if(!cb) return;

      try {
        cb.apply(undefined, args);
      } catch(exc) {
        setTimeout(function(){ throw exc; }, 0);
      }
    });
  }

  if (from && from.subscribersForOnce && from.subscribersForOnce.length > 0) {
    from.subscribersForOnce.forEach(function(cb, i){
      if(!cb) return;

      try {
        cb.apply(undefined, args);
      } catch(exc) {
        setTimeout(function(){ throw exc; }, 0);
      }
    });

    from.subscribersForOnce = [];

  }

}

/**
 * Subscribe callback to given pubsub object.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function subscribe(to, callback){
  if(!callback) return false;
  return to.subscribers.push(callback);
}


/**
 * Subscribe callback to given pubsub object for only one publish.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function once(to, callback){
  if(!callback) return false;

  return to.subscribersForOnce.push(callback);
}

/**
 * Unsubscribe callback to given pubsub object.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function unsubscribe(to, callback){
  var i = to.subscribers.length;

  while(i--){
    if(to.subscribers[i] && to.subscribers[i] == callback){
      to.subscribers[i] = undefined;

      return i;
    }
  }

  return false;
}


/**
 * Unsubscribe callback subscribed for once to specified pubsub.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 * @return {Boolean or Number}
 */
function unsubscribeOnce(to, callback){
  var i = to.subscribersForOnce.length;

  while(i--){
    if(to.subscribersForOnce[i] && to.subscribersForOnce[i] == callback){
      to.subscribersForOnce[i] = undefined;

      return i;
    }
  }

  return false;
}

},{}]},{},[1]);
