/* tslint:disable:no-unused-expression */
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'

chai.use(spies)
const expect = chai.expect

import { RequestTracingHandler } from 'logging/requestTracingHandler'

describe('RequestTracingHandler', () => {
  let proxy
  let handler

  const requestPromise = {
    get: sinon.stub(),
    post: sinon.stub(),
    put: sinon.stub(),
    del: sinon.stub(),
    delete: sinon.stub(),
    patch: sinon.stub(),
    head: sinon.stub()
  }

  const MockedRequestTracing = {
    getRootRequestId: () => 'test-root-request-id',
    createNextRequestId: () => 'test-next-request-id',
    getCurrentRequestId: () => 'test-current-request-id'
  }

  const tracingHeaders = {
    'Request-Id': MockedRequestTracing.createNextRequestId(),
    'Root-Request-Id': MockedRequestTracing.getRootRequestId(),
    'Origin-Request-Id': MockedRequestTracing.getCurrentRequestId()
  }

  beforeEach(() => {
    Object.keys(requestPromise).forEach((httpMethod) => {
      requestPromise[httpMethod].reset()
    })
    handler = new RequestTracingHandler(requestPromise, MockedRequestTracing)
    proxy = new Proxy(requestPromise, handler)
  })

  context('when calling the proxy by providing URI as a string', () => {
    Object
      .keys(requestPromise)
      .forEach((httpMethod) => {
        it(`should pass tracing headers to the internal object on ${httpMethod} call`, () => {
          proxy[httpMethod]('http://google.com')
          expect(requestPromise[httpMethod]).to.have.been.calledWith({
            uri: 'http://google.com',
            headers: tracingHeaders
          })
        })
      })
  })

  context('when calling the proxy by providing options object with existing headers', () => {
    const existingHeaders = {
      'Existing-Header': 'Some value'
    }

    Object
      .keys(requestPromise)
      .forEach((httpMethod) => {
        it(`should add tracing headers to the internal object on ${httpMethod} call`, () => {
          proxy[httpMethod]({
            uri: 'http://google.com',
            headers: existingHeaders
          })
          expect(requestPromise[httpMethod]).to.have.been.calledWith({
            uri: 'http://google.com',
            headers: {
              ...existingHeaders,
              ...tracingHeaders
            }
          })
        })
      })
  })

  context('when calling the proxy by providing uri string and options object with existing headers', () => {
    const existingHeaders = {
      'Existing-Header': 'Some value'
    }

    Object
      .keys(requestPromise)
      .forEach((httpMethod) => {
        it(`should add tracing headers to the internal object on ${httpMethod} call`, () => {
          proxy[httpMethod]('http://google.com', {
            headers: existingHeaders
          })
          expect(requestPromise[httpMethod]).to.have.been.calledWith({
            uri: 'http://google.com',
            headers: {
              ...existingHeaders,
              ...tracingHeaders
            }
          })
        })
      })
  })
})
