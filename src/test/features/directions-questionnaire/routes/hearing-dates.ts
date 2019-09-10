import { expect } from 'chai'
import * as config from 'config'
import * as request from 'supertest'
import { app } from 'main/app'
import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/routes/authorization-check'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { createClaim } from './helper/dqRouteHelper'
import { Paths } from 'directions-questionnaire/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { PartyType } from 'integration-test/data/party-type'
import { MadeBy } from 'claims/models/madeBy'
import { daysFromNow } from 'test/localDateUtils'
import { FeatureToggles } from 'utils/featureToggles'

const claimWithDQ = {
  ...claimStoreServiceMock.sampleClaimObj,
  ...{ features: ['directionsQuestionnaire'] }
}

const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const claim = createClaim(PartyType.INDIVIDUAL, PartyType.ORGANISATION, MadeBy.CLAIMANT)
const pagePath = Paths.hearingDatesPage.evaluateUri({ externalId: externalId })
const defendantTaskListPage = ResponsePaths.taskListPage.evaluateUri({ externalId: externalId })
const cookieName: string = config.get<string>('session.cookieName')

function checkAccessGuard (app: any, method: string) {

  it('should redirect to dashboard page when DQ is not enabled for claim', async () => {
    idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
    claimStoreServiceMock.resolveRetrieveClaimByExternalId()
    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
  })
}

if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
  describe('Directions Questionnaire - hearing unavailable dates', () => {
    attachDefaultHooks(app)

    describe('on GET', () => {
      const method = 'get'
      checkAuthorizationGuards(app, method, pagePath)
      checkAccessGuard(app, method)

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

        context('when everything is fine', () => {
          it('should render page without pre-selected dates', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText(
                'Select the dates you can’t go to a hearing',
                'No dates added yet'
              ))
          })

          it('should render page with pre-selected dates', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            draftStoreServiceMock.resolveFind('directionsQuestionnaire', {
              availability: {
                hasUnavailableDates: true,
                unavailableDates: [{ year: 2018, month: 1, day: 1 }, { year: 2018, month: 1, day: 5 }]
              }
            })
            draftStoreServiceMock.resolveFind('response')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText(
                '1 January 2018',
                '5 January 2018'
              ))
          })
        })
      })
    })

    describe('on POST', () => {

      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)
      checkAccessGuard(app, method)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('123', 'citizen')
        })

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({})
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 when cannot retrieve DQ draft', async () => {
          draftStoreServiceMock.rejectFind('Error')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({})
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        context('with the JavaScript-enabled API', () => {
          const validFormData = { hasUnavailableDates: true, unavailableDates: [daysFromNow(1)] }
          const invalidFormData = { hasUnavailableDates: true, unavailableDates: [] }

          context('when form is valid', async () => {
            it('should return 500 and render error page when cannot save DQ draft', async () => {
              draftStoreServiceMock.resolveFind('directionsQuestionnaire')
              draftStoreServiceMock.resolveFind('response')
              draftStoreServiceMock.rejectUpdate()
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)

              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(validFormData)
                .expect(res => expect(res).to.be.serverError.withText('Error'))
            })

            it('should redirect to task list page', async () => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
              draftStoreServiceMock.resolveFind('directionsQuestionnaire')
              draftStoreServiceMock.resolveFind('response')
              draftStoreServiceMock.resolveUpdate()

              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(validFormData)
                .expect(res => expect(res).to.be.redirect.toLocation(defendantTaskListPage))
            })
          })

          context('when form is invalid', async () => {
            it('should render page when everything is fine', async () => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
              draftStoreServiceMock.resolveFind('directionsQuestionnaire')
              draftStoreServiceMock.resolveFind('response')

              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(invalidFormData)
                .expect(res => expect(res).to.be.successful.withText('Select the dates you can’t go to a hearing', 'div class="error-summary"'))
            })
          })
        })

        context('with the JavaScript-disabled API', () => {
          const validFormData = { addDate: 'Add', hasUnavailableDates: true, newDate: daysFromNow(1) }
          const invalidFormDataWithYes = {
            noJS: true,
            addDate: 'Add',
            hasUnavailableDates: true,
            newDate: { year: 2000, month: 2, day: 30 }
          }
          const invalidFormDataWithNo = {
            noJS: true,
            hasUnavailableDates: false,
            unavailableDates: [daysFromNow(1)]
          }

          context('when form is valid', () => {
            it('should return 500 and render error page when cannot save DQ draft', async () => {
              draftStoreServiceMock.resolveFind('directionsQuestionnaire')
              draftStoreServiceMock.resolveFind('response')
              draftStoreServiceMock.rejectUpdate()
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)

              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(validFormData)
                .expect(res => expect(res).to.be.serverError.withText('Error'))
            })

            it('should return to the same page', async () => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
              draftStoreServiceMock.resolveFind('directionsQuestionnaire')
              draftStoreServiceMock.resolveFind('response')
              draftStoreServiceMock.resolveUpdate()

              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(validFormData)
                .expect(res => expect(res).to.be.successful.withText('Select the dates you can’t go to a hearing'))
            })
          })

          context('when form is invalid', () => {
            [invalidFormDataWithNo, invalidFormDataWithYes].forEach(invalidFormData => {
              it(`should render page when everything is fine and has dates ${invalidFormData.hasUnavailableDates ? '' : 'not '}selected`, async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
                draftStoreServiceMock.resolveFind('directionsQuestionnaire')
                draftStoreServiceMock.resolveFind('response')

                await request(app)
                  .post(pagePath)
                  .set('Cookie', `${cookieName}=ABC`)
                  .send(invalidFormData)
                  .expect(res => expect(res).to.be.successful.withText('Select the dates you can’t go to a hearing', 'div class="error-summary"'))
              })
            })
          })
        })
      })
    })
  })
}
