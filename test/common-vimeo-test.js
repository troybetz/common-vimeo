/**
 * Module dependencies
 */

var EventEmitter = require('events');
var assert = require('assert');
var sinon = require('sinon');
var proxyquire = require('proxyquireify')(require);

var vimeoEmbed;
var playerStub;
var loadAPIStub;
var Vimeo;

describe('common-vimeo', function() {
  beforeEach(function() {

    /**
     * Add a fake embedded video to control
     */
    
    vimeoEmbed = document.createElement('iframe');
    vimeoEmbed.src = '#';
    vimeoEmbed.id = 'vimeo-embed';
    document.body.appendChild(vimeoEmbed);

    /**
     * Create new `playerStub`
     *
     * Implements event system for binding only. Unbinding not supported.
     */

    playerStub = new EventEmitter();
    playerStub.addEvent = playerStub.addListener; // real
    playerStub.removeEvent = sinon.spy();
    playerStub.api = sinon.spy();

    /**
     * Vimeo iframe wrapper API
     */
    
    window.Froogaloop = sinon.stub().returns(playerStub);

    /**
     * Stub out load-api, return our api stub
     */
    
    loadAPIStub = sinon.stub().returns(function(cb) {
      cb(null, window.Froogaloop);
    });

    /**
     * Magic happens
     */
    
    Vimeo = proxyquire('../', {
      './lib/load-api': loadAPIStub
    });
  });

  afterEach(function() {
    document.body.removeChild(vimeoEmbed);
  });

  describe('intialization', function() {
    it('should load the Vimeo API wrapper', function() {
      var player = new Vimeo('vimeo-embed');
      assert.ok(loadAPIStub.called);
    });

    it('should create a new Froogaloop instance', function() {
      var player = new Vimeo('vimeo-embed');
      assert.ok(Froogaloop.calledWith('vimeo-embed'));
    });
  });

  describe('functionality', function() {
    it('can play a track', function() {
      var player = new Vimeo('vimeo-embed');
      player.play();

      assert.ok(playerStub.api.calledWith('play'));
    });

    it('can pause a track', function() {
      var player = new Vimeo('vimeo-embed');
      player.pause();

      assert.ok(playerStub.api.calledWith('pause'));
    });
  });

  describe('events', function() {
    it('should emit `ready` when loaded', function(done) {
      var player = new Vimeo('vimeo-embed');
      player.on('ready', done);

      playerStub.emit('ready');
    });

    /**
     * Event bindings happen inside of `ready` event, so we 
     * need to manually trigger it each time to make sure following
     * events & handlers are bound.
     */
    
    it('should emit `play` when playing', function(done) {
      var player = new Vimeo('vimeo-embed');

      player.on('play', done);

      playerStub.emit('ready');
      playerStub.emit('play');
    });

    it('should emit `pause` when paused', function(done) {
      var player = new Vimeo('vimeo-embed');

      player.on('pause', done);
      
      playerStub.emit('ready');
      playerStub.emit('pause');
    });

    it('should emit `end` when finished', function(done) {
      var player = new Vimeo('vimeo-embed');

      player.on('end', done);

      playerStub.emit('ready');
      playerStub.emit('finish');
    });
  });

  describe('destruction', function() {
    it('should remove player event listeners', function() {
      var player = new Vimeo('vimeo-embed');
      player.destroy();

      assert.equal(playerStub.removeEvent.callCount, 4);
    });

    it('should delete its internal player', function() {
      var player = new Vimeo('vimeo-embed');
      player.destroy();

      assert.equal(player.player, undefined);
    });
  });
});
