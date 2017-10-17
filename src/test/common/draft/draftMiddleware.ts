/* tslint:disable:no-unused-expression */
import * as express from 'express'
import * as chai from 'chai'
import * as spies from 'sinon-chai'
import * as sinon from 'sinon'
import { mockReq as req, mockRes } from 'sinon-express-mock'

import { DraftMiddleware } from 'common/draft/draftMiddleware'

import DraftStoreClient from 'common/draft/draftStoreClient'
import { DraftStoreClientFactory } from 'common/draft/draftStoreClientFactory'

chai.use(spies)

describe('Draft middleware', () => {
  describe('request handler', () => {
    let factoryFn
    let findFn

    beforeEach(() => {
      factoryFn = sinon.stub(DraftStoreClientFactory, 'create').callsFake(() => {
        return new DraftStoreClient('service-jwt-token')
      })
      findFn = sinon.stub(DraftStoreClient.prototype, 'find').callsFake((args, x, y) => {
        return Promise.resolve([])
      })
    })

    afterEach(() => {
      factoryFn.restore()
      findFn.restore()
    })

    it('should saerch for drafts if the user is logged in', async () => {
      const res: express.Response = mockRes()
      res.locals.isLoggedIn = true
      res.locals.user = {
        bearerToken: 'user-jwt-token'
      }

      await DraftMiddleware.requestHandler('default')(req(), res, sinon.spy())
      chai.expect(findFn).to.have.been.called
    })

    it('should not search for drafts if the user is not logged in', async () => {
      const res: express.Response = mockRes()
      res.locals.isLoggedIn = false

      await DraftMiddleware.requestHandler('default')(req(), res, sinon.spy())
      chai.expect(findFn).to.not.have.been.called
    })

    it('should not search for drafts if the isLoggedIn flag is not defined', async () => {
      const res: express.Response = mockRes()
      res.locals.isLoggedIn = undefined

      await DraftMiddleware.requestHandler('default')(req(), res, sinon.spy())
      chai.expect(findFn).to.not.have.been.called
    })
  })
})
