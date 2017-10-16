import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from './hooks'
import './expectations'

import { Paths as AppPaths } from 'app/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

import { app } from '../../main/app'

import * as idamServiceMock from '../http-mocks/idam'
import * as claimStoreServiceMock from '../http-mocks/claim-store'
import { sampleClaimObj } from '../http-mocks/claim-store'
import * as draftStoreServiceMock from '../http-mocks/draft-store'
import { accessDeniedPagePattern } from '../features/response/routes/checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')

describe('Login receiver', async () => {
  attachDefaultHooks(app)

  describe('on GET', async () => {
    describe('for authorized user', async () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should save bearer token in cookie when auth token is retrieved from idam', async () => {
        const token = 'I am dummy access token'
        idamServiceMock.resolveExchangeCode(token)

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', `state=123`)
          .expect(res => expect(res).to.have.cookie(cookieName, token))
      })

      it('should not remove bearer token saved in cookie when code does not exist in query string', async () => {
        const token = 'I am dummy access token'
        idamServiceMock.resolveExchangeCode(token)
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveFind('response')
        claimStoreServiceMock.resolveRetrieveByClaimantId()
        claimStoreServiceMock.resolveRetrieveByDefendantIdWithResponse()

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.not.have.cookie(cookieName, ''))
      })

      it('should return 500 and render error page when cannot retrieve draft', async () => {
        draftStoreServiceMock.rejectFind('Cos')

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when no claim or response', async () => {
        it('should redirect to claim start', async () => {
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.resolveFindNoDraftFound()
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPage.uri))
        })
      })

      context('when draft claim exists', async () => {
        it('should redirect to claim task-list', async () => {
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveFindNoDraftFound()
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
        })
      })

      context('when claim as a defendant but no draft response', async () => {
        it('should redirect to response task-list', async () => {
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.resolveFindNoDraftFound()
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantId('A', 1)

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(ResponsePaths.taskListPage.evaluateUri({ externalId: sampleClaimObj.externalId })))
        })
      })

      context('when draft claim and defendant has a claim against them', async () => {
        it('should redirect to dashboard', async () => {
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveFind('response')
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantIdWithResponse()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })

      context('when claim exists', async () => {
        it('should redirect to dashboard', async () => {
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.resolveFindNoDraftFound()
          claimStoreServiceMock.resolveRetrieveByClaimantId()
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })
      context('when response exists', async () => {
        it('should redirect to dashboard', async () => {
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.resolveFindNoDraftFound()
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantIdWithResponse()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })
      context('when claim and response exists', async () => {
        it('should redirect to dashboard', async () => {
          draftStoreServiceMock.resolveFindNoDraftFound()
          draftStoreServiceMock.resolveFindNoDraftFound()
          claimStoreServiceMock.resolveRetrieveByClaimantId()
          claimStoreServiceMock.resolveRetrieveByDefendantIdWithResponse()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })
    })
  })
})
describe('Defendant link receiver', () => {
  const pagePath = AppPaths.linkDefendantReceiver.uri
  attachDefaultHooks(app)

  describe('on GET', () => {
    it('should redirect to access denied page when user not in letter holder ID role', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'letter-holder')

      await request(app)
        .get(pagePath)
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
