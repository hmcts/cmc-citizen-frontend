/* tslint:disable:no-unused-expression */

import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import { mockReq as req, mockRes as res } from 'sinon-express-mock'
import * as moment from 'moment'

import { Paths } from 'eligibility/paths'

import { ClaimEligibilityGuard } from 'claim/guards/claimEligibilityGuard'
import { cookieName as eligibilityCookieName } from 'eligibility/store'
import { eligibleCookie } from 'test/data/cookie/eligibility'

import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

import { attachDefaultHooks } from 'test/hooks'

chai.use(spies)

describe('Claim eligibility guard', () => {
  attachDefaultHooks()

  let claimDraft: Draft<DraftClaim>

  const next = (e?: any): void => {
    return void 0
  }

  beforeEach(() => {
    claimDraft = new Draft(100, 'claim', new DraftClaim(), moment(), moment())

    res.locals = {
      claimDraft: claimDraft,
      user: new User('1', 'user@example.com', 'John', 'Smith', [], 'citizen', '')
    }
    res.redirect = sinon.spy((location: string): void => {
      return void 0
    })
  })

  context('when draft is marked as eligible', () => {
    beforeEach(() => {
      claimDraft.document.eligibility = true
      req.cookies = {}
    })

    it('should pass request through', async () => {
      const spy = sinon.spy(next)
      await ClaimEligibilityGuard.requestHandler()(req, res, spy)

      chai.expect(spy).to.have.been.called
    })
  })

  context('when draft is not marked as eligible but eligibility cookie exists', () => {
    beforeEach(() => {
      claimDraft.document.eligibility = false
      req.cookies = {
        [eligibilityCookieName]: eligibleCookie
      }
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveUpdate()
    })

    it('should mark draft as eligible', async () => {
      await ClaimEligibilityGuard.requestHandler()(req, res, next)

      chai.expect(claimDraft.document.eligibility).to.be.equal(true)
    })

    it('should pass request through', async () => {
      const spy = sinon.spy(next)
      await ClaimEligibilityGuard.requestHandler()(req, res, spy)

      chai.expect(spy).to.have.been.called
    })
  })

  context('when draft is not marked as eligible and eligibility cookie does not exist', () => {
    beforeEach(() => {
      claimDraft.document.eligibility = false
      req.cookies = {}
    })

    it('should redirect to eligibility page', async () => {
      await ClaimEligibilityGuard.requestHandler()(req, res, next)

      chai.expect(res.redirect).to.have.been.calledWith(Paths.startPage.uri)
    })
  })
})
