import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as MediationPaths } from 'mediation/paths'
import { Paths as ResponsePaths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { FreeMediationOption } from 'forms/models/freeMediation'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = MediationPaths.canWeUseCompanyPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Free mediation: can we use company page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)

    describe('as defendant', () => {

        context('when user authorised', () => {
          beforeEach(() => {
            idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
          })

          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('mediation', { canWeUseCompany: undefined })
            draftStoreServiceMock.resolveFind('response:full-rejection', { defendantDetails: { partyDetails: { ...draftStoreServiceMock.sampleOrganisationDetails } } })
            claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj)

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Mary Richards the right person for the mediation service to call'))
          })

        })
      })

      describe('as claimant', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('mediation', { canWeUseCompany: undefined })
          draftStoreServiceMock.resolveFind('claimantResponse')
          claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId({
            ...claimStoreServiceMock.sampleClaimIssueOrgVOrgObj,
            ...claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj
          })

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Enter this person’s phone number, including extension if required'))
        })
      })
    })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)

    context('when defendant authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      context('when response not submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

      })
      context('when form is valid', () => {
        it('should redirect to defendant task list when defendant says yes', async () => {
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response:full-rejection', { defendantDetails: { partyDetails: { ...draftStoreServiceMock.sampleOrganisationDetails } } })
          draftStoreServiceMock.resolveUpdate()
          claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj)

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ option: FreeMediationOption.YES, mediationPhoneNumberConfirmation: '07777777777' })
            .expect(res => expect(res).to.be.redirect
              .toLocation(ResponsePaths.taskListPage
                .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should show validation error when defendant says yes with no phone number', async () => {
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response:full-rejection', { defendantDetails: { partyDetails: { ...draftStoreServiceMock.sampleOrganisationDetails } } })
          claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj)

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ option: FreeMediationOption.YES, mediationPhoneNumberConfirmation: undefined })
            .expect(res => expect(res).to.be.successful.withText('div class="error-summary"'))
        })

        it('should redirect to response task list when no was chosen and a phone number and a contact is given', async () => {
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response:full-rejection', { defendantDetails: { partyDetails: { ...draftStoreServiceMock.sampleOrganisationDetails } } })
          draftStoreServiceMock.resolveUpdate()
          claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj)

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({
              option: FreeMediationOption.NO,
              mediationPhoneNumber: '07777777777',
              mediationContactPerson: 'Mary Richards'
            })
            .expect(res => expect(res).to.be.redirect
              .toLocation(ResponsePaths.taskListPage
                .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should show validation error when defendant says no with no phone number', async () => {
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response:full-rejection', { defendantDetails: { partyDetails: { ...draftStoreServiceMock.sampleOrganisationDetails } } })
          claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj)

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ option: FreeMediationOption.NO, mediationPhoneNumber: undefined })
            .expect(res => expect(res).to.be.successful.withText('div class="error-summary"'))
        })

        it('should show validation error when defendant says no with no contact name', async () => {
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response:full-rejection', { defendantDetails: { partyDetails: { ...draftStoreServiceMock.sampleOrganisationDetails } } })
          claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj)

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({
              option: FreeMediationOption.NO,
              mediationPhoneNumber: '07777777777',
              mediationContactPerson: undefined
            })
            .expect(res => expect(res).to.be.successful.withText('div class="error-summary"'))
        })
      })
    })
    // TODO implement claimant response tests when response saving is done
  })
})
