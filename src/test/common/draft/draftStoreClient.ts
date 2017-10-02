/* tslint:disable:no-unused-expression */

import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import * as asPromised from 'chai-as-promised'
import * as mock from 'mock-require'
import * as HttpStatus from 'http-status-codes'

import DraftStoreClient from 'common/draft/draftStoreClient'

chai.use(spies)
chai.use(asPromised)
const expect = chai.expect

function clientWithRequestMockedToThrow (statusCode: number): DraftStoreClient<any> {
  mock('client/request', {
    'default': {
      get: (url, options) => {
        return new Promise(() => {
          throw {
            statusCode: statusCode
          }
        })
      }
    }
  })
  mock.reRequire('../../../main/common/draft/draftStoreClient')
  const constructor = require('../../../main/common/draft/draftStoreClient').default
  return new constructor('default')
}

function clientWithRequestMockedToReturn (json: any): DraftStoreClient<any> {
  mock('client/request', {
    'default': {
      get: (url, options) => Promise.resolve(json)
    }
  })
  mock.reRequire('../../../main/common/draft/draftStoreClient')
  const constructor = require('../../../main/common/draft/draftStoreClient').default
  return new constructor('default')
}

describe('DraftStoreClient', () => {
  describe('constructor', () => {
    it('should fail when no draft type is provided', () => {
      expect(() => new DraftStoreClient(undefined)).to.throw(Error, 'Draft type is required by the client')
      expect(() => new DraftStoreClient(null)).to.be.throw(Error, 'Draft type is required by the client')
      expect(() => new DraftStoreClient('')).to.be.throw(Error, 'Draft type is required by the client')
    })
  })

  describe('retrieve', () => {
    const deserializationFn = (value => value)

    describe('when handling a request error', () => {
      it('should return undefined for 404', async () => {
        expect(await clientWithRequestMockedToThrow(HttpStatus.NOT_FOUND).find('123','default', deserializationFn)).to.be.undefined
      })

      it('should throw/reject promise for 400', () => {
        expect(clientWithRequestMockedToThrow(HttpStatus.BAD_REQUEST).find('123','default', deserializationFn)).to.be.rejected
      })

      it('should throw/reject promise for 500', () => {
        expect(clientWithRequestMockedToThrow(HttpStatus.INTERNAL_SERVER_ERROR).find('123','default', deserializationFn)).to.be.rejected
      })

      it('should throw/reject promise for undefined status', () => {
        expect(clientWithRequestMockedToThrow(undefined).find('123','default', deserializationFn)).to.be.rejected
      })
    })

    describe('when handling json returned from the backend', () => {
      it('should deserialize object using provided deserialization function', async () => {
        const spy = sinon.spy(deserializationFn)

        await clientWithRequestMockedToReturn({}).find('123','default', spy)
        chai.expect(spy).to.have.been.called
      })

      it('should reject upon receiving undefined', () => {
        expect(clientWithRequestMockedToReturn(undefined).find('123','default', deserializationFn)).to.be.rejected
      })

      it('should reject upon receiving null', () => {
        expect(clientWithRequestMockedToReturn(null).find('123','default', deserializationFn)).to.be.rejected
      })
    })
  })
})
