import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/dashboard/routes/checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')

const defendantPage = Paths.defendantPage.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8' })

describe('Dashboard - defendant page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', defendantPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(defendantPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when at least one claim issued', () => {
        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          await request(app)
            .get(defendantPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Claim number', claimStoreServiceMock.sampleClaimObj.referenceNumber))
        })

        it('should return forbidden when accessor is not the defendant', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({
            submitterId: claimStoreServiceMock.sampleClaimObj.defendantId,
            defendantId: claimStoreServiceMock.sampleClaimObj.submitterId
          })
          await request(app)
            .get(defendantPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.forbidden)
        })

        it('should render page with proper status message when claim is in Business Queue state and paper response is reviewed: N9 form', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({ state: 'BUSINESS_QUEUE', claimDocumentCollection: claimStoreServiceMock.paperResponseForm })

          await request(app)
            .get(defendantPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your response has been sent to the County Court Business Centre (CCBC)', 'Your response has been sent to the County Court Business Centre (CCBC)'))
        })

        it('should render page with proper status message when claim is in Business Queue and there is no paper response review', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({ state: 'BUSINESS_QUEUE' })

          await request(app)
            .get(defendantPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('We’ve sent this case to the County Court Business Centre', 'We’ve sent this case to the County Court Business Centre'))
        })

      })
    })
  })
})
