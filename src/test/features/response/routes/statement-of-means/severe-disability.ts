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
import { SevereDisabilityOption, ValidationErrors } from 'response/form/models/statement-of-means/severeDisability'

const cookieName: string = config.get<string>('session.cookieName')

const severeDisabilityPage = Paths.severeDisabilityPage.evaluateUri({
  externalId: claimStoreServiceMock.sampleClaimObj.externalId
})

describe('Statement of means', () => {
  describe('Severe Disability page', () => {
    attachDefaultHooks(app)

    describe('on GET', () => {
      checkAuthorizationGuards(app, 'get', severeDisabilityPage)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
        })

        it('should return error page when unable to retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('Error')

          await request(app)
            .get(severeDisabilityPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return error page when unable to retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind()

          await request(app)
            .get(severeDisabilityPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return successful response when claim is retrieved', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')

          await request(app)
            .get(severeDisabilityPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Are you severely disabled?'))
        })
      })
    })

    describe('on POST', () => {
      const validFormData = {
        option: SevereDisabilityOption.YES
      }

      checkAuthorizationGuards(app, 'get', severeDisabilityPage)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
        })

        it('should return error page when unable to retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('Error')

          await request(app)
            .post(severeDisabilityPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return error page when unable to retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind()

          await request(app)
            .post(severeDisabilityPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return error page when unable to save draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.rejectSave()

          await request(app)
            .post(severeDisabilityPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to dependants page when all is fine and form is valid', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .post(severeDisabilityPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.redirect
              .toLocation(Paths.residencePage
                .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should trigger validation when all is fine and form is invalid', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission')

          await request(app)
            .post(severeDisabilityPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({})
            .expect(res => expect(res).to.be.successful.withText(ValidationErrors.OPTION_REQUIRED))
        })
      })
    })
  })
})
