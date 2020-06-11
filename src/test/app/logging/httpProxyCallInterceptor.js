"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai = require("chai");
const sinon = require("sinon");
const spies = require("sinon-chai");
chai.use(spies);
const expect = chai.expect;
const httpProxyCallInterceptor_1 = require("logging/httpProxyCallInterceptor");
describe('HttpProxyCallInterceptor', () => {
    describe('intercept', () => {
        const callHandler = (target, key, callArgs) => {
            callArgs[0] = 123;
            callArgs[1] = '456';
            callArgs[2] = [789];
        };
        context('when calling HTTP methods', () => {
            const service = {};
            httpProxyCallInterceptor_1.HttpMethods.forEach((httpMethod) => {
                it(`should apply provided call handler when calling ${httpMethod} HTTP method`, () => {
                    service[httpMethod] = sinon.stub();
                    const interceptedFunction = httpProxyCallInterceptor_1.HttpProxyCallInterceptor.intercept(service, httpMethod, callHandler);
                    interceptedFunction();
                    expect(service[httpMethod]).to.have.been.calledWith(123, '456', [789]);
                });
            });
        });
        describe('when calling non-HTTP methods', () => {
            const service = {
                someMethod: sinon.stub()
            };
            it('should not apply the call handler when not calling a HTTP method', () => {
                const interceptedFunction = httpProxyCallInterceptor_1.HttpProxyCallInterceptor.intercept(service, 'someMethod', callHandler);
                interceptedFunction('this should not be modified');
                expect(service.someMethod).to.have.been.calledWith('this should not be modified');
            });
        });
    });
});
