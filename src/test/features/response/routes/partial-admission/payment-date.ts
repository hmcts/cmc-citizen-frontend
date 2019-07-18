import { expect } from 'chai'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import * as request from 'supertest'
import * as config from 'config'
import * as _ from 'lodash'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'
import { checkAlreadySubmittedGuard } from 'test/common/checks/already-submitted-check'

import { Paths, PartAdmissionPaths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import * as moment from 'moment'
import { ValidationErrors } from 'shared/components/payment-intention/model/paymentDate'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = PartAdmissionPaths.paymentDatePage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

const draft = _.cloneDeep(draftStoreServiceMock.samplePartialAdmissionResponseDraftObj)
draft.partialAdmission.paymentIntention.paymentOption.option = PaymentType.BY_SET_DATE

function nextDay () {
  const nextDay: moment.Moment = moment().add(1, 'days')
  return {
    date: {
      year: nextDay.year().toString(),
      month: (nextDay.month() + 1).toString(),
      day: nextDay.date().toString()
    }
  }
}

describe('Pay by set date: payment date', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      context('when guards are satisfied', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        })

        it('should render error page when unable to retrieve draft', async () => {
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response:partial-admission', draft)
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('What date will you pay on?'))
            .expect(res => expect(res).to.be.successful.withoutText('<div class="panel">'))
        })
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      context('when guards are satisfied', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        })

        it('should render error page when unable to retrieve draft', async () => {
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render error page when unable to save draft', async () => {
          draftStoreServiceMock.resolveFind('response:partial-admission', draft)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.rejectSave()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(nextDay())
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should trigger validation when invalid data is given', async () => {
          draftStoreServiceMock.resolveFind('response:partial-admission', draft)
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ })
            .expect(res => expect(res).to.be.successful.withText(ValidationErrors.DATE_REQUIRED))
        })

        it('should redirect to task list when data is valid and user provides a date within 28 days from today', async () => {
          draftStoreServiceMock.resolveFind('response:partial-admission', draft)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(nextDay())
            .expect(res => expect(res).to.be.redirect
              .toLocation(
                Paths.taskListPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
              )
            )
        })
      })
    })
  })
})
