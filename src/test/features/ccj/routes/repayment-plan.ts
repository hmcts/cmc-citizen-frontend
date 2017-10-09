import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as CCJPaths } from 'ccj/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { sampleClaimObj } from '../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'

const externalId = sampleClaimObj.externalId
const cookieName: string = config.get<string>('session.cookieName')
const repaymentPlanPage = CCJPaths.repaymentPlanPage.evaluateUri({ externalId: externalId })
const checkAndSendPage = CCJPaths.checkAndSendPage.evaluateUri({ externalId: externalId })

describe('CCJ: repayment page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', repaymentPlanPage)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      })

      context('when user authorised', () => {
        it('should return 500 and render error page when cannot retrieve claims', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(repaymentPlanPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(repaymentPlanPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')

          await request(app)
            .get(repaymentPlanPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Order them to pay by instalments'))
        })
      })
    })
  })

  describe('on POST', () => {
    const validFormData = {
      remainingAmount: 160,
      firstPayment: 77.32,
      installmentAmount: 76,
      paymentSchedule: 'EVERY_MONTH',
      firstPaymentDate: {
        day: 12,
        month: 3,
        year: 2050
      }
    }

    checkAuthorizationGuards(app, 'post', repaymentPlanPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .post(repaymentPlanPage)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 when cannot retrieve CCJ draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectFind('Error')

        await request(app)
          .post(repaymentPlanPage)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when form is valid', async () => {
        it('should redirect to confirmation page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .post(repaymentPlanPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(checkAndSendPage))
        })
      })

      context('when form is invalid', async () => {
        it('should render page with error messages', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')

          await request(app)
            .post(repaymentPlanPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ signed: undefined })
            .expect(res => expect(res).to.be.successful.withText('Enter a valid amount of first payment', 'div class="error-summary"'))
        })
      })
    })
  })
})
