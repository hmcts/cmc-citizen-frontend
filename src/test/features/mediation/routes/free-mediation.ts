import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as MediationPaths } from 'mediation/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { Claim } from 'claims/models/claim'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = MediationPaths.freeMediationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Mediation: Free mediation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)

    context('when defendant is authorised', () => {
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

        it('should render page with the claimants name when everything is fine and not auto-registered', async () => {
          const claim: Claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimIssueObj, totalAmountTillDateOfIssue: 400 })
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .send({
              otherPartyName: claim.claimData.claimant.name
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Free telephone mediation', claim.claimData.claimant.name))
        })

        it('should render page with automatic registration details when everything is fine and auto-registered', async () => {
          const claim: Claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimIssueObj,
            features: ['admissions', 'mediationPilot']
          })
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .send({
              otherPartyName: claim.claimData.claimant.name
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => {
              expect(res).to.be.successful.withText('Free telephone mediation', 'automatically registering')
              expect(res).to.be.successful.withoutText(claim.claimData.claimant.name)
            })
        })
      })
    })

    context('when claimant is authorised', () => {
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

        it('should render page with the defendants name when everything is fine and not auto-registered', async () => {
          const claim: Claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimIssueObj, totalAmountTillDateOfIssue: 400 })
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .send({
              otherPartyName: claim.claimData.defendant.name
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Free telephone mediation', claim.claimData.defendant.name))
        })

        it('should render page with automatic registration details when everything is fine and auto-registered', async () => {
          const claim: Claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimIssueObj,
            features: ['admissions', 'mediationPilot']
          })
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .send({
              otherPartyName: claim.claimData.defendant.name
            })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => {
              expect(res).to.be.successful.withText('Free telephone mediation', 'automatically registering')
              expect(res).to.be.successful.withoutText(claim.claimData.defendant.name)
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
        it('should redirect to how mediation works page when everything is fine for defendant', async () => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
          checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(MediationPaths.howMediationWorksPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should redirect to how mediation works page when everything is fine for claimant', async () => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(MediationPaths.howMediationWorksPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })
      })
    })
  })
})
