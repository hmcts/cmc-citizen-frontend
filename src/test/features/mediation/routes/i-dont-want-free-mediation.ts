import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as MediationPaths } from 'mediation/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { NoMediationReasonOptions } from 'features/mediation/form/models/NoMediationReasonOptions'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = MediationPaths.iDontWantFreeMediationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const pageHeading = 'I do not agree to free mediation'

describe('Free mediation: I dont want free mediation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      context('when response not submitted', () => {
        it('should return 500 and render error page when cannot retrieve draft', async () => {
          draftStoreServiceMock.rejectFind()
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(pageHeading))
        })
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

      context('when response not submitted', () => {
        context('when defendant skipped the reason', () => {
          it('should render error page when there is no option selected', async () => {
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('response')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ reject: 'reject' })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.taskListPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })

        context('when form is invalid', () => {
          it('should render error page when there is no option selected', async () => {
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('response')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ })
              .expect(res => expect(res).to.be.successful.withText('Please select one reason'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when cannot save draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.rejectUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ iDoNotWantMediationReason: NoMediationReasonOptions.ALREADY_TRIED,
                otherReasons: undefined })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to task lists page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ iDoNotWantMediationReason: NoMediationReasonOptions.ALREADY_TRIED,
                otherReasons: undefined })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.taskListPage
                  .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })
      })
    })

    context('when claimant authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      it('should redirect to claimant response task list', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleDefendantResponseObj)
        draftStoreServiceMock.resolveFind('mediation')
        draftStoreServiceMock.resolveFind('response')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ iDoNotWantMediationReason: NoMediationReasonOptions.ALREADY_TRIED,
            otherReasons: undefined })
          .expect(res => expect(res).to.be.redirect
            .toLocation(ClaimantResponsePaths.taskListPage
              .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
      })
    })
  })
})
