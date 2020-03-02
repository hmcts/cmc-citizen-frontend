import { expect } from 'chai'
import { app } from 'main/app'
import * as config from 'config'
import * as request from 'supertest'

import { Paths } from 'directions-questionnaire/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/routes/authorization-check'

import { createClaim } from './helper/dqRouteHelper'
import { PartyType } from 'integration-test/data/party-type'
import { MadeBy } from 'claims/models/madeBy'
import { LocalDate } from 'forms/models/localDate'
import { daysFromNow } from 'test/localDateUtils'
import { FeatureToggles } from 'utils/featureToggles'

const claimWithDQ = {
  ...claimStoreServiceMock.sampleClaimObj,
  ...{ features: ['directionsQuestionnaire'] }
}

const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const claim = createClaim(PartyType.INDIVIDUAL, PartyType.ORGANISATION, MadeBy.CLAIMANT)
const cookieName: string = config.get<string>('session.cookieName')
const hearingDatesPath = Paths.hearingDatesPage.evaluateUri({ externalId: externalId })

const unavailableDates: LocalDate[] = [
  daysFromNow(1),
  daysFromNow(10),
  daysFromNow(100)
]

function checkAccessGuard (app: any, method: string, path: string) {
  it('should redirect to dashboard page when DQ is not enabled for claim', async () => {
    idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
    claimStoreServiceMock.resolveRetrieveClaimByExternalId()
    await request(app)[method](path)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
  })
}

if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
  describe('Directions Questionnaire - hearing dates picker widget', () => {
    attachDefaultHooks(app)

    describe('delete a date', () => {
      const deletePath = Paths.hearingDatesDeleteReceiver.evaluateUri({ externalId: externalId, index: 'date-1' })

      const method = 'get'
      checkAuthorizationGuards(app, method, deletePath)
      checkAccessGuard(app, method, deletePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        })

        it('should redirect to the hearing dates page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
          draftStoreServiceMock.resolveFind('directionsQuestionnaire', {
            availability: {
              hasUnavailableDates: true,
              unavailableDates: unavailableDates
            }
          })
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .get(deletePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(hearingDatesPath))
        })
      })
    })

    describe('replace selected dates', () => {
      const replacePath = Paths.hearingDatesReplaceReceiver.evaluateUri({ externalId: externalId })

      const method = 'post'
      checkAuthorizationGuards(app, method, replacePath)
      checkAccessGuard(app, method, replacePath)

      context('when user authorised', () => {
        const validData = { hasUnavailableDates: true, unavailableDates: unavailableDates }
        const invalidData = { hasUnavailableDates: true, unavailableDates: [{ year: 2000, month: 0, day: 2 }] }

        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        })

        context('when form is valid', () => {
          it('should return the formatted data', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(replacePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validData)
              .expect(res => expect(res).to.be.successful.withText(
                'add-another-delete-link-0',
                'add-another-delete-link-1',
                'add-another-delete-link-2'
              ))
              .expect(res => expect(res).to.be.successful.withoutText(
                'add-another-delete-link-3'
              ))
          })
        })

        context('when form is invalid', () => {
          it('should return HTTP 400', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')

            await request(app)
              .post(replacePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(invalidData)
              .expect(res => expect(res).to.be.badRequest)
          })
        })
      })
    })
  })
}
