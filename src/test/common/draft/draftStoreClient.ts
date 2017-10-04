/* tslint:disable:no-unused-expression */
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import * as asPromised from 'chai-as-promised'
import * as HttpStatus from 'http-status-codes'

import { attachDefaultHooks } from '../../routes/hooks'
import * as draftStoreServiceMock from '../../http-mocks/draft-store'

import DraftStoreClient from 'common/draft/draftStoreClient'
import { DraftStoreClientFactory } from 'common/draft/draftStoreClientFactory'
import { Draft } from 'models/draft'

chai.use(spies)
chai.use(asPromised)
const expect = chai.expect

describe('DraftStoreClient', () => {
  attachDefaultHooks()

  describe('find', () => {
    const deserializationFn = (value => value)

    describe('when handling error responses', () => {
      it('should reject promise with HTTP error', async () => {
        draftStoreServiceMock.rejectFind()

        const client: DraftStoreClient<any> = await DraftStoreClientFactory.create()
        try {
          await client.find({}, 'jwt-token', deserializationFn)
        } catch (err) {
          expect(err.name).to.equal('StatusCodeError')
          expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
        }
      })
    })

    describe('when handling successful responses', () => {
      it('should filter drafts by type if such is provided in query object', async () => {
        draftStoreServiceMock.resolveFind('sample').persist()

        const client: DraftStoreClient<any> = await DraftStoreClientFactory.create()
        expect(await client.find({ type: 'sample' }, 'jwt-token', deserializationFn)).to.be.lengthOf(1)
        expect(await client.find({ type: 'something-else' }, 'jwt-token', deserializationFn)).to.be.empty
      })

      it('should deserialize draft document using provided deserialization function', async () => {
        draftStoreServiceMock.resolveFind('sample')

        const spy = sinon.spy(deserializationFn)
        const client: DraftStoreClient<any> = await DraftStoreClientFactory.create()
        await client.find({}, 'jwt-token', spy)
        expect(spy).to.have.been.called
      })
    })
  })

  describe('save', () => {
    describe('when handling error responses', () => {
      it('should reject promise with HTTP error', async () => {
        draftStoreServiceMock.rejectSave()

        const client: DraftStoreClient<any> = await DraftStoreClientFactory.create()
        try {
          await client.save(new Draft(100, 'sample', undefined), 'jwt-token')
        } catch (err) {
          expect(err.name).to.equal('StatusCodeError')
          expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
        }
      })
    })

    describe('when handling successful responses', () => {
      it('should resolve promise', async () => {
        draftStoreServiceMock.resolveSave()

        const client: DraftStoreClient<any> = await DraftStoreClientFactory.create()
        await client.save(new Draft(100, 'sample', undefined), 'jwt-token')
      })
    })
  })

  describe('delete', () => {
    describe('when handling error responses', () => {
      it('should reject promise with HTTP error', async () => {
        draftStoreServiceMock.rejectDelete()

        const client: DraftStoreClient<any> = await DraftStoreClientFactory.create()
        try {
          await client.delete(new Draft(100, 'sample', undefined), 'jwt-token')
        } catch (err) {
          expect(err.name).to.equal('StatusCodeError')
          expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
        }
      })
    })

    describe('when handling successful responses', () => {
      it('should resolve promise', async () => {
        draftStoreServiceMock.resolveDelete()

        const client: DraftStoreClient<any> = await DraftStoreClientFactory.create()
        await client.delete(new Draft(100, 'sample', undefined), 'jwt-token')
      })
    })
  })
})
