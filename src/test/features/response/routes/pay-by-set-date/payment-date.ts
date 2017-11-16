import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../../routes/hooks'
import { checkAuthorizationGuards } from '../checks/authorization-check'
import { checkAlreadySubmittedGuard } from '../checks/already-submitted-check'

import { Paths, PayBySetDatePaths } from 'response/paths'

import { app } from '../../../../../main/app'

import * as idamServiceMock from '../../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../../http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from '../checks/ccj-requested-check'
import * as moment from 'moment'
import { ValidationErrors } from 'forms/models/payBySetDate'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = PayBySetDatePaths.paymentDatePage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

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

function date29DaysFromToday () {
  const dateLaterThan28DaysFromToday: moment.Moment = moment().add(29, 'days')
  return {
    date: {
      year: dateLaterThan28DaysFromToday.year().toString(),
      month: (dateLaterThan28DaysFromToday.month() + 1).toString(),
      day: dateLaterThan28DaysFromToday.date().toString()
    }
  }
}

describe('Pay by set date : payment date', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      checkAlreadySubmittedGuard(app, 'get', pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, 'get', pagePath)

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
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('What date will you pay on?'))
        })
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      checkAlreadySubmittedGuard(app, 'post', pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, 'post', pagePath)

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
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.rejectSave()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(nextDay())
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render trigger validation when invalid data is given', async () => {
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ })
            .expect(res => expect(res).to.be.successful.withText(ValidationErrors.DATE_REQUIRED))
        })

        it('should redirect to task list when data is valid and user provides a date within 28 days from today', async () => {
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(nextDay())
            .expect(res => expect(res).to.be.redirect
              .toLocation(
                Paths.checkAndSendPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
              )
            )
        })

        it('should redirect to explanation page when data is valid and user provides a date later than 28 days from today', async () => {
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(date29DaysFromToday())
            .expect(res => expect(res).to.be.redirect
              .toLocation(
                PayBySetDatePaths.explanationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
              )
            )
        })
      })
    })
  })
})
