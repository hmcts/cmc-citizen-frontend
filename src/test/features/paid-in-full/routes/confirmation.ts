import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import { getSessionCookie } from 'test/auth-helper'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkNotClaimantInCaseGuard } from './checks/not-claimant-in-case-check'
import { Paths } from 'paid-in-full/paths'

let sessionCookie: string
  beforeEach(async () => {
    sessionCookie = await getSessionCookie(app)
  })


const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = Paths.datePaidPage.evaluateUri({ externalId: externalId })

describe('Paid In Full: confirmation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(Paths.confirmationPage.evaluateUri({ externalId: externalId }))
          .set('Cookie', sessionCookie)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()

        await request(app)
          .get(Paths.confirmationPage.evaluateUri({ externalId: externalId }))
          .set('Cookie', sessionCookie)
          .expect(res => expect(res).to.be.successful.withText('The claim is now settled'))
      })

    })
  })
})
