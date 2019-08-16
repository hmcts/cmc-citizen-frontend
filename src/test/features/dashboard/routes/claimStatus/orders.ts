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
import { MomentFactory } from 'shared/momentFactory'
import { NumberFormatter } from 'utils/numberFormatter'

import {
  baseDefenceData,
  baseResponseData,
  defenceWithAmountClaimedAlreadyPaidData
} from 'test/data/entity/responseData'

import {
  respondedAt,
  claimantRejectAlreadyPaid,
  directionsQuestionnaireDeadline
} from 'test/data/entity/fullDefenceData'

const cookieName: string = config.get<string>('session.cookieName')

const ordersClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  responseDeadline: MomentFactory.currentDate().add(1, 'days'),
  response: {
    ...baseResponseData,
    ...baseDefenceData,
    amount: 30
  },
  claimantResponse: {
    freeMediation: 'yes',
    settleForAmount: 'no',
    type: 'REJECTION'
  },
  claimantRespondedAt: MomentFactory.currentDate(),
  ...respondedAt,
  directionsOrder: {
    directions: [
      {
        id: 'd2832981-a23a-4a4c-8b6a-a013c2c8a637',
        directionParty: 'BOTH',
        directionType: 'DOCUMENTS',
        directionActionedBy: '2019-09-20'
      },
      {
        id: '8e3a20c2-10a4-49fd-b1a7-da66b088f978',
        directionParty: 'BOTH',
        directionType: 'EYEWITNESS',
        directionActionedBy: '2019-09-20'
      }
    ],
    paperDetermination: 'no',
    preferredDQCourt: 'Central London County Court',
    hearingCourt: 'CLERKENWELL',
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
    status: 'Full defence - defendant paid what he believe',
    claim: ordersClaim,
    claimOverride: {
      response: { ...defenceWithAmountClaimedAlreadyPaidData }
    },
    claimantAssertions: [
      'The defendant’s response',
      ordersClaim.claim.defendants[0].name + ` says they paid you ${NumberFormatter.formatMoney(defenceWithAmountClaimedAlreadyPaidData.paymentDeclaration.paidAmount)} on `,
      'You can accept or reject this response.',
      'View and respond'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'We’ve emailed ' + ordersClaim.claim.claimants[0].name + ' telling them when and how you said you paid the claim.',
      'Download your response'
    ]
  },
  {
    status: 'Full defence - defendant paid what he believe - claimant rejected defendant response without mediation',
    claim: ordersClaim,
    claimOverride: {
      response: { ...defenceWithAmountClaimedAlreadyPaidData },
      ...claimantRejectAlreadyPaid,
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: [
      'Wait for the court to review the case',
      `You’ve rejected ${ordersClaim.claim.defendants[0].name}’s response and said you want to take the case to court.`,
      'The court will review the case. We’ll email you if we set a hearing date to tell you how to prepare.',
      'Download their response'
    ],
    defendantAssertions: [
      `John Smith has rejected your admission of ${NumberFormatter.formatMoney(defenceWithAmountClaimedAlreadyPaidData.paymentDeclaration.paidAmount)}`,
      'They said you didn’t pay them £' + defenceWithAmountClaimedAlreadyPaidData.paymentDeclaration.paidAmount,
      'You might have to go to a court hearing. We’ll contact you if we set a hearing date to tell you how to prepare.',
      'Download your response'
    ]
  }
]

const claimPagePath = Paths.claimantPage.evaluateUri({ externalId: ordersClaim.externalId })
const defendantPagePath = Paths.defendantPage.evaluateUri({ externalId: ordersClaim.externalId })

describe('Dashboard page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', claimPagePath)
    checkAuthorizationGuards(app, 'get', defendantPagePath)

    context('when user authorised', () => {
      context('Claim Status', () => {
        context('as a claimant', () => {
          beforeEach(() => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
            claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-08-16'))
          })

          testData.forEach(data => {
            it(`should render claim status: ${data.status}`, async () => {
              claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)

              await request(app)
                .get(claimPagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
            })
          })
        })

        context('as a defendant', () => {
          beforeEach(() => {
            idamServiceMock.resolveRetrieveUserFor('123', 'citizen')
          })

          testData.forEach(data => {
            it(`should render dashboard: ${data.status}`, async () => {
              claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)

              await request(app)
                .get(defendantPagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
            })
          })
        })
      })
    })
  })
})
