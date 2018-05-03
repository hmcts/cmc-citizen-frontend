import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import '../../../../routes/expectations'
import { checkAuthorizationGuards } from './../checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../../main/app'

import * as idamServiceMock from '../../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../../http-mocks/claim-store'
import * as feesServiceMock from '../../../../http-mocks/fees'
import { checkNotDefendantInCaseGuard } from '../checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = ResponsePaths.sendYourResponseByEmailPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Defendant response: send your response by email', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      it('should return 500 and render error page when retrieving issue fee range group failed', async () => {
        draftStoreServiceMock.resolveFind('response')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        feesServiceMock.rejectGetIssueFeeRangeGroup()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveFind('response')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        feesServiceMock.resolveGetIssueFeeRangeGroup()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Post your response'))
      })

      it('should return error page when unable to retrieve draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectFind()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })
    })
  })
})
