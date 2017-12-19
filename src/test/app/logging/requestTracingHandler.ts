/* tslint:disable:no-unused-expression */
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'

chai.use(spies)
const expect = chai.expect

import { RequestTracingHeaders as Headers } from '@hmcts/nodejs-logging'

import { RequestTracingHandler } from 'logging/requestTracingHandler'
import { HttpMethods } from 'logging/httpProxyCallInterceptor'

describe('RequestTracingHandler', () => {
  const existingHeaders = {
    'Existing-Header': 'Some value'
  }

  const requestPromise = {
    get: sinon.stub(),
    post: sinon.stub(),
    put: sinon.stub(),
    del: sinon.stub(),
    delete: sinon.stub(),
    patch: sinon.stub(),
    head: sinon.stub(),
    otherMethod: sinon.stub()
  }

  const MockedRequestTracing = {
    getRootRequestId: () => 'test-root-request-id',
    createNextRequestId: () => 'test-next-request-id',
    getCurrentRequestId: () => 'test-current-request-id'
  }

  const tracingHeaders = { }
  tracingHeaders[Headers.REQUEST_ID_HEADER] = MockedRequestTracing.createNextRequestId()
  tracingHeaders[Headers.ROOT_REQUEST_ID_HEADER] = MockedRequestTracing.getRootRequestId()
  tracingHeaders[Headers.ORIGIN_REQUEST_ID_HEADER] = MockedRequestTracing.getCurrentRequestId()

  let proxy
  let handler

  beforeEach(() => {
    Object.keys(requestPromise).forEach((httpMethod) => {
      requestPromise[httpMethod].reset()
    })
    handler = new RequestTracingHandler(requestPromise as any, MockedRequestTracing)
    proxy = new Proxy(requestPromise, handler)
  })

  it('should throw an error when initialised without request', () => {
    expect(() => new RequestTracingHandler(undefined)).to.throw(Error)
  })

  it('should not alter the call when calling a non-http method function', () => {
    proxy.otherMethod(123, '456', [789])
    expect(proxy.otherMethod).to.have.been.calledWith(123, '456', [789])
  })

  context('when calling the proxy by providing URI as a string', () => {
    HttpMethods.forEach((httpMethod) => {
      it(`should pass tracing headers to the internal object on ${httpMethod} call`, () => {
        proxy[httpMethod]('http://google.com')
        expect(requestPromise[httpMethod]).to.have.been.calledWith({
          uri: 'http://google.com',
          headers: tracingHeaders
        })
      })
    })
  })

  context('when calling the proxy by providing options object with existing properties', () => {
    HttpMethods.forEach((httpMethod) => {
      it(`should add tracing headers to the internal object on ${httpMethod} call`, () => {
        proxy[httpMethod]({
          uri: 'http://google.com',
          headers: existingHeaders,
          qs: '?key=value'
        })
        expect(requestPromise[httpMethod]).to.have.been.calledWith({
          uri: 'http://google.com',
          headers: {
            ...existingHeaders,
            ...tracingHeaders
          },
          qs: '?key=value'
        })
      })
    })
  })

  context('when calling the proxy by providing URI string and options object with existing properties', () => {
    HttpMethods.forEach((httpMethod) => {
      it(`should add tracing headers to the internal object on ${httpMethod} call`, () => {
        proxy[httpMethod]('http://google.com', {
          headers: existingHeaders,
          qs: '?key=value'
        })
        expect(requestPromise[httpMethod]).to.have.been.calledWith({
          uri: 'http://google.com',
          headers: {
            ...existingHeaders,
            ...tracingHeaders
          },
          qs: '?key=value'
        })
      })
    })
  })
})
