/* tslint:disable:no-unused-expression */

import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import { mockReq as req, mockRes as res } from 'sinon-express-mock'

import { Paths } from 'dashboard/paths'

import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { CCJGuard } from 'ccj/guards/ccjGuard'

chai.use(spies)

describe('CCJ guard', () => {
  const next = (e?: any): void => {
    return void 0
  }

  beforeEach(() => {
    res.locals = {
      user: {
        ccjDraft: new DraftCCJ()
      }
    }
    res.redirect = sinon.spy((location: string): void => {
      return void 0
    })
  })

  it('should redirect to dashboard page when eligibleForCCJ, admissionPayImmediatelyPastPaymentDate, eligibleForCCJAfterBreachedSettlementTerms is false', () => {
    res.locals.claim = {
      eligibleForCCJ: false,
      admissionPayImmediatelyPastPaymentDate: false,
      eligibleForCCJAfterBreachedSettlementTerms: false
    }

    CCJGuard.requestHandler(req, res, next)
    chai.expect(res.redirect).to.have.been.calledWith(Paths.dashboardPage.uri)
  })

  it('should pass when eligibleForCCJ, admissionPayImmediatelyPastPaymentDate, eligibleForCCJAfterBreachedSettlementTerms  is true', () => {
    const spy = sinon.spy(next)

    res.locals.claim = {
      eligibleForCCJ: true,
      admissionPayImmediatelyPastPaymentDate: true,
      eligibleForCCJAfterBreachedSettlementTerms: true
    }

    CCJGuard.requestHandler(req, res, spy)

    chai.expect(spy).to.have.been.called
  })
})
