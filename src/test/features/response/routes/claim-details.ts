import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { EvidenceType } from 'forms/models/evidenceType'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = ResponsePaths.claimDetailsPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Defendant response: claim details page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.resolveFind('mediation')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Claim details'))
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('internal service error when retrieving response')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should include evidence section when evidence was provided', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId({
          claim: {
            ...claimStoreServiceMock.sampleClaimObj.claim,
            evidence: { rows: [{ type: EvidenceType.PHOTO.value, description: 'my photo evidence' }] }
          }
        })
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.resolveFind('mediation')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Evidence'))
      })

      it('should not include evidence section when evidence was not provided', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(
          { claim: { ...claimStoreServiceMock.sampleClaimObj.claim, evidence: null } })
        draftStoreServiceMock.resolveFindNoDraftFound()
        draftStoreServiceMock.resolveFind('mediation')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withoutText('Evidence'))
      })
    })
  })
})
