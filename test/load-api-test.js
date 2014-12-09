/**
 * Module dependencies
 */

var assert = require('assert');
var sinon = require('sinon');
var proxyquire = require('proxyquireify')(require);

var requireSDKStub;
var loadAPI;

describe('load-api', function() {
  before(function() {

    /**
     * Mock out network requests
     */
    
    requireSDKStub = sinon.stub().returns({
      trigger: function() { return noop; }
    });

    loadAPI = proxyquire('../lib/load-api', {
      'require-sdk': requireSDKStub
    });
  });

  it('should load the Vimeo API wrapper', function() {
    loadAPI();
    assert.ok(requireSDKStub.calledWith('http://f.vimeocdn.com/js/froogaloop2.min.js'));
  });
});
