import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../../routes/hooks'
import '../../../../routes/expectations'
import { checkAuthorizationGuards } from '../checks/authorization-check'

import { app } from '../../../../../main/app'

import * as idamServiceMock from '../../../../http-mocks/idam'
import { Paths as ClaimPaths } from 'claim/paths'
import * as claimStoreServiceMock from '../../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../../http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = ClaimPaths.eligibilityNotEligiblePage.uri
const expectedTextOnPage: string = 'You can’t use this service'

describe('Claim eligibility: not eligible page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

      claimStoreServiceMock.resolveRetrieveClaimByExternalId()
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })
})
