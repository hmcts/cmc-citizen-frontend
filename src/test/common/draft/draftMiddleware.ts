/* tslint:disable:no-unused-expression */
import * as express from 'express'
import * as chai from 'chai'
import * as spies from 'sinon-chai'
import * as sinon from 'sinon'
import { mockReq as req, mockRes } from 'sinon-express-mock'

import { DraftMiddleware } from 'common/draft/draftMiddleware'

import DraftStoreClient from 'common/draft/draftStoreClient'

chai.use(spies)

describe('Draft middleware', () => {
  describe('request handler', () => {
    let spy

    beforeEach(() => {
      spy = sinon.stub(DraftStoreClient.prototype, 'find').callsFake(() => {
        return Promise.resolve({})
      })
    })

    afterEach(() => {
      spy.restore()
    })

    it('should retrieve draft if the user is logged in', () => {
      const res: express.Response = mockRes()
      res.locals.isLoggedIn = true
      res.locals.user = {
        id: 123
      }

      DraftMiddleware.requestHandler('default')(req, res, sinon.spy())
      chai.expect(spy).to.have.been.called
    })

    it('should not retrieve draft if the user is not logged in', () => {
      const res: express.Response = mockRes()
      res.locals.isLoggedIn = false

      DraftMiddleware.requestHandler('default')(req, res, sinon.spy())
      chai.expect(spy).to.not.have.been.called
    })

    it('should not retrieve draft if the isLoggedIn flag is not defined', () => {
      const res: express.Response = mockRes()
      res.locals.isLoggedIn = undefined

      DraftMiddleware.requestHandler('default')(req, res, sinon.spy())
      chai.expect(spy).to.not.have.been.called
    })
  })
})
