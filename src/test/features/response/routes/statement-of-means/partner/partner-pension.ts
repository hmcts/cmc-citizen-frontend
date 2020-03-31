import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { app } from 'main/app'
import { PartnerPensionOption, ValidationErrors } from 'response/form/models/statement-of-means/partnerPension'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')

const partnerPensionPage = Paths.partnerPensionPage.evaluateUri({
  externalId: claimStoreServiceMock.sampleClaimObj.externalId
})

describe('Statement of means', () => {
  describe('Partner Pension page', () => {
    attachDefaultHooks(app)

    describe('on GET', () => {
      checkAuthorizationGuards(app, 'get', partnerPensionPage)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
        })

        verifyRedirectForGetWhenAlreadyPaidInFull(partnerPensionPage)

        it('should return error page when unable to retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('Error')

          await request(app)
            .get(partnerPensionPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return error page when unable to retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind()

          await request(app)
            .get(partnerPensionPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return successful response when claim is retrieved', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(partnerPensionPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Does your partner receive a pension?'))
        })
      })
    })

    describe('on POST', () => {
      const validFormData = {
        option: PartnerPensionOption.YES
      }

      checkAuthorizationGuards(app, 'get', partnerPensionPage)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
        })

        verifyRedirectForPostWhenAlreadyPaidInFull(partnerPensionPage)

        it('should return error page when unable to retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('Error')

          await request(app)
            .post(partnerPensionPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return error page when unable to retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind()

          await request(app)
            .post(partnerPensionPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return error page when unable to save draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.rejectUpdate()

          await request(app)
            .post(partnerPensionPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to dependants page when all is fine and form is valid', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .post(partnerPensionPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.redirect
              .toLocation(Paths.dependantsPage
                .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should trigger validation when all is fine and form is invalid', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(partnerPensionPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({})
            .expect(res => expect(res).to.be.successful.withText(ValidationErrors.OPTION_REQUIRED))
        })
      })
    })
  })
})
