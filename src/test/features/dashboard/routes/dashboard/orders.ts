import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/dashboard/routes/checks/authorization-check'
import { MomentFactory } from 'shared/momentFactory'

import {
  baseResponseData,
  defenceWithDisputeData
} from 'test/data/entity/responseData'

import { respondedAt } from 'test/data/entity/fullDefenceData'
import { MadeBy } from 'claims/models/madeBy'

const cookieName: string = config.get<string>('session.cookieName')

const ordersClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  responseDeadline: MomentFactory.currentDate().add(1, 'days'),
  features: ['admissions', 'directionsQuestionnaire'],
  response: {
    ...baseResponseData,
    ...defenceWithDisputeData
  },
  claimantResponse: {
    type: 'REJECTION'
  },
  claimantRespondedAt: MomentFactory.currentDate(),
  ...respondedAt,
  directionOrder: {
    directions: [
      {
        id: 'd2832981-a23a-4a4c-8b6a-a013c2c8a637',
        directionParty: 'BOTH',
        directionType: 'DOCUMENTS',
        directionActionedDate: '2019-09-20'
      },
      {
        id: '8e3a20c2-10a4-49fd-b1a7-da66b088f978',
        directionParty: 'BOTH',
        directionType: 'EYEWITNESS',
        directionActionedDate: '2019-08-20'
      }
    ],
    paperDetermination: 'no',
    preferredDQCourt: 'Central London County Court',
    hearingCourt: 'CLERKENWELL',
    hearingCourtName: 'Clerkenwell and Shoreditch County Court and Family Court',
    hearingCourtAddress: {
      line1: 'The Gee Street Courthouse',
      line2: '29-41 Gee Street',
      city: 'London',
      postcode: 'EC1V 3RE'
    },
    estimatedHearingDuration: 'HALF_HOUR',
    createdOn: '2019-08-09T09:27:42.04'
  }
}

const testData = [
  {
    status: 'Orders - defendant fully defended - claimant rejected defence - orders drawn',
    claim: ordersClaim,
    claimOverride: {},
    claimantAssertions: ['Send us more details before the hearing'],
    defendantAssertions: ['Send us more details before the hearing']
  },
  {
    status: 'Orders - defendant fully defended - claimant rejected defence - orders drawn - review requested by claimant',
    claim: ordersClaim,
    claimOverride: {
      reviewOrder: {
        reason: 'some reason',
        requestedBy: MadeBy.CLAIMANT.value,
        requestedAt: MomentFactory.parse('2019-01-01')
      }
    },
    claimantAssertions: ['You’ve asked the court to review the order'],
    defendantAssertions: ['Read the claimant’s request for a judge to review the order.']
  },
  {
    status: 'Orders - defendant fully defended - claimant rejected defence - orders drawn - review requested by defendant',
    claim: ordersClaim,
    claimOverride: {
      reviewOrder: {
        reason: 'some reason',
        requestedBy: MadeBy.DEFENDANT.value,
        requestedAt: MomentFactory.parse('2019-01-01')
      }
    },
    claimantAssertions: ['Read the defendant’s request for a judge to review the order.'],
    defendantAssertions: ['You’ve asked the court to review the order']
  }
]

describe('Dashboard page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', Paths.dashboardPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      context('Dashboard Status', () => {
        context('as a claimant', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          })

          testData.forEach(data => {
            it(`should render dashboard: ${data.status}`, async () => {
              draftStoreServiceMock.resolveFindNoDraftFound()
              claimStoreServiceMock.resolveRetrieveByClaimantId(data.claim, data.claimOverride)
              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
            })
          })
        })

        context('as a defendant', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          })

          testData.forEach(data => {
            it(`should render dashboard: ${data.status}`, async () => {
              draftStoreServiceMock.resolveFindNoDraftFound()
              claimStoreServiceMock.resolveRetrieveByDefendantId(data.claim.referenceNumber, '1', data.claim, data.claimOverride)
              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
            })
          })
        })
      })
    })
  })
})
