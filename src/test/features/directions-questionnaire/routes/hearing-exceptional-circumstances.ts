import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { Paths } from 'directions-questionnaire/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

import { app } from 'main/app'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as idamServiceMock from '../../../http-mocks/idam'

import { checkAuthorizationGuards } from 'test/features/ccj/routes/checks/authorization-check'
import { PartyType } from '../../../../integration-test/data/party-type'
import { MadeBy } from 'offer/form/models/madeBy'
import { InterestType as ClaimInterestType } from 'claims/models/interestType'
import { Interest } from 'claims/models/interest'
import * as SampleParty from '../../../data/entity/party'
import { InterestDateType } from 'common/interestDateType'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDate } from 'claims/models/interestDate'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const cookieName: string = config.get<string>('session.cookieName')
const hearingLocationPage = Paths.hearingLocationPage.evaluateUri({ externalId: externalId })
const expertPath = Paths.expertPage.evaluateUri({ externalId: externalId })
const pagePath = Paths.hearingExceptionalCircumstancesPage.evaluateUri({ externalId: externalId })
const dashboardPath = DashboardPaths.dashboardPage.uri

function getPartyForType (type: PartyType): any {
  switch (type) {
    case PartyType.SOLE_TRADER:
      return SampleParty.soleTrader
    case PartyType.INDIVIDUAL:
      return SampleParty.individual
    case PartyType.ORGANISATION:
      return SampleParty.organisation
    case PartyType.COMPANY:
      return SampleParty.company
  }
}

function createClaim (claimant: PartyType, defendant: PartyType, currentParty: MadeBy): any {
  return {
    ...claimStoreServiceMock.sampleClaimIssueCommonObj,
    features: ['directionsQuestionnaire'],
    response: currentParty === MadeBy.CLAIMANT ? claimStoreServiceMock.sampleDefendantResponseObj.response : undefined,
    claim: {
      claimants: [
        {
          ...getPartyForType(claimant)
        }
      ],
      defendants: [
        {
          ...getPartyForType(defendant)
        }
      ],
      payment: {
        id: '12',
        amount: 2500,
        state: { status: 'failed' }
      },
      amount: {
        type: 'breakdown',
        rows: [{ reason: 'Reason', amount: 200 }]
      },
      interest: {
        type: ClaimInterestType.STANDARD,
        rate: 10,
        reason: 'Special case',
        interestDate: {
          type: InterestDateType.SUBMISSION,
          endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
        } as InterestDate
      } as Interest,
      reason: 'Because I can',
      feeAmountInPennies: 2500,
      timeline: { rows: [{ date: 'a', description: 'b' }] }
    }
  }
}

function setupMocks (claimant: PartyType, defendant: PartyType, currentParty: MadeBy) {
  const claimObject = createClaim(claimant, defendant, currentParty)
  idamServiceMock.resolveRetrieveUserFor(currentParty === MadeBy.CLAIMANT ? claimObject.submitterId : claimObject.defendantId, 'citizen')
  claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimObject)
  draftStoreServiceMock.resolveFind('directionsQuestionnaire')
  draftStoreServiceMock.resolveFind('response')
}

async function shouldRenderPageWithText (text: string, method: string, body?: any) {
  await request(app)[method](pagePath)
    .set('Cookie', `${cookieName}=ABC`)
    .send(body)
    .expect(res => expect(res).to.be.successful.withText(text))
}

async function shouldRedirect (method: string, redirectUri: string, body?: any) {
  await request(app)[method](pagePath)
    .set('Cookie', `${cookieName}=ABC`)
    .send(body)
    .expect(res => expect(res).to.be.redirect.toLocation(redirectUri))
}

async function shouldBeServerError (method: string, text: string, body?: any) {
  await request(app)
    .post(pagePath)
    .set('Cookie', `${cookieName}=ABC`)
    .send(body)
    .expect(res => expect(res).to.be.serverError.withText(text))
}

