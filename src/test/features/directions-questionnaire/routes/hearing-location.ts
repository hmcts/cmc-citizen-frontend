import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'directions-questionnaire/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as courtFinderMock from 'test/http-mocks/court-finder-client'
import { checkAuthorizationGuards } from 'test/features/ccj/routes/checks/authorization-check'

import { createClaim } from 'test/features/directions-questionnaire/routes/helper/dqRouteHelper'
import { MadeBy } from 'claims/models/madeBy'
import { PartyType } from 'integration-test/data/party-type'
import { FeatureToggles } from 'utils/featureToggles'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const claim = createClaim(PartyType.INDIVIDUAL, PartyType.ORGANISATION, MadeBy.CLAIMANT)

const externalId = claimStoreServiceMock.sampleClaimObj.externalId

const cookieName: string = config.get<string>('session.cookieName')
const expertPath = Paths.expertPage.evaluateUri({ externalId: externalId })
const pagePath = Paths.hearingLocationPage.evaluateUri({ externalId: externalId })

function checkAccessGuard (app: any, method: string) {
  it(`should redirect to dashboard page when DQ is not enabled for claim`, async () => {
    idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
    claimStoreServiceMock.resolveRetrieveClaimByExternalId()
    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
  })
}

describe('Directions Questionnaire - hearing location', () => {
  if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
    attachDefaultHooks(app)

    describe('on GET', () => {
      const method = 'get'
      checkAuthorizationGuards(app, method, pagePath)
      checkAccessGuard(app, method)

      context('when defendant authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
        })

        verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)
      })

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        })

        it('should return 500 and render error page when cannot retrieve claims', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve directions questionnaire draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when court finder client is not functioning', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          draftStoreServiceMock.resolveFind('response')
          courtFinderMock.rejectFind()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        context('when court finder client is functioning', () => {
          it('should render page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', `${courtFinderMock.searchResponse[0].name}`, 'This is the closest court to the address you gave us'))
          })
        })

        context('when draft is available and alternative court was selected previously by search', () => {
          it('should render page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaireWithAlternateCourt')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', `${courtFinderMock.searchResponse[0].name}`, 'This is the closest court to the address you gave us'))
          })
        })

        context('when draft is available and nearest court was selected previously by search', () => {
          it('should render page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaireWithAlternateCourt')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', `${courtFinderMock.searchResponse[0].name}`, 'This is the closest court to the address you gave us'))
          })
        })

      })
    })

    describe('on POST', () => {
      const validFormDataAccept = { courtAccepted: 'yes', courtName: 'Test court' }

      const invalidFormData = { courtAccepted: 'no' }

      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)
      checkAccessGuard(app, method)

      context('when defendant authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
        })

        verifyRedirectForPostWhenAlreadyPaidInFull(pagePath)
      })

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        })

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormDataAccept)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 when cannot retrieve DQ draft', async () => {
          draftStoreServiceMock.rejectFind('Error')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormDataAccept)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        context('when form is valid', async () => {
          it('should return 500 and render error page when cannot save DQ draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.rejectUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormDataAccept)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          context('When court is accepted', () => {
            it('should redirect to expert page', async () => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
              draftStoreServiceMock.resolveFind('directionsQuestionnaire')
              draftStoreServiceMock.resolveFind('response')
              draftStoreServiceMock.resolveUpdate()

              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(validFormDataAccept)
                .expect(res => expect(res).to.be.redirect.toLocation(expertPath))
            })
          })
        })

        context('when form is invalid', async () => {
          it('should render page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(invalidFormData)
              .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', 'div class="error-summary"'))
          })
        })

        context('when submit from to display the result page', () => {
          context('when form is valid', () => {
            it('should redirect to expert page', async () => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
              draftStoreServiceMock.resolveFind('directionsQuestionnaire')
              draftStoreServiceMock.resolveFind('response')
              draftStoreServiceMock.resolveUpdate()

              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send({ alternativeCourtName: 'Test' })
                .expect(res => expect(res).to.be.redirect.toLocation(expertPath))
            })
          })

          context('when form is invalid', () => {
            it('should render the page with errors', async () => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
              draftStoreServiceMock.resolveFind('directionsQuestionnaire')
              draftStoreServiceMock.resolveFind('response')
              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send({ alternativeCourtName: undefined })
                .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', 'div class="error-summary"'))
            })
          })
        })

        context('when court is rejected and searched via postcode from first loop', () => {
          it('should display the search result', async () => {
            const searchWithPostCodeFirstLoopFormData = { courtAccepted: 'no', courtName: 'Test court', alternativeOption: 'postcode', alternativePostcode: 'AB1 2CD' }

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(searchWithPostCodeFirstLoopFormData)
              .expect(res => expect(res).to.be.successful.withText('We have found a court nearest to '))
          })

          it('should render error when post code is undefined', async () => {
            const searchWithPostCodeFirstLoopFormData = { courtAccepted: 'no', courtName: 'Test court', alternativeOption: 'postcode', alternativePostcode: '' }

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(searchWithPostCodeFirstLoopFormData)
              .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', 'div class="error-summary"'))
          })

          it('should handle exception and reder error if court finder is not functioning', async () => {
            const searchWithPostCodeFirstLoopFormData = { courtAccepted: 'no', courtName: 'Test court', alternativeOption: 'postcode', alternativePostcode: 'AB1 2CD' }

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.rejectFind()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(searchWithPostCodeFirstLoopFormData)
              .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', 'div class="error-summary"'))
          })
        })

        context('when alternative court is rejected and searched via postcode from second loop', () => {
          it('should display the search result for valid search', async () => {
            const searchWithPostCodeSecondLoopFormData = { courtAccepted: undefined, courtName: 'Test court', alternativeCourtSelected: 'no', alternativeOption: 'postcode', alternativePostcode: 'AB1 2CD' }

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(searchWithPostCodeSecondLoopFormData)
              .expect(res => expect(res).to.be.successful.withText('We have found a court nearest to '))
          })

          it('should render error for invalid post code', async () => {
            const searchWithPostCodeSecondLoopFormData = { courtAccepted: undefined, courtName: 'Test court', alternativeCourtSelected: 'no', alternativeOption: 'postcode', alternativePostcode: '', searchParam: 'AB1 2CD', searchLoop: true, searchType: 'postcode' }

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(searchWithPostCodeSecondLoopFormData)
              .expect(res => expect(res).to.be.successful.withText('We have found a court nearest to ', 'div class="error-summary"'))
          })

          it('should handle exception and reder error if court finder is not functioning', async () => {
            const searchWithPostCodeSecondLoopFormData = { courtAccepted: undefined, courtName: 'Test court', alternativeCourtSelected: 'no', alternativeOption: 'postcode', alternativePostcode: 'AB1 2CD', searchParam: 'AB1 2CD', searchLoop: true, searchType: 'postcode' }

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.rejectFind()
            courtFinderMock.rejectFind()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(searchWithPostCodeSecondLoopFormData)
              .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', 'div class="error-summary"'))
          })
        })

        context('when court is rejected and searched via location from first loop', () => {
          it('should display the search result', async () => {
            const searchWithLocationFirstLoopFormData = { courtAccepted: 'no', courtName: 'Test court', alternativeOption: 'name', alternativeCourtName: 'Brimingham' }

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.resolveNameFind()
            courtFinderMock.resolveCourtDetails()
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(searchWithLocationFirstLoopFormData)
              .expect(res => expect(res).to.be.successful.withText('We have found a court nearest to '))
          })

          it('should handle exception and reder error if court finder is not functioning', async () => {
            const searchWithLocationFirstLoopFormData = { courtAccepted: 'no', courtName: 'Test court', alternativeOption: 'name', alternativeCourtName: 'Brimingham' }

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.rejectName()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(searchWithLocationFirstLoopFormData)
              .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', 'div class="error-summary"'))
          })
        })

        context('when court is rejected and searched via location from second loop', () => {
          it('should display the search result for valid search input', async () => {
            const searchWithLocationSecondLoopFormData = { courtAccepted: undefined, courtName: 'Test court', alternativeCourtSelected: 'no', alternativeOption: 'name', alternativeCourtName: 'AB1 2CD' }

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.resolveNameFind()
            courtFinderMock.resolveCourtDetails()
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(searchWithLocationSecondLoopFormData)
              .expect(res => expect(res).to.be.successful.withText('We have found a court nearest to '))
          })

          it('should render error for invalid location', async () => {
            const searchWithLocationSecondLoopFormData = { courtAccepted: undefined, courtName: 'Test court', alternativeCourtSelected: 'no', alternativeOption: 'name', alternativeCourtName: '', searchParam: 'Birmingham', searchLoop: true, searchType: 'name' }

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.resolveNameFind()
            courtFinderMock.resolveCourtDetails()
            courtFinderMock.resolveFind()
            courtFinderMock.resolveCourtDetails()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(searchWithLocationSecondLoopFormData)
              .expect(res => expect(res).to.be.successful.withText('We have found a court nearest to ', 'div class="error-summary"'))
          })

          it('should handle exception and reder error if court finder is not functioning', async () => {
            const searchWithLocationSecondLoopFormData = { courtAccepted: undefined, courtName: 'Test court', alternativeCourtSelected: 'no', alternativeOption: 'name', alternativeCourtName: 'Birmingham', searchParam: 'Birmingham', searchLoop: true, searchType: 'name' }

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            draftStoreServiceMock.resolveFind('response')
            courtFinderMock.rejectName()
            courtFinderMock.rejectName()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(searchWithLocationSecondLoopFormData)
              .expect(res => expect(res).to.be.successful.withText('Choose a hearing location', 'div class="error-summary"'))
          })
        })

        context('when suggested court is rejected and user selected nearest court from second loop', () => {
          context('when form is valid', () => {
            it('should redirect to expert page', async () => {
              const nearestCourtSelectedFormData = { courtAccepted: undefined, courtName: 'Test Court', alternativeCourtSelected: 'no', alternativeOption: 'nearestCourtSelected' }

              claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
              draftStoreServiceMock.resolveFind('directionsQuestionnaire')
              draftStoreServiceMock.resolveFind('response')
              draftStoreServiceMock.resolveUpdate()
              courtFinderMock.resolveFind()
              courtFinderMock.resolveCourtDetails()

              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(nearestCourtSelectedFormData)
                .expect(res => expect(res).to.be.redirect.toLocation(expertPath))
            })
          })
        })

        context('when alternative court is selected from second loop', () => {
          context('when form is valid', () => {
            it('should redirect to expert page', async () => {
              const alternativeCourtSelectedFormData = { courtAccepted: undefined, courtName: 'Test Court', alternativeCourtSelected: 'Birmingham District Probate Registry', alternativeOption: undefined, alternativeCourtName: 'Birmingham District Probate Registry' }

              claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
              draftStoreServiceMock.resolveFind('directionsQuestionnaire')
              draftStoreServiceMock.resolveFind('response')
              draftStoreServiceMock.resolveUpdate()
              courtFinderMock.resolveNameFind()
              courtFinderMock.resolveCourtDetails()

              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(alternativeCourtSelectedFormData)
                .expect(res => expect(res).to.be.redirect.toLocation(expertPath))
            })
          })
        })
      })
    })
  }
})
