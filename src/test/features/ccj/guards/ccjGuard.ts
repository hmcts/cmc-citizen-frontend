/* tslint:disable:no-unused-expression */

import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import { mockReq as req, mockRes as res } from 'sinon-express-mock'

import { Paths } from 'dashboard/paths'

import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { CCJGuard } from 'ccj/guards/ccjGuard'
import { YesNoOption } from 'models/yesNoOption'

chai.use(spies)

describe('CCJ guard', () => {
  const next = (): void => void 0

  beforeEach(() => {
    res.locals = {
      user: {
        ccjDraft: new DraftCCJ()
      }
    }
    res.redirect = sinon.spy((): void => void 0)
  })

  it('should redirect to dashboard page when eligibleForCCJ is false', () => {
    res.locals.claim = { eligibleForCCJ: false }

    CCJGuard.requestHandler(req, res, next)
    chai.expect(res.redirect).to.have.been.calledWith(Paths.dashboardPage.uri)
  })

  it('should redirect to dashboard page when admissionPayImmediatelyPastPaymentDate is false', () => {
    res.locals.claim = { admissionPayImmediatelyPastPaymentDate: false }

    CCJGuard.requestHandler(req, res, next)
    chai.expect(res.redirect).to.have.been.calledWith(Paths.dashboardPage.uri)
  })

  it('should redirect to dashboard page when eligibleForCCJAfterBreachedSettlementTerms is false', () => {
    res.locals.claim = { eligibleForCCJAfterBreachedSettlementTerms: false }

    CCJGuard.requestHandler(req, res, next)
    chai.expect(res.redirect).to.have.been.calledWith(Paths.dashboardPage.uri)
  })

  it('should redirect to dashboard page when paper response received', () => {
    res.locals.claim = { paperResponse: YesNoOption.YES }

    CCJGuard.requestHandler(req, res, next)
    chai.expect(res.redirect).to.have.been.calledWith(Paths.dashboardPage.uri)
  })

  it('should pass when eligibleForCCJ, admissionPayImmediatelyPastPaymentDate, eligibleForCCJAfterBreachedSettlementTerms are true and no paper response received', () => {
    const spy = sinon.spy(next)

    res.locals.claim = {
      eligibleForCCJ: true,
      admissionPayImmediatelyPastPaymentDate: true,
      eligibleForCCJAfterBreachedSettlementTerms: true,
      paperResponse: YesNoOption.NO
    }

    CCJGuard.requestHandler(req, res, spy)

    chai.expect(spy).to.have.been.called
  })
})
