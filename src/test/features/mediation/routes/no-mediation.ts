import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as MediationPaths } from 'mediation/paths'
import { Paths as responsePaths } from 'response/paths'
import { Paths as claimantResponsePaths } from 'claimant-response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { FeatureToggles } from 'utils/featureToggles'
import { FreeMediation } from 'forms/models/freeMediation'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = MediationPaths.noMediationPage.evaluateUri({ externalId })

const mediationPilotOverride = {
  totalAmountTillToday: 200,
  features: [...claimStoreServiceMock.sampleClaimObj.features, 'mediationPilot']
}

if (FeatureToggles.isEnabled('mediation')) {

  describe('Mediation: You chose not to try free mediation', () => {
    attachDefaultHooks(app)

    describe('on GET for defendant', () => {
      const method = 'get'
      checkAuthorizationGuards(app, method, pagePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
        })

        checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

        context('when response not submitted', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
          context('when mediation pilot is not enabled', () => {
            it('should return 404 and render error page', async () => {
              draftStoreServiceMock.resolveFind('mediation')
              draftStoreServiceMock.resolveFind('response')
              claimStoreServiceMock.resolveRetrieveClaimByExternalId()

              await request(app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.notFound)
            })
          })
          context('when mediation pilot enabled', () => {
            it('should render page when everything is fine', async () => {
              draftStoreServiceMock.resolveFind('mediation')
              draftStoreServiceMock.resolveFind('response')
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride)

              await request(app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('You chose not to try free mediation'))
            })
          })
        })
      })
    })

    describe('on GET for claimant', () => {
      const method = 'get'
      checkAuthorizationGuards(app, method, pagePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
        })

        checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

        context('when response not submitted', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
          context('when mediation pilot is not enabled', () => {
            it('should return 404 and render error page', async () => {
              draftStoreServiceMock.resolveFind('mediation')
              draftStoreServiceMock.resolveFind('response')
              claimStoreServiceMock.resolveRetrieveClaimByExternalId()

              await request(app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.notFound)
            })
          })
          context('when mediation pilot enabled', () => {
            it('should render page when everything is fine', async () => {
              draftStoreServiceMock.resolveFind('mediation')
              draftStoreServiceMock.resolveFind('response')
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride)

              await request(app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('You chose not to try free mediation'))
            })
          })
        })
      })
    })
    describe('on POST', () => {
      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)

      context('when user authorised', () => {
        context('when form is valid', () => {
          context('when mediation pilot is not enabled', () => {
            it('should return 404 and render error page for the defendant', async () => {
              idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
              checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
              claimStoreServiceMock.resolveRetrieveClaimByExternalId()
              draftStoreServiceMock.resolveFind('mediation')
              draftStoreServiceMock.resolveFind('response')

              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.notFound)
            })

            it('should return 404 and render error page for the claimant', async () => {
              idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
              checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
              claimStoreServiceMock.resolveRetrieveClaimByExternalId()
              draftStoreServiceMock.resolveFind('mediation')
              draftStoreServiceMock.resolveFind('claimantResponse')

              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.notFound)
            })
          })

          context('when mediation pilot is enabled', () => {
            it('should redirect to the mediation agreement page when defendant agreed to mediation', async () => {
              idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
              checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride)
              draftStoreServiceMock.resolveFind('mediation')
              draftStoreServiceMock.resolveFind('response')
              draftStoreServiceMock.resolveSave()

              await request(app)
                .post(pagePath)
                .send(new FreeMediation('yes'))
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.redirect
                  .toLocation(MediationPaths.mediationAgreementPage.evaluateUri({ externalId })))
            })

            it('should redirect to task list page when defendant said no to mediation', async () => {
              idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
              checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride)
              draftStoreServiceMock.resolveFind('mediation')
              draftStoreServiceMock.resolveFind('response')
              draftStoreServiceMock.resolveSave()

              await request(app)
                .post(pagePath)
                .send(new FreeMediation('no'))
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.redirect
                  .toLocation(responsePaths.taskListPage.evaluateUri({ externalId })))
            })

            it('should redirect to the mediation agreement page when claimant agreed to mediation', async () => {
              idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
              checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride)
              draftStoreServiceMock.resolveFind('mediation')
              draftStoreServiceMock.resolveFind('response')
              draftStoreServiceMock.resolveSave()

              await request(app)
                .post(pagePath)
                .send(new FreeMediation('yes'))
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.redirect
                  .toLocation(MediationPaths.mediationAgreementPage.evaluateUri({ externalId })))
            })

            it('should redirect to claimant task list page when claimant said no to mediation', async () => {
              idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
              checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride)
              draftStoreServiceMock.resolveFind('mediation')
              draftStoreServiceMock.resolveFind('response')
              draftStoreServiceMock.resolveSave()

              await request(app)
                .post(pagePath)
                .send(new FreeMediation('no'))
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.redirect
                  .toLocation(claimantResponsePaths.taskListPage.evaluateUri({ externalId })))
            })
          })
        })
      })
    })
  })
}
