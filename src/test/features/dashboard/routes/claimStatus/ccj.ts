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
import {
  baseFullAdmissionData,
  basePayImmediatelyDatePastData,
  baseResponseData
} from '../../../../data/entity/responseData'

const cookieName: string = config.get<string>('session.cookieName')

const fullAdmissionClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  responseDeadline: MomentFactory.currentDate().add(1, 'days'),
  response: {
    ...baseResponseData,
    ...baseFullAdmissionData
  }
}

const testData = [
  {
    status: 'CCJ - defendant has not responded within the deadline',
    claim: claimStoreServiceMock.sampleClaimObj,
    claimOverride: {
      responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
    },
    claimantAssertions: [
      'You can request a County Court Judgment',
      claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name + ' has not responded to your claim by the deadline. ' +
      'You can request a County Court Judgment (CCJ) against them.',
      claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name + ' can still respond to the claim until you request a CCJ.'
    ],
    defendantAssertions: [
      'You haven’t responded to this claim',
      'You haven’t responded to the claim. ' + claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name
      + ' can now ask for a County Court Judgment against you.',
      'A County Court Judgment can mean you find it difficult to get credit, like a mortgage or mobile ' +
      'phone contract. Bailiffs could also be sent to your home.',
      'You can still respond to the claim before they ask for a judgment.'
    ]
  },
  {
    status: 'full admission, pay immediately, past deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayImmediatelyDatePastData }
    },
    claimantAssertions: ['000MC000',
      'The defendant said they’ll pay you immediately',
      `They must make sure you have the money by ${MomentFactory.currentDate().subtract(5, 'days').format('D MMMM YYYY')}.`,
      'You need to tell us if you’ve settled the claim, for example because the defendant has paid you.',
      'You can settle for less than the full claim amount.',
      'If you haven’t been paid',
      'request a County Court Judgment.'
    ],
    defendantAssertions: ['000MC000',
      'Your response to the claim',
      `You said you’ll pay ${claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name} £${claimStoreServiceMock.sampleClaimObj.claim.amount.rows[0].amount} before 4pm on ${MomentFactory.currentDate().subtract(5, 'days').format('D MMMM YYYY')}.`,
      'If you pay by cheque or transfer the money must be clear in their account.',
      'If they don’t receive the money by then, they can request a County Court Judgment against you.']
  }
]

const claimPagePath = Paths.claimantPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const defendantPagePath = Paths.defendantPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

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
