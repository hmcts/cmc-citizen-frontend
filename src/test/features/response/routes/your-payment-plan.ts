import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as Paths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const defenceFullPartialPaymentPlanPage = Paths.defenceFullPartialPaymentPlanPage.evaluateUri({ externalId: externalId })
const checkAndSendPage = Paths.checkAndSendPage.evaluateUri({ externalId: externalId })

describe('Defendant: payment page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', defenceFullPartialPaymentPlanPage)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta', 'claimant')
      })

      context('when user authorised', () => {
        it('should return 500 and render error page when cannot retrieve claims', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(defenceFullPartialPaymentPlanPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve response draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(defenceFullPartialPaymentPlanPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(defenceFullPartialPaymentPlanPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your payment plan'))
        })
      })
    })
  })

  describe('on POST', () => {
    const validFormData = {
      remainingAmount: 160,
      firstPayment: 77.32,
      installmentAmount: 30.00,
      firstPaymentDate: {
        day: 12,
        month: 3,
        year: 2050
      },
      paymentSchedule: 'EVERY_MONTH',
      text: 'I owe nothing'
    }

    checkAuthorizationGuards(app, 'post', defenceFullPartialPaymentPlanPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .post(defenceFullPartialPaymentPlanPage)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 when cannot retrieve response draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectFind('Error')

        await request(app)
          .post(defenceFullPartialPaymentPlanPage)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when form is valid', async () => {
        it('should redirect to confirmation page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .post(defenceFullPartialPaymentPlanPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(checkAndSendPage))
        })
      })

      context('when form is invalid', async () => {
        it('should render page with error messages', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .post(defenceFullPartialPaymentPlanPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ signed: undefined })
            .expect(res => expect(res).to.be.successful.withText('Your payment plan'))
        })
      })
    })
  })
})
