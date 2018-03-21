/* tslint:disable:no-unused-expression */

import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import { mockReq as req, mockRes as res } from 'sinon-express-mock'
import moment = require('moment')

import { Paths } from 'eligibility/paths'

import { ClaimEligibilityGuard } from 'claim/guards/claimEligibilityGuard'
import { cookieName as eligibilityCookieName } from 'eligibility/store'
import { eligibleCookie } from '../../../data/cookie/eligibility'

import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

chai.use(spies)

describe('Claim eligibility guard', () => {
  let claimDraft: Draft<DraftClaim>

  const next = (e?: any): void => {
    return void 0
  }

  beforeEach(() => {
    claimDraft = new Draft(1, 'claim', new DraftClaim(), moment(), moment())

    res.locals = {
      claimDraft: claimDraft
    }
    res.redirect = sinon.spy((location: string): void => {
      return void 0
    })
  })

  context('when draft is marked as eligible', () => {
    beforeEach(() => {
      claimDraft.document.eligibility = true
      req.headers = {}
    })

    it('should pass request through', () => {
      const spy = sinon.spy(next)
      ClaimEligibilityGuard.check()(req, res, spy)

      chai.expect(spy).to.have.been.called
    })
  })

  context('when draft is not marked as eligible but eligibility cookie exists', () => {
    beforeEach(() => {
      claimDraft.document.eligibility = false
      req.headers = {
        cookie: `${eligibilityCookieName}=${JSON.stringify(eligibleCookie)}`
      }
    })

    it('should mark draft as eligible', () => {
      ClaimEligibilityGuard.check()(req, res, next)

      chai.expect(claimDraft.document.eligibility).to.be.equal(true)
    })

    it('should pass request through', () => {
      const spy = sinon.spy(next)
      ClaimEligibilityGuard.check()(req, res, spy)

      chai.expect(spy).to.have.been.called
    })
  })

  context('when draft is not marked as eligible and eligibility cookie does not exist', () => {
    beforeEach(() => {
      claimDraft.document.eligibility = false
      req.headers = {}
    })

    it('should redirect to eligibility page', () => {
      ClaimEligibilityGuard.check()(req, res, next)

      chai.expect(res.redirect).to.have.been.calledWith(Paths.startPage.uri)
    })
  })
})
