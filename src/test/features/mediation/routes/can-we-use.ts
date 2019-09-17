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
const pagePath = MediationPaths.canWeUsePage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Free mediation: can we use phone number page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })
      it('should render page when everything is fine and no defendant phone number is provided', async () => {
        draftStoreServiceMock.resolveFind('mediation')
        draftStoreServiceMock.resolveFind('response')
        claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Can the mediation service use'))
      })
      it('should render page when everything is fine and defendant phone number is not provided', async () => {
        draftStoreServiceMock.resolveFind('mediation')
        draftStoreServiceMock.resolveFind('response', { defendantDetails: { mobilePhone: { number: undefined } } })
        claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Enter a phone number'))
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
        it('should return 500 and render error page when cannot save draft', async () => {
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.rejectUpdate()
          claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ option: FreeMediationOption.YES, mediationPhoneNumber: undefined })
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to defendant task list when defendant says yes', async () => {
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveUpdate()
          claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ option: FreeMediationOption.YES })
            .expect(res => expect(res).to.be.redirect
              .toLocation(ResponsePaths.taskListPage
                .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should redirect to response task list when No was chosen and a phone number is given', async () => {
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveUpdate()
          claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({
              option: FreeMediationOption.NO,
              mediationPhoneNumber: '07777777777'
            })
            .expect(res => expect(res).to.be.redirect
              .toLocation(ResponsePaths.taskListPage
                .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })
      })
    })
    // TODO implement claimant response tests when response saving is done
  })
})
