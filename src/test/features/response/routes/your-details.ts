import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'
import { checkAlreadySubmittedGuard } from 'test/common/checks/already-submitted-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = ResponsePaths.defendantYourDetailsPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Defendant user details: your name page', () => {
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

      context('when response not submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveFind('mediation')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Confirm your details'))
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

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        })

        context('when form is invalid', () => {
          it('should render details page when form has error for address', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveFind('mediation')

            await request(app)
              .post(pagePath)
              .send({ type: 'individual' })
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Confirm your details', 'div class="error-summary"'))
          })

          it('should render details page when form has error for phone', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveFind('mediation')

            await request(app)
              .post(pagePath)
              .send({ type: 'individual', name: 'John Smith', address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'E10AA' }, phone: '' })
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Confirm your details', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when cannot save draft', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.rejectUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ type: 'individual', name: 'John Smith', address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'E10AA' } })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to date of birth page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ type: 'individual', name: 'John Smith', address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'E10AA' } })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.defendantDateOfBirthPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })
      })
    })

    context('When it is company v company', () => {
      it('should redirect to defendants phone number page when everything is fine', async () => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj.defendantId, 'citizen')
        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj)
        draftStoreServiceMock.resolveFind('response:company')
        draftStoreServiceMock.resolveFind('mediation')
        draftStoreServiceMock.resolveUpdate()
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({
            type: 'company',
            name: 'John Smith',
            address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'E10AA' },
            contactPerson: 'Joe Blogs'
          })
          .expect(res => expect(res).to.be.redirect
            .toLocation(ResponsePaths.defendantPhonePage
              .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
      })
    })
    context('When it is company v company', () => {
      it('should redirect to task list when defendant phone number is provided by claimant', async () => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj.defendantId, 'citizen')
        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgPhone)
        draftStoreServiceMock.resolveFind('response:company')
        draftStoreServiceMock.resolveFind('mediation')
        draftStoreServiceMock.resolveUpdate()
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({
            type: 'company',
            name: 'John Smith',
            address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'E10AA' },
            contactPerson: 'Joe Blogs'
          })
          .expect(res => expect(res).to.be.redirect
            .toLocation(ResponsePaths.taskListPage
              .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
      })
    })
  })
})
