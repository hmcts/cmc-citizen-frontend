/* tslint:disable:no-unused-expression */
import * as express from 'express'
import * as chai from 'chai'
import * as spies from 'sinon-chai'
import * as sinon from 'sinon'
import { mockRes } from 'sinon-express-mock'

import { DraftMiddleware } from 'common/draft/draftMiddleware'

import DraftStoreClient from 'common/draft/draftStoreClient'

chai.use(spies)

const email: string = 'unit-test@testing.com'
const forename: string = 'Dolph'
const surname: string = 'Lundgren'

describe('DraftMiddleware', () => {
  describe('retrieve', () => {
    let spy
    let user

    beforeEach(() => {
      spy = sinon.stub(DraftStoreClient.prototype, 'retrieve').callsFake(() => {
        return Promise.resolve({})
      })
      user = {
        id: 123,
        email: email,
        forename: forename,
        surname: surname
      }
    })

    afterEach(() => {
      spy.restore()
    })

    describe('when the user is logged in', () => {
      let res: express.Response

      beforeEach(() => {
        res = mockRes()
        res.locals.isLoggedIn = true
        res.locals.user = user
      })

      it('should retrieve draft', () => {
        const res: express.Response = mockRes()
        res.locals.isLoggedIn = true
        res.locals.user = user

        new DraftMiddleware('default').retrieve(res, sinon.spy())
        chai.expect(spy).to.have.been.called
      })

      it('should set the draft on the user', async () => {
        const res: express.Response = mockRes()
        res.locals.isLoggedIn = true
        res.locals.user = user

        await new DraftMiddleware('default').retrieve(res, sinon.spy())

        chai.expect(res.locals.user.defaultDraft).to.not.be.undefined
      })

      it('should set the user data on the draft', async () => {
        const res: express.Response = mockRes()
        res.locals.isLoggedIn = true
        res.locals.user = user

        await new DraftMiddleware('default').retrieve(res, sinon.spy())

        chai.expect(res.locals.user.defaultDraft.userEmail).to.equal(email)
        chai.expect(res.locals.user.defaultDraft.userName).to.equal(`${forename} ${surname}`)
      })
    })

    it('should not retrieve draft if the user is not logged in', () => {
      const res: express.Response = mockRes()
      res.locals.isLoggedIn = false

      new DraftMiddleware('default').retrieve(res, sinon.spy())
      chai.expect(spy).to.not.have.been.called
    })

    it('should not retrieve draft if the isLoggedIn flag is not defined', () => {
      const res: express.Response = mockRes()
      res.locals.isLoggedIn = undefined

      new DraftMiddleware('default').retrieve(res, sinon.spy())
      chai.expect(spy).to.not.have.been.called
    })
  })
})
