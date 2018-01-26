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
import * as draftStoreServiceMock from '../http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Login receiver', async () => {
  attachDefaultHooks(app)

  describe('on GET', async () => {

    describe('for authorized user', async () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should save bearer token in cookie when auth token is retrieved from idam', async () => {
        const token = 'I am dummy access token'
        idamServiceMock.resolveExchangeCode(token)
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        draftStoreServiceMock.resolveFindNoDraftFound()

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.have.cookie(cookieName, token))
      })

      it('should clear state cookie when auth token is retrieved from idam', async () => {
        const token = 'I am dummy access token'
        idamServiceMock.resolveExchangeCode(token)
        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        draftStoreServiceMock.resolveFindNoDraftFound()

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.have.cookie('state', ''))
      })

      context('when no claim or response', async () => {

        it('should redirect to claim start', async () => {
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPage.uri))
        })
      })

      context('when draft claim exists', async () => {

        it('should redirect to claim task-list', async () => {
          draftStoreServiceMock.resolveFind('claim')
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
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantId('A')

          await request(app)
            .get(AppPaths.receiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(ResponsePaths.taskListPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })
      })

      context('when draft claim and defendant has a claim against them', async () => {

        it('should redirect to dashboard', async () => {
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

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1')
      })

      it('should redirect to /receiver', async () => {
        const token = 'token'
        idamServiceMock.resolveExchangeCode(token)

        await request(app)
          .get(`${pagePath}?code=123`)
          .expect(res => expect(res).to.be.redirect.toLocation(AppPaths.receiver.uri))
      })

      it('should set session cookie to token value returned from idam', async () => {
        const token = 'token'
        idamServiceMock.resolveExchangeCode(token)

        await request(app)
          .get(`${pagePath}?code=123`)
          .expect(res => expect(res).to.have.cookie(cookieName, token))
      })
    })
  })
})
