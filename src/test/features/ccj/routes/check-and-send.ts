import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/ccj/routes/checks/authorization-check'

import { Paths as CCJPaths } from 'ccj/paths'

import { app } from 'main/app'
import { Paths } from 'dashboard/paths'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { SignatureType } from 'common/signatureType'
import { ValidationErrors as BasicValidationErrors } from 'ccj/form/models/declaration'
import { ValidationErrors as QualifiedValidationErrors } from 'ccj/form/models/qualifiedDeclaration'
import { checkNotClaimantInCaseGuard } from 'test/features/ccj/routes/checks/not-claimant-in-case-check'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'

const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const cookieName: string = config.get<string>('session.cookieName')
const pagePath = CCJPaths.checkAndSendPage.evaluateUri({ externalId: externalId })
const dashboardUri = Paths.dashboardPage.uri
const confirmationPage = CCJPaths.ccjConfirmationPage.evaluateUri({ externalId: externalId })

describe('CCJ: check and send page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      context('when user authorised', () => {
        it('should return 500 and render error page when cannot retrieve claims', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
        })

        it('should render page when everything is fine when settlement is broken with instalments - cannot change DOB and Payment options', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithFullAdmissionAndSettlement(claimStoreServiceMock.settlementAndSettlementReachedAt)
          draftStoreServiceMock.resolveFind('ccj')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers', 'Date of birth', 'By instalments'))
            .expect(res => expect(res).to.be.successful.withoutText('/ccj/payment-options', '/ccj/date-of-birth'))

        })

        it('should render page when everything is fine when settlement is broken with by set date - cannot change DOB but can change Payment options', async () => {
          const responseAndSettlementOverride: object = {
            ...claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj,
            ...claimStoreServiceMock.settlementWithSetDateAndAcceptation,
            settlementReachedAt: '2017-07-25T22:45:51.785'
          }
          const draftOverride: object = {
            paymentOption: {
              option: PaymentType.BY_SET_DATE
            }
          }
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(responseAndSettlementOverride)
          draftStoreServiceMock.resolveFind('ccj', draftOverride)

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers', 'Date of birth', 'By a set date', '/ccj/payment-options'))
            .expect(res => expect(res).to.be.successful.withoutText('/ccj/date-of-birth'))

        })

        it('should redirect to dashboard when claim is not eligible for CCJ', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithFullAdmissionAndSettlement()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect.toLocation(dashboardUri))

        })
      })
    })
  })

  describe('on POST', () => {
    const validBasicFormData = { signed: 'true', type: SignatureType.BASIC }
    const validQualifiedFormData = {
      signed: 'true',
      type: SignatureType.QUALIFIED,
      signerName: 'Jonny',
      signerRole: 'Director'
    }

    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validBasicFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 when cannot retrieve CCJ draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectFind('Error')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validBasicFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when form is valid', async () => {
        it('should redirect to confirmation page when signature is basic', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')
          claimStoreServiceMock.resolveSaveCcjForExternalId()
          draftStoreServiceMock.resolveDelete()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validBasicFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(confirmationPage))
        })
        it('should redirect to confirmation page when signature is qualified', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')
          draftStoreServiceMock.resolveSave()
          claimStoreServiceMock.resolveSaveCcjForExternalId()
          draftStoreServiceMock.resolveDelete()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validQualifiedFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(confirmationPage))
        })

        it('should return 500 when cannot save CCJ', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')
          claimStoreServiceMock.rejectSaveCcjForExternalId()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validBasicFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when form is invalid', async () => {
        it('should render page with error messages when signature is basic', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ signed: undefined, type: SignatureType.BASIC })
            .expect(res => expect(res).to.be.successful.withText(BasicValidationErrors.DECLARATION_REQUIRED,
              'div class="error-summary"'))
        })
        it('should render page with error messages when signature is qualified', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ signed: 'true', type: SignatureType.QUALIFIED, signerName: '', signerRole: '' })
            .expect(res => expect(res).to.be.successful.withText(QualifiedValidationErrors.SIGNER_NAME_REQUIRED,
              'div class="error-summary"'))
        })

      })
    })
  })
})
