var sinon = require('sinon');
var assert = require('assert');
var EventHandler = require('event-handler');

describe('Device Manager', function (){
    
    it('isMobile() should return false if nav user agent is empty string', function (){
        var userAgentMock = '';
        var eventManagerCreateTargetStub = sinon.stub(EventHandler, 'createTarget');
        var eventManagerDestroyTargetStub = sinon.stub(EventHandler, 'destroyTarget');
        var device = require('./../src/device-manager');
        var getUserAgentStub = sinon.stub(device, 'getUserAgent').returns(userAgentMock);
        assert.equal(device.isMobile(), false);
        device.destroy();
        eventManagerCreateTargetStub.restore();
        eventManagerDestroyTargetStub.restore();
        getUserAgentStub.restore();
    });

    it('Chrome for Android should return true for isMobile() and when passing "android" to isOS()', function (){
        var userAgentMock = 'Mozilla/5.0 (Linux; Android 4.0.4; ' +
            'Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) ' +
            'Chrome/18.0.1025.133 Mobile Safari/535.19';
        var eventManagerCreateTargetStub = sinon.stub(EventHandler, 'createTarget');
        var eventManagerDestroyTargetStub = sinon.stub(EventHandler, 'destroyTarget');
        var device = require('./../src/device-manager');
        var getUserAgentStub = sinon.stub(device, 'getUserAgent').returns(userAgentMock);
        assert.equal(device.isMobile(), true, 'isMobile() returns true');
        assert.equal(device.isBrowser('chrome'), true, 'isBrowser() returns true');
        assert.equal(device.isOS('android'), true, 'isOS() returns true');
        device.destroy();
        eventManagerCreateTargetStub.restore();
        eventManagerDestroyTargetStub.restore();
        getUserAgentStub.restore();
    });

    it('isBrowser("safari") should return false, even when useragent string contains the word "safari" like in Mac\'s Chrome', function (){
        var chromeUserAgentMock = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) " +
            "Chrome/42.0.2311.90 Safari/537.36";
        var eventManagerCreateTargetStub = sinon.stub(EventHandler, 'createTarget');
        var eventManagerDestroyTargetStub = sinon.stub(EventHandler, 'destroyTarget');
        var device = require('./../src/device-manager');
        var getUserAgentStub = sinon.stub(device, 'getUserAgent').returns(chromeUserAgentMock);
        assert.equal(device.isBrowser('safari'), false);
        device.destroy();
        eventManagerCreateTargetStub.restore();
        eventManagerDestroyTargetStub.restore();
        getUserAgentStub.restore();
    });

    it('isBrowser() should return true if nothing is passed to it', function (){
        var userAgentMock = '';
        var eventManagerCreateTargetStub = sinon.stub(EventHandler, 'createTarget');
        var eventManagerDestroyTargetStub = sinon.stub(EventHandler, 'destroyTarget');
        var device = require('./../src/device-manager');
        var getUserAgentStub = sinon.stub(device, 'getUserAgent').returns(userAgentMock);
        assert.equal(device.isBrowser(), true);
        device.destroy();
        eventManagerCreateTargetStub.restore();
        eventManagerDestroyTargetStub.restore();
        getUserAgentStub.restore();
    });
});
