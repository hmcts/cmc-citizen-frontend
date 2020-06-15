import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = ClaimPaths.confirmHelpWithFeesPage.uri
const pageContent: string = 'Check your Help With Fees payment'

const helpWithFeesOverride = {
  paymentMethod: {
    helpWithFees: true,
    helpWithFeesNumber: 'HWF01234'
  }
}

describe('Claim issue: confirm help with fees page', () => {
  attachDefaultHooks(app)

  context('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim', helpWithFeesOverride)

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageContent, 'HWF01234'))
    })
  })

  context('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should redirect to confirmation page when form is valid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        claimStoreServiceMock.resolveRetrieveUserRoles()
        claimStoreServiceMock.resolveSaveHelpWithFeesClaimForUser()
        draftStoreServiceMock.resolveDelete()

        let nextPage: string = ClaimPaths.confirmationPage.evaluateUri({ externalId: draftStoreServiceMock.sampleClaimDraftObj.externalId })
        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(nextPage))
      })
    })
  })
})
