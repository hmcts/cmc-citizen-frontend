/* tslint:disable:no-unused-expression */
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'

chai.use(spies)
const expect = chai.expect

import { RequestLoggingHandler } from 'logging/requestPromiseLoggingHandler'
import { ApiLogger } from 'logging/apiLogger'

describe('RequestLoggingHandler', () => {
  let handler
  let proxy
  let options

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
  }

  let apiLogger = {
    logRequest: (requestData) => { },
    logResponse: (responseData) => { }
  }
  /* tslint:enable:no-empty */

  beforeEach(() => {
    options = {}
    handler = new RequestLoggingHandler(requestPromise, apiLogger as ApiLogger)
    proxy = new Proxy(requestPromise, handler)
  })

  it('should throw an error when initialised without request', () => {
    expect(() => new RequestLoggingHandler(undefined)).to.throw(Error)
  })

  describe('request-promise http calls proxy', () => {
    let logRequestCall

    beforeEach(() => {
      logRequestCall = sinon.spy(apiLogger, 'logRequest')
    })

    afterEach(() => {
      logRequestCall.restore()
    })

    const suiteParameters = [
      { paramName: 'options object', param: {} },
      { paramName: 'uri string', param: 'http://local.instance/some/path' }
    ]

    suiteParameters.forEach((suite) => {
      describe(`when passed an ${suite.paramName}`, () => {
        it('should handle logging on a get call', () => {
          proxy.get(suite.param)
          expect(logRequestCall).to.have.been.called
        })

        it('should handle logging on a put call', () => {
          proxy.put(suite.param)
          expect(logRequestCall).to.have.been.called
        })

        it('should handle logging on a post call', () => {
          proxy.post(suite.param)
          expect(logRequestCall).to.have.been.called
        })

        it('should handle logging on a del call', () => {
          proxy.del(suite.param)
          expect(logRequestCall).to.have.been.called
        })

        it('should handle logging on a delete call', () => {
          proxy.delete(suite.param)
          expect(logRequestCall).to.have.been.called
        })

        it('should handle logging on a patch call', () => {
          proxy.patch(suite.param)
          expect(logRequestCall).to.have.been.called
        })

        it('should handle logging on a head call', () => {
          proxy.head(suite.param)
          expect(logRequestCall).to.have.been.called
        })

        it('should not handle logging on other calls', () => {
          proxy.another(suite.param)
          expect(logRequestCall).not.to.have.been.called
        })
      })
    })
  })

  describe('async response logging', () => {
    let logResponseCall

    beforeEach(() => {
      logResponseCall = sinon.spy(apiLogger, 'logResponse')
    })

    afterEach(() => {
      logResponseCall.restore()
    })

    it('should log response on resolved promise', async () => {
      const responseBody = { statusCode: 200, body: { data: 'test' } }
      const asyncRequest = {
        get: () => Promise.resolve(responseBody),
        post: () => Promise.resolve(responseBody),
        put: () => Promise.resolve(responseBody),
        del: () => Promise.resolve(responseBody),
        delete: () => Promise.resolve(responseBody),
        patch: () => Promise.resolve(responseBody),
        head: () => Promise.resolve(responseBody),
        another: () => Promise.resolve(responseBody)
      }
      const asyncHandler = new RequestLoggingHandler(asyncRequest, apiLogger as ApiLogger)
      const asyncProxy = new Proxy(asyncRequest, asyncHandler)

      await asyncProxy.get({ uri: 'http://test/path' })
      expect(logResponseCall).to.have.been.called
    })

    it('should log response and rethrow on rejected promise', async () => {
      const err: any = new Error('Request failed')
      err.statusCode = 500
      err.body = { error: 'server error' }
      const asyncRequest = {
        get: () => Promise.reject(err),
        post: () => Promise.reject(err),
        put: () => Promise.reject(err),
        del: () => Promise.reject(err),
        delete: () => Promise.reject(err),
        patch: () => Promise.reject(err),
        head: () => Promise.reject(err),
        another: () => Promise.reject(err)
      }
      const asyncHandler = new RequestLoggingHandler(asyncRequest, apiLogger as ApiLogger)
      const asyncProxy = new Proxy(asyncRequest, asyncHandler)

      try {
        await asyncProxy.get({ uri: 'http://test/path' })
        chai.expect.fail('should have thrown')
      } catch (e) {
        expect(logResponseCall).to.have.been.called
        expect(e.message).to.equal('Request failed')
      }
    })

    it('should not log response for non-http methods even on promise', async () => {
      const asyncRequest = {
        get: () => Promise.resolve('ok'),
        post: () => Promise.resolve('ok'),
        put: () => Promise.resolve('ok'),
        del: () => Promise.resolve('ok'),
        delete: () => Promise.resolve('ok'),
        patch: () => Promise.resolve('ok'),
        head: () => Promise.resolve('ok'),
        another: () => Promise.resolve('ok')
      }
      const asyncHandler = new RequestLoggingHandler(asyncRequest, apiLogger as ApiLogger)
      const asyncProxy = new Proxy(asyncRequest, asyncHandler)

      await asyncProxy.another({})
      expect(logResponseCall).not.to.have.been.called
    })

    it('should return non-function properties unchanged', () => {
      const objWithProp = { get: () => {}, myProp: 'hello' }
      const h = new RequestLoggingHandler(objWithProp, apiLogger as ApiLogger)
      const p = new Proxy(objWithProp, h)
      expect(p.myProp).to.equal('hello')
    })
  })

  describe('static proxy', () => {
    it('should create a logging proxy', () => {
      const mockReq = {
        get: () => {},
        post: () => {},
        put: () => {},
        del: () => {},
        delete: () => {},
        patch: () => {},
        head: () => {}
      }
      const proxied = RequestLoggingHandler.proxy(mockReq as any)
      expect(proxied).to.not.equal(mockReq)
    })
  })

})
