import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { accessDeniedPagePattern, checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { sampleClaimObj } from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = ResponsePaths.defendantLinkReceiver.evaluateUri({ letterHolderId: '1' })

describe('Defendant link receiver', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)

    it('should redirect to access denied page when user not in letter holder ID role', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'letter-holder')

      await request(app)
        .get(`${ResponsePaths.defendantLinkReceiver.evaluateUri({ letterHolderId: '999' })}?jwt=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(accessDeniedPagePattern))
    })

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant', 'letter-1')
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveByLetterHolderId('HTTP error')

        await request(app)
          .get(`${pagePath}?jwt=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to task list page when defendant is already set', async () => {
        claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC001', 2)

        await request(app)
          .get(`${pagePath}?jwt=ABC`)
          .expect(res => expect(res).to.be.redirect
            .toLocation(ResponsePaths.taskListPage
              .evaluateUri({ externalId: sampleClaimObj.externalId })))
      })

      it('should return 500 and render error page when cannot link defendant to claim', async () => {
        claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC001')
        claimStoreServiceMock.rejectLinkDefendant('HTTP error')

        await request(app)
          .get(`${pagePath}?jwt=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to task list page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC001')
        claimStoreServiceMock.resolveLinkDefendant()

        await request(app)
          .get(`${pagePath}?jwt=ABC`)
          .expect(res => expect(res).to.be.redirect
            .toLocation(ResponsePaths.taskListPage
              .evaluateUri({ externalId: sampleClaimObj.externalId })))
      })

      it('should set session cookie to token value passed as query parameter', async () => {
        claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC001')
        claimStoreServiceMock.resolveLinkDefendant()

        await request(app)
          .get(`${pagePath}?jwt=ABC`)
          .expect(res => expect(res).to.have.cookie(cookieName, 'ABC'))
      })
    })
  })
})
