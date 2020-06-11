"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai = require("chai");
const sinon = require("sinon");
const spies = require("sinon-chai");
chai.use(spies);
const expect = chai.expect;
const requestPromiseLoggingHandler_1 = require("logging/requestPromiseLoggingHandler");
describe('RequestLoggingHandler', () => {
    let handler;
    let proxy;
    let options;
    /* tslint:disable:no-empty allow empty for mocking */
    let requestPromise = {
        get: (options) => { },
        post: (options) => { },
        put: (options) => { },
        del: (options) => { },
        delete: (options) => { },
        patch: (options) => { },
        head: (options) => { },
        another: (options) => { }
    };
    let apiLogger = {
        logRequest: (requestData) => { },
        logResponse: (responseData) => { }
    };
    /* tslint:enable:no-empty */
    beforeEach(() => {
        options = {};
        handler = new requestPromiseLoggingHandler_1.RequestLoggingHandler(requestPromise, apiLogger);
        proxy = new Proxy(requestPromise, handler);
    });
    it('should throw an error when initialised without request', () => {
        expect(() => new requestPromiseLoggingHandler_1.RequestLoggingHandler(undefined)).to.throw(Error);
    });
    describe('request-promise http calls proxy', () => {
        let logRequestCall;
        beforeEach(() => {
            logRequestCall = sinon.spy(apiLogger, 'logRequest');
        });
        afterEach(() => {
            logRequestCall.restore();
        });
        const suiteParameters = [
            { paramName: 'options object', param: {} },
            { paramName: 'uri string', param: 'http://local.instance/some/path' }
        ];
        suiteParameters.forEach((suite) => {
            describe(`when passed an ${suite.paramName}`, () => {
                it('should handle logging on a get call', () => {
                    proxy.get(suite.param);
                    expect(logRequestCall).to.have.been.called;
                });
                it('should handle logging on a put call', () => {
                    proxy.put(suite.param);
                    expect(logRequestCall).to.have.been.called;
                });
                it('should handle logging on a post call', () => {
                    proxy.post(suite.param);
                    expect(logRequestCall).to.have.been.called;
                });
                it('should handle logging on a del call', () => {
                    proxy.del(suite.param);
                    expect(logRequestCall).to.have.been.called;
                });
                it('should handle logging on a delete call', () => {
                    proxy.delete(suite.param);
                    expect(logRequestCall).to.have.been.called;
                });
                it('should handle logging on a patch call', () => {
                    proxy.patch(suite.param);
                    expect(logRequestCall).to.have.been.called;
                });
                it('should handle logging on a head call', () => {
                    proxy.head(suite.param);
                    expect(logRequestCall).to.have.been.called;
                });
                it('should not handle logging on other calls', () => {
                    proxy.another(suite.param);
                    expect(logRequestCall).not.to.have.been.called;
                });
            });
        });
    });
    describe('handleLogging', () => {
        let originalCallback;
        beforeEach(() => {
            originalCallback = sinon.spy();
        });
        it('should assign a callback to the options object', () => {
            handler.handleLogging('any', options);
            // tslint:disable:disable-next-line no-unused-expression allow chai to be used without ()
            expect(options.callback).not.to.be.undefined;
        });
        it('should override the originally assigned callback', () => {
            options.callback = originalCallback;
            handler.handleLogging('any', options);
            expect(options.callback).not.to.equal(originalCallback);
        });
        it('should call the original callback defined in options object', () => {
            options.callback = originalCallback;
            handler.handleLogging('any', options);
            options.callback();
            expect(originalCallback).to.have.been.called;
        });
    });
});
