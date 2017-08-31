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
import { sampleClaimObj } from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

const externalId = sampleClaimObj.externalId
const paymentOptionsPage = Paths.paymentOptionsPage.uri.replace(':externalId', externalId)

const validFormData: object = {
  option: PaymentType.IMMEDIATELY
}

describe('CCJ - payment options', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', paymentOptionsPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(paymentOptionsPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
        draftStoreServiceMock.rejectRetrieve('ccj', 'Error')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()

        await request(app)
          .get(paymentOptionsPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveRetrieve('ccj')

        await request(app)
          .get(paymentOptionsPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Payment options'))
      })
    })

    describe('on POST', () => {
      checkAuthorizationGuards(app, 'post', paymentOptionsPage)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
        })

        context('when middleware failure', () => {
          it('should return 500 when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(paymentOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 when cannot retrieve CCJ draft', async () => {
            draftStoreServiceMock.rejectRetrieve('ccj', 'Error')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(paymentOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when form is valid should redirect to', async () => {

          async function submitFormWithValueShouldRedirectToPage (validForm: object, expectedToRedirect: string) {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveRetrieve('ccj')
            draftStoreServiceMock.resolveSave('ccj')

            await request(app)
              .post(paymentOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validForm)
              .expect(res => expect(res).to.be.redirect.toLocation(expectedToRedirect)
              )
          }

          it('check and send for "IMMEDIATELY" option selected', async () => {
            await submitFormWithValueShouldRedirectToPage({ option: PaymentType.IMMEDIATELY.value }, Paths.checkYourAnswerPage.uri.replace(':externalId', externalId))
          })

          it('repayment plan for "BY_INSTALMENTS" option selected', async () => {
            await submitFormWithValueShouldRedirectToPage({ option: PaymentType.BY_INSTALMENTS.value }, Paths.repaymentPlanPage.uri.replace(':externalId', externalId))
          })

          it('pay by set date for "FULL" option selected', async () => {
            await submitFormWithValueShouldRedirectToPage({ option: PaymentType.FULL.value }, Paths.payBySetDatePage.uri.replace(':externalId', externalId))
          })
        })

        context('when form is invalid', async () => {
          it('should render page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveRetrieve('ccj')

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