function checkAccessGuards (app: any, method: string) {

  it(`should redirect to dashboard page when DQ is not enabled for claim`, async () => {
    claimStoreServiceMock.resolveRetrieveClaimByExternalId()
    idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
  })

  describe('should redirect to dashboard page when user is not authorised to view page', () => {
    context('when the user is the claimant', () => {
      describe('when the claim has a defendant response', () => {
        it('Individual vs Individual should access page', async () => {
          setupMocks(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, MadeBy.CLAIMANT)
          await shouldRenderPageWithText('The defendant chose this location', method)
        })

        it('Individual vs Business should redirect to dashboard', async () => {
          setupMocks(PartyType.INDIVIDUAL, PartyType.ORGANISATION, MadeBy.CLAIMANT)
          await shouldRedirect(method, dashboardPath)
        })

        it('Business vs Individual should access page', async () => {
          setupMocks(PartyType.ORGANISATION, PartyType.INDIVIDUAL, MadeBy.CLAIMANT)
          await shouldRenderPageWithText('The defendant chose this location', method)
        })

        it('Business vs Business should redirect to dashboard', async () => {
          setupMocks(PartyType.ORGANISATION, PartyType.ORGANISATION, MadeBy.CLAIMANT)
          await shouldRedirect(method, dashboardPath)
        })
      })

      describe('when the claim does not have a defendant response', () => {
        it('should throw an error', async () => {
          const claimObject = {
            ...claimStoreServiceMock.sampleClaimIssueCommonObj,
            features: ['directionsQuestionnaire'],
            claim: {
              claimants: [
                {
                  ...getPartyForType(PartyType.INDIVIDUAL)
                }
              ],
              defendants: [
                {
                  ...getPartyForType(PartyType.ORGANISATION)
                }
              ],
              payment: {
                id: '12',
                amount: 2500,
                state: { status: 'failed' }
              },
              amount: {
                type: 'breakdown',
                rows: [{ reason: 'Reason', amount: 200 }]
              },
              interest: {
                type: ClaimInterestType.STANDARD,
                rate: 10,
                reason: 'Special case',
                interestDate: {
                  type: InterestDateType.SUBMISSION,
                  endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
                } as InterestDate
              } as Interest,
              reason: 'Because I can',
              feeAmountInPennies: 2500,
              timeline: { rows: [{ date: 'a', description: 'b' }] }
            }
          }
          idamServiceMock.resolveRetrieveUserFor(claimObject.submitterId, 'citizen')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimObject)
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          draftStoreServiceMock.resolveFind('response')
          await shouldBeServerError(method, 'Error')
        })
      })
    })

    context('when the user is the defendant', () => {
      it('Individual vs Individual should redirect to dashboard', async () => {
        setupMocks(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, MadeBy.DEFENDANT)
        await shouldRedirect(method, dashboardPath)
      })

      it('Individual vs Business should access page', async () => {
        setupMocks(PartyType.INDIVIDUAL, PartyType.ORGANISATION, MadeBy.DEFENDANT)
        await shouldRenderPageWithText('The hearing will be held at the claimant’s chosen court', method)
      })

      it('Business vs Individual should redirect to dashboard', async () => {
        setupMocks(PartyType.ORGANISATION, PartyType.INDIVIDUAL, MadeBy.DEFENDANT)
        await shouldRedirect(method, dashboardPath)
      })

      it('Business vs Business should access page', async () => {
        setupMocks(PartyType.ORGANISATION, PartyType.ORGANISATION, MadeBy.DEFENDANT)
        await shouldRenderPageWithText('The hearing will be held at the claimant’s chosen court', method)
      })
    })
  })
}

describe('Directions Questionnaire - Hearing exceptional circumstances page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method: string = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkAccessGuards(app, method)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')
        await shouldBeServerError(method, 'Error')
      })

      it('should return 500 and render error page when cannot retrieve directions questionnaire draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(createClaim(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, MadeBy.CLAIMANT))
        draftStoreServiceMock.rejectFind('Error')
        await shouldBeServerError(method, 'Error')
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(createClaim(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, MadeBy.CLAIMANT))
        draftStoreServiceMock.resolveFind('directionsQuestionnaire')
        draftStoreServiceMock.resolveFind('response')
        await shouldRenderPageWithText('The defendant chose this location', method)

      })
    })
  })

  describe('on POST', () => {
    const method: string = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkAccessGuards(app, method)
    context('When user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })
      const validFormData = { option: 'yes', reason: 'reason' }
      const invalidFormData = { option: 'yes' }

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')
        await shouldBeServerError(method, 'Error', validFormData)
      })

      it('should return 500 when cannot retrieve DQ draft', async () => {
        draftStoreServiceMock.rejectFind('Error')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(createClaim(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, MadeBy.CLAIMANT))
        await shouldBeServerError(method, 'Error', validFormData)
      })

      context('when form is valid', async () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(createClaim(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, MadeBy.CLAIMANT))
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          draftStoreServiceMock.resolveFind('response')
        })
        it('should return 500 and render error page when cannot save DQ draft', async () => {
          draftStoreServiceMock.rejectSave()
          await shouldBeServerError(method, 'Error', validFormData)
        })

        it('should redirect to hearing location page when yes is selected', async () => {
          draftStoreServiceMock.resolveSave()
          await shouldRedirect(method, hearingLocationPage, validFormData)
        })

        it('should redirect to expert page when no is selected', async () => {
          draftStoreServiceMock.resolveSave()
          await shouldRedirect(method, expertPath, { option: 'no' })
        })
      })

      context('when form is invalid', async () => {
        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(createClaim(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, MadeBy.CLAIMANT))
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          draftStoreServiceMock.resolveFind('response')
          await shouldRenderPageWithText('div class="error-summary', method, invalidFormData)
        })
      })
    })
  })
})
