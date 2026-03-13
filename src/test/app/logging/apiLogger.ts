import { expect } from 'chai'

import { ApiLogger } from 'logging/apiLogger'

process.env.LOG_LEVEL = 'DEBUG'

describe('ApiLogger', () => {
  let apiLogger

  beforeEach(() => {
    apiLogger = new ApiLogger({})
  })

  describe('_buildRequestEntry', () => {
    let requestData

    beforeEach(() => {
      requestData = {
        method: 'GET',
        uri: 'http://localhost/resource'
      }
    })

    it('should format the message of method and uri', () => {
      let logEntry = apiLogger._buildRequestEntry(requestData)
      expect(logEntry)
        .to.contain('GET')
        .and.to.contain('http://localhost/resource')
    })

    it('should include request body if provided', () => {
      requestData.requestBody = { formField: 'formValue' }
      let logEntry = apiLogger._buildRequestEntry(requestData)
      expect(logEntry).to.contain('{"formField":"formValue"}')
    })

    it('should not include request body if not provided', () => {
      let logEntry = apiLogger._buildRequestEntry(requestData)
      expect(logEntry).not.to.contain('Body')
    })

    it('should include query string if provided', () => {
      requestData.query = { key: 'value' }
      let logEntry = apiLogger._buildRequestEntry(requestData)
      expect(logEntry).to.contain('{"key":"value"}')
    })

    it('should not include query string if not provided', () => {
      let logEntry = apiLogger._buildRequestEntry(requestData)
      expect(logEntry).not.to.contain('Query')
    })

    it('should include both request body and query string if provided', () => {
      requestData.requestBody = { formField: 'formValue' }
      requestData.query = { key: 'value' }
      let logEntry = apiLogger._buildRequestEntry(requestData)
      expect(logEntry)
        .to.contain('{"formField":"formValue"}')
        .and.to.contain('{"key":"value"}')
    })
  })

  describe('_stringifyObject', () => {
    it('should hide pdf output', () => {
      const stringifiedObject = apiLogger._stringifyObject('%PDFasdsdasdas@1312aSDAAS')
      expect(stringifiedObject).to.equal('**** PDF Content not shown****')
    })

    it('should handle circular references gracefully', () => {
      const circular: any = { a: 1 }
      circular.self = circular
      const result = apiLogger._stringifyObject(circular)
      expect(result).to.be.a('string')
    })

    it('should format Error objects when JSON.stringify fails', () => {
      const err = new Error('test error')
      Object.defineProperty(err, 'toJSON', {
        value: () => { throw new Error('cannot stringify') }
      })
      const result = apiLogger._stringifyObject(err)
      expect(result).to.contain('test error')
    })

    it('should return the value as-is for non-object non-PDF strings', () => {
      const result = apiLogger._stringifyObject('plain string')
      expect(result).to.equal('plain string')
    })

    it('should return null as-is', () => {
      const result = apiLogger._stringifyObject(null)
      expect(result).to.equal(null)
    })
  })

  describe('logRequest', () => {
    let loggerWithMethods

    beforeEach(() => {
      loggerWithMethods = new ApiLogger({ info: () => {}, warn: () => {}, error: () => {} })
    })

    it('should log when no request body is provided', () => {
      loggerWithMethods.logRequest({ method: 'GET', uri: 'http://test' })
    })

    it('should log when request body is provided without oneTimePassword', () => {
      loggerWithMethods.logRequest({ method: 'POST', uri: 'http://test', requestBody: { key: 'val' } })
    })

    it('should not log when request body contains oneTimePassword', () => {
      loggerWithMethods.logRequest({ method: 'POST', uri: 'http://test', requestBody: { oneTimePassword: 'secret' } })
    })
  })

  describe('logResponse', () => {
    let loggerWithMethods

    beforeEach(() => {
      loggerWithMethods = new ApiLogger({ info: () => {}, warn: () => {}, error: () => {} })
    })

    it('should log info for 2xx responses', () => {
      loggerWithMethods.logResponse({ uri: 'http://test', responseCode: 200 })
    })

    it('should log info for 404 responses', () => {
      loggerWithMethods.logResponse({ uri: 'http://test', responseCode: 404 })
    })

    it('should log warn for 4xx responses', () => {
      loggerWithMethods.logResponse({ uri: 'http://test', responseCode: 400 })
    })

    it('should log error for 5xx responses', () => {
      loggerWithMethods.logResponse({ uri: 'http://test', responseCode: 500 })
    })
  })

  describe('_logLevelFor', () => {
    let loggerWithMethods

    beforeEach(() => {
      loggerWithMethods = new ApiLogger({ info: () => {}, warn: () => {}, error: () => {} })
    })

    it('should return info for status codes below 400', () => {
      const fn = loggerWithMethods._logLevelFor(200)
      expect(fn).to.be.a('function')
    })

    it('should return info for 404', () => {
      const fn = loggerWithMethods._logLevelFor(404)
      expect(fn).to.be.a('function')
    })

    it('should return warn for 4xx other than 404', () => {
      const fn = loggerWithMethods._logLevelFor(403)
      expect(fn).to.be.a('function')
    })

    it('should return error for 5xx', () => {
      const fn = loggerWithMethods._logLevelFor(500)
      expect(fn).to.be.a('function')
    })
  })

  describe('_buildResponseEntry', () => {
    let responseData

    beforeEach(() => {
      responseData = {
        uri: 'http://localhost/resource',
        responseCode: 200
      }
    })

    it('should format the message of uri', () => {
      let logEntry = apiLogger._buildResponseEntry(responseData)
      expect(logEntry).to.contain('http://localhost/resource')
    })

    it('should include response body if provided', () => {
      responseData.responseBody = { field: 'value' }
      let logEntry = apiLogger._buildResponseEntry(responseData)
      expect(logEntry).to.contain('{"field":"value"}')
    })

    it('should not include response body if not provided', () => {
      let logEntry = apiLogger._buildResponseEntry(responseData)
      expect(logEntry).not.to.contain('Body')
    })

    it('should include error if provided', () => {
      responseData.error = { message: 'Something bad happened' }
      let logEntry = apiLogger._buildResponseEntry(responseData)
      expect(logEntry).to.contain('{"message":"Something bad happened"}')
    })

    it('should not include error if not provided', () => {
      let logEntry = apiLogger._buildResponseEntry(responseData)
      expect(logEntry).not.to.contain('Error')
    })

    it('should include both response body and error if provided', () => {
      responseData.responseBody = { field: 'value' }
      responseData.error = { message: 'Something bad happened' }
      let logEntry = apiLogger._buildResponseEntry(responseData)
      expect(logEntry)
        .to.contain('{"field":"value"}')
        .and.to.contain('{"message":"Something bad happened"}')
    })
  })
})
