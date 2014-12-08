/**
 * Module dependencies
 */

var assert = require('assert');
var sinon = require('sinon');
var proxyquire = require('proxyquireify')(require);

var vimeoEmbed;
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
     * Stub out Vimeo player wrapper.
     */
    
    window.Froogaloop = sinon.stub();

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
});
