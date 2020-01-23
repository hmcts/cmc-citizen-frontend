import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { checkAuthorizationGuards } from 'test/features/claimant-response/routes/checks/authorization-check'
import { checkNotClaimantInCaseGuard } from 'test/features/claimant-response/routes/checks/not-claimant-in-case-check'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { Paths } from 'paid-in-full/paths'

import { app } from 'main/app'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { MomentFactory } from 'shared/momentFactory'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = Paths.datePaidPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Claimant paid in full: money received on page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when service is unhealthy', () => {
        it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when claimant has been paid in full', () => {
        it('should display form asking when money was received', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('When did you settle with the defendant?'))
        })
      })

      context('when claimant has already been paid in full', () => {
        it('should display forbidden page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moneyReceivedOn: MomentFactory.currentDate().subtract(1, 'day') })

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.forbidden.withText('Forbidden'))
        })
      })
    })
  })
})
