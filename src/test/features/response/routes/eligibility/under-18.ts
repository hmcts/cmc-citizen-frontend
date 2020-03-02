import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'
import { verifyRedirectForGetWhenAlreadyPaidInFull } from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = ResponsePaths.under18Page.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Defendant response: under 18', () => {
  attachDefaultHooks(app)

  checkAuthorizationGuards(app, 'get', pagePath)
  checkNotDefendantInCaseGuard(app, 'get', pagePath)

  context('for authorized user', () => {
    beforeEach(() => {
      idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
    })

    it('should render page when everything is fine', async () => {
      draftStoreServiceMock.resolveFind('response')
      draftStoreServiceMock.resolveFind('mediation')
      claimStoreServiceMock.resolveRetrieveClaimByExternalId()

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Contact the court'))
    })

    verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)
  })
})
