import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from './checks/ccj-requested-check'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Defendant response: confirmation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      checkCountyCourtJudgmentRequestedGuard(app, 'get', pagePath)

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse()

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Defence submitted'))
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('internal service error when retrieving response')

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })
    })
  })
})
