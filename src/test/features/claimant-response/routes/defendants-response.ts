import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { checkAuthorizationGuards } from 'test/features/claimant-response/routes/checks/authorization-check'
import { checkNotClaimantInCaseGuard } from 'test/features/claimant-response/routes/checks/not-claimant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = ClaimantResponsePaths.defendantsResponsePage.evaluateUri({ externalId: externalId })
const taskListPagePath = ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: externalId })

const defendantFullAdmissionResponse = claimStoreServiceMock.sampleDefendantFullAdmissionResponseObj
const defendantFullAdmissionResponseInstalments = claimStoreServiceMock.sampleDefendantFullAdmissionByInstalmentsResponseWithSoM
const defendantFullAdmissionResponseBySetDate = claimStoreServiceMock.sampleDefendantFullAdmissionResponseBySetDateWithSoM
const defendantPartAdmissionResponseWithSoM = claimStoreServiceMock.sampleDefendantPartialAdmissionResponseWithSoM

describe('Claimant response: view defendant response page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve claimantResponse draft', async () => {
        draftStoreServiceMock.rejectFind('Error')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponse)

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render full admission with instalments page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponseInstalments)
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The defendant’s response'))
          .expect(res => expect(res).to.be.successful.withText('How they want to pay'))
      })

      it('should render full admission with set date page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponseBySetDate)
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The defendant’s response'))
          .expect(res => expect(res).to.be.successful.withText('Why they can’t pay the full amount now'))
      })

      it('should render part admission with SoM page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartAdmissionResponseWithSoM)
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The defendant’s response'))
          .expect(res => expect(res).to.be.successful.withText('Their defence'))
          .expect(res => expect(res).to.be.successful.withText('Their timeline of events'))
      })
    })

    describe('on POST', () => {
      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)
      checkNotClaimantInCaseGuard(app, method, pagePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        })

        context('when middleware failure', () => {
          it('should return 500 when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ viewedDefendantResponse: true })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 when cannot retrieve claimantResponse draft', async () => {
            draftStoreServiceMock.rejectFind('Error')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponse)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ viewedDefendantResponse: true })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when cannot save claimantResponse draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponse)
            draftStoreServiceMock.resolveFind('claimantResponse')
            draftStoreServiceMock.rejectSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ viewedDefendantResponse: true })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        it('should redirect to task list page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponse)
          draftStoreServiceMock.resolveFind('claimantResponse')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ viewedDefendantResponse: true })
            .expect(res => expect(res).to.be.redirect.toLocation(taskListPagePath))
        })

      })
    })
  })
})
