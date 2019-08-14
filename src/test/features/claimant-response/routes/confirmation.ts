import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { checkAuthorizationGuards } from 'test/features/claimant-response/routes/checks/authorization-check'
import { checkNotClaimantInCaseGuard } from 'test/features/claimant-response/routes/checks/not-claimant-in-case-check'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { rejectionClaimantResponseData, rejectionClaimantResponseWithDQ } from 'test/data/entity/claimantResponseData'

import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'

import { app } from 'main/app'
import { MomentFactory } from 'shared/momentFactory'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = ClaimantResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Claimant response: confirmation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when claimant response submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          let claimantResponseData = {
            ...claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj,
            ...{ claimantResponse: rejectionClaimantResponseData }
          }
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimantResponseData)
          claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your claim number:'))
        })

        it('should render page with hearing requirement', async () => {
          let claimantResponseData = {
            ...claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj,
            ...{ claimantResponse: rejectionClaimantResponseWithDQ }
          }
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimantResponseData)
          claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Download your hearing requirements'))
        })
      })
    })
  })
})
