import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { getSessionCookie } from 'test/auth-helper'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { app } from 'main/app'
import { Paths } from 'orders/paths'
import { FeatureToggles } from 'utils/featureToggles'

let sessionCookie: string
  beforeEach(async () => {
    sessionCookie = await getSessionCookie(app)
  })


const pagePath = Paths.reviewOrderReceiver.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
  describe('Orders: confirmation page - review order pdf download', () => {
    attachDefaultHooks(app)

    describe('on GET', () => {

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
        })

        context('when claimant or defendant click on review order pdf download', () => {

          it('should download review order pdf', async () => {
            claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId({ features: 'directionsQuestionnaire' })
            claimStoreServiceMock.resolveRetrieveDocument()

            await request(app)
              .get(pagePath)
              .set('Cookie', sessionCookie)
              .expect(res => expect(res).to.be.successful)
          })

          it('should return 500 and render error page when cannot generate PDF', async () => {
            claimStoreServiceMock.rejectRetrieveDocument('HTTP error')

            await request(app)
              .get(pagePath)
              .set('Cookie', sessionCookie)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })
      })
    })
  })
}
