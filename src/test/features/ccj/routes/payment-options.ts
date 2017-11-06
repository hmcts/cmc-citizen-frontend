import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths } from 'ccj/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'

const cookieName: string = config.get<string>('session.cookieName')

const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const paymentOptionsPage = Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })

const validFormData: object = {
  option: PaymentType.IMMEDIATELY.value
}

describe('CCJ - payment options', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', paymentOptionsPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      context('when service is unhealthy', () => {
        it('should return 500 and render error page when cannot retrieve claims', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(paymentOptionsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(paymentOptionsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when service is healthy', () => {
        it('should render page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')

          await request(app)
            .get(paymentOptionsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Payment options'))
        })
      })
    })

    describe('on POST', () => {
      checkAuthorizationGuards(app, 'post', paymentOptionsPage)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
        })

        context('when service is unhealthy', () => {
          it('should return 500 when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(paymentOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 when cannot retrieve CCJ draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.rejectFind('Error')

            await request(app)
              .post(paymentOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 when cannot save CCJ draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('ccj')
            draftStoreServiceMock.rejectSave()

            await request(app)
              .post(paymentOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when service is healthy', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('ccj')
          })

          context('when form is valid', async () => {
            beforeEach(() => {
              draftStoreServiceMock.resolveSave()
            })

            async function checkThatSelectedPaymentOptionRedirectsToPage (data: object, expectedToRedirect: string) {
              await request(app)
                .post(paymentOptionsPage)
                .set('Cookie', `${cookieName}=ABC`)
                .send(data)
                .expect(res => expect(res).to.be.redirect.toLocation(expectedToRedirect))
            }

            it('should redirect to check and send page for "IMMEDIATELY" option selected', async () => {
              await checkThatSelectedPaymentOptionRedirectsToPage({ option: PaymentType.IMMEDIATELY.value }, Paths.checkAndSendPage.evaluateUri({ externalId: externalId }))
            })

            it('should redirect to repayment plan page for "INSTALMENTS" option selected', async () => {
              await checkThatSelectedPaymentOptionRedirectsToPage({ option: PaymentType.INSTALMENTS.value }, Paths.repaymentPlanPage.evaluateUri({ externalId: externalId }))
            })

            it('should redirect to pay by set date page for "FULL_BY_SPECIFIED_DATE" option selected', async () => {
              await checkThatSelectedPaymentOptionRedirectsToPage({ option: PaymentType.FULL_BY_SPECIFIED_DATE.value }, Paths.payBySetDatePage.evaluateUri({ externalId: externalId }))
            })
          })

          context('when form is invalid', async () => {
            it('should render page', async () => {
              await request(app)
                .post(paymentOptionsPage)
                .set('Cookie', `${cookieName}=ABC`)
                .send({ name: 'John Smith' })
                .expect(res => expect(res).to.be.successful.withText('Payment options', 'div class="error-summary"'))
            })
          })
        })
      })
    })
  })
})
