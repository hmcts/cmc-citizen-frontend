/* tslint:disable:no-unused-expression */

import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import { mockReq as req, mockRes as res } from 'sinon-express-mock'

import { IndividualDateOfBirthGuard } from 'ccj/guards/individualDateOfBirthGuard'
import { Paths } from 'dashboard/paths'

import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Defendant } from 'drafts/models/defendant'
import { PartyDetails } from 'forms/models/partyDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import { PartyType } from 'app/common/partyType'
import { PartyDetailsFactory } from 'forms/models/partyDetailsFactory'

chai.use(spies)

describe('IndividualDateOfBirthGuard', () => {
  const next = (e?: any): void => {
    return void 0
  }

  beforeEach(() => {
    res.locals = {
      user: {
        ccjDraft: new DraftCCJ(new Defendant(new PartyDetails()))
      }
    }
    res.redirect = sinon.spy((location: string): void => {
      return void 0
    })
  })

  it('should redirect to dashboard page when draft does not exist', () => {
    res.locals.user.ccjDraft.document = undefined

    IndividualDateOfBirthGuard.requestHandler(req, res, next)
    chai.expect(res.redirect).to.have.been.calledWith(Paths.dashboardPage.uri)
  })

  it('should redirect to dashboard page when defendant is not defined', () => {
    res.locals.user.ccjDraft.document.defendant = undefined

    IndividualDateOfBirthGuard.requestHandler(req, res, next)
    chai.expect(res.redirect).to.have.been.calledWith(Paths.dashboardPage.uri)
  })

  it('should redirect to dashboard page when defendant party details are not defined', () => {
    res.locals.user.ccjDraft.document.defendant.partyDetails = undefined

    IndividualDateOfBirthGuard.requestHandler(req, res, next)
    chai.expect(res.redirect).to.have.been.calledWith(Paths.dashboardPage.uri)
  })

  it('should redirect to dashboard page when defendant is not an individual', () => {
    PartyType.except(PartyType.INDIVIDUAL).forEach(partyType => {
      res.locals.user.ccjDraft.document.defendant.partyDetails = PartyDetailsFactory.createInstance(partyType.value)

      IndividualDateOfBirthGuard.requestHandler(req, res, next)
      chai.expect(res.redirect).to.have.been.calledWith(Paths.dashboardPage.uri)
    })
  })

  it('should pass when defendant is an individual', () => {
    const spy = sinon.spy(next)

    res.locals.user.ccjDraft.document = new DraftCCJ()
    res.locals.user.ccjDraft.document.defendant = new Defendant()
    res.locals.user.ccjDraft.document.defendant.partyDetails = new IndividualDetails()
    IndividualDateOfBirthGuard.requestHandler(req, res, spy)

    chai.expect(spy).to.have.been.called
  })
})
