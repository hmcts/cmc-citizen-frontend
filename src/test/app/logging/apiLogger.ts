import { expect } from 'chai'

import { RequestTracingHeaders as Headers } from '@hmcts/nodejs-logging'
import { ApiLogger } from 'logging/apiLogger'

process.env.LOG_LEVEL = 'DEBUG'

describe('ApiLogger', () => {
  const headers = { }
  headers[Headers.REQUEST_ID_HEADER] = 'test-request-id'
  headers[Headers.ROOT_REQUEST_ID_HEADER] = 'test-root-request-id'
  headers[Headers.ORIGIN_REQUEST_ID_HEADER] = 'test-origin-request-id'

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
      expect(logEntry.message)
        .to.contain('GET')
        .and.to.contain('http://localhost/resource')
    })

    it('should include request body if provided', () => {
      requestData.requestBody = { formField: 'formValue' }
      let logEntry = apiLogger._buildRequestEntry(requestData)
      expect(logEntry.message).to.contain('{"formField":"formValue"}')
    })

    it('should not include request body if not provided', () => {
      let logEntry = apiLogger._buildRequestEntry(requestData)
      expect(logEntry.message).not.to.contain('Body')
    })

    it('should include query string if provided', () => {
      requestData.query = { key: 'value' }
      let logEntry = apiLogger._buildRequestEntry(requestData)
      expect(logEntry.message).to.contain('{"key":"value"}')
    })

    it('should not include query string if not provided', () => {
      let logEntry = apiLogger._buildRequestEntry(requestData)
      expect(logEntry.message).not.to.contain('Query')
    })

    it('should include both request body and query string if provided', () => {
      requestData.requestBody = { formField: 'formValue' }
      requestData.query = { key: 'value' }
      let logEntry = apiLogger._buildRequestEntry(requestData)
      expect(logEntry.message)
        .to.contain('{"formField":"formValue"}')
        .and.to.contain('{"key":"value"}')
    })

    it('should include request ids if they are available', () => {
      requestData.headers = headers

      const logEntry = apiLogger._buildRequestEntry(requestData)

      expect(logEntry.requestId).to.equal('test-request-id')
      expect(logEntry.rootRequestId).to.equal('test-root-request-id')
      expect(logEntry.originRequestId).to.equal('test-origin-request-id')
    })
  })

  describe('_stringifyObject', () => {
    it('should hide pdf output', () => {
      const stringifiedObject = apiLogger._stringifyObject('%PDFasdsdasdas@1312aSDAAS')
      expect(stringifiedObject).to.equal('**** PDF Content not shown****')
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
      expect(logEntry.message).to.contain('http://localhost/resource')
    })

    it('should set the responseCode', () => {
      let logEntry = apiLogger._buildResponseEntry(responseData)
      expect(logEntry.responseCode).to.equal(200)
    })

    it('should include response body if provided', () => {
      responseData.responseBody = { field: 'value' }
      let logEntry = apiLogger._buildResponseEntry(responseData)
      expect(logEntry.message).to.contain('{"field":"value"}')
    })

    it('should not include response body if not provided', () => {
      let logEntry = apiLogger._buildResponseEntry(responseData)
      expect(logEntry.message).not.to.contain('Body')
    })

    it('should include error if provided', () => {
      responseData.error = { message: 'Something bad happened' }
      let logEntry = apiLogger._buildResponseEntry(responseData)
      expect(logEntry.message).to.contain('{"message":"Something bad happened"}')
    })

    it('should not include error if not provided', () => {
      let logEntry = apiLogger._buildResponseEntry(responseData)
      expect(logEntry.message).not.to.contain('Error')
    })

    it('should include both response body and error if provided', () => {
      responseData.responseBody = { field: 'value' }
      responseData.error = { message: 'Something bad happened' }
      let logEntry = apiLogger._buildResponseEntry(responseData)
      expect(logEntry.message)
        .to.contain('{"field":"value"}')
        .and.to.contain('{"message":"Something bad happened"}')
    })

    it('should include request ids if they are available', () => {
      responseData.requestHeaders = headers

      const logEntry = apiLogger._buildResponseEntry(responseData)

      expect(logEntry.requestId).to.equal('test-request-id')
      expect(logEntry.rootRequestId).to.equal('test-root-request-id')
      expect(logEntry.originRequestId).to.equal('test-origin-request-id')
    })
  })
})
