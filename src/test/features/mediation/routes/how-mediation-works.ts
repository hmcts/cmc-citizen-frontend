import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as MediationPaths } from 'mediation/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { FreeMediationOption } from 'forms/models/freeMediation'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = MediationPaths.howMediationWorksPage.evaluateUri({ externalId })

describe('Mediation: how mediation works page', () => {
  attachDefaultHooks(app)

  describe('on GET for defendant', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
      verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)

      context('when response not submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

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
            .expect(res => expect(res).to.be.successful.withText('How free mediation works'))
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

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('How free mediation works'))
        })
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)

    context('when user authorised as defendant', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      verifyRedirectForPostWhenAlreadyPaidInFull(pagePath)

      it('should redirect to will you try mediation page when everything is fine for the defendant', async () => {
        checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveFind('mediation')
        draftStoreServiceMock.resolveFind('response')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ mediationYes: 'yes' })
          .expect(res => expect(res).to.be.redirect
            .toLocation(MediationPaths.willYouTryMediation.evaluateUri({ externalId })))
      })

      context('when mediation pilot is enabled', () => {
        const mediationPilotOverride = {
          totalAmountTillToday: 200,
          features: [...claimStoreServiceMock.sampleClaimObj.features, 'mediationPilot']
        }

        it('should redirect to the mediation agreement page when everything is fine for the defendant', async () => {
          checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ mediationYes: FreeMediationOption.YES })
            .expect(res => expect(res).to.be.redirect
              .toLocation(MediationPaths.mediationAgreementPage.evaluateUri({ externalId })))
        })

        it('should redirect to mediation disagreement when defendant says no to mediation', async () => {
          checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ mediationNo: FreeMediationOption.NO })
            .expect(res => expect(res).to.be.redirect
              .toLocation(MediationPaths.mediationDisagreementPage.evaluateUri({ externalId })))
        })
      })
    })

    context('when user authorised as claimant', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      it('should redirect to the will you try mediation page when everything is fine for the claimant', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveFind('mediation')
        draftStoreServiceMock.resolveFind('response')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ mediationYes: FreeMediationOption.YES })
          .expect(res => expect(res).to.be.redirect
            .toLocation(MediationPaths.willYouTryMediation.evaluateUri({ externalId })))
      })

      context('when mediation pilot is enabled', () => {
        const mediationPilotOverride = {
          totalAmountTillToday: 200,
          features: [...claimStoreServiceMock.sampleClaimObj.features, 'mediationPilot']
        }

        it('should redirect to the mediation agreement page when everything is fine for the claimant', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ mediationYes: FreeMediationOption.YES })
            .expect(res => expect(res).to.be.redirect
              .toLocation(MediationPaths.mediationAgreementPage.evaluateUri({ externalId })))
        })

        it('should redirect to the task list when claimant says no to mediation', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ mediationNo: FreeMediationOption.NO })
            .expect(res => expect(res).to.be.redirect
              .toLocation(MediationPaths.mediationDisagreementPage.evaluateUri({ externalId })))
        })
      })
    })
  })
})
