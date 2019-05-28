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
  baseFullAdmissionData,
  baseResponseData,
  basePayByInstalmentsData,
  basePayBySetDateData
} from 'test/data/entity/responseData'
import { PaymentOption } from 'claims/models/paymentOption'
import {
  courtDeterminationChoseClaimantData,
  courtDeterminationChoseDefendantData
} from 'test/data/entity/courtDeterminationData'
import { ccjDeterminationByInstalment, ccjDeterminationBySpecifiedDate } from 'test/data/entity/ccjData'

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
    status: 'CCJ - claim submitted and defendant has not responded and is past deadline',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
    },
    claimantAssertions: ['000MC050',
      'The defendant has not responded to your claim. You can request a County Court Judgment against them.'],
    defendantAssertions: ['000MC050',
      'You haven’t responded to the claim.',
      'John Smith can now ask for a County Court Judgment (CCJ) against you.',
      'You can still respond to this claim before they ask for a CCJ.']
  },
  {
    status: 'CCJ - full admission, pay immediately, past deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, paymentIntention: {
        paymentOption: PaymentOption.IMMEDIATELY,
        paymentDate: MomentFactory.currentDate().subtract(5, 'days')
      } },
      responseDeadline: MomentFactory.currentDate().subtract(16, 'days')
    },
    claimantAssertions: ['000MC000', 'The defendant admits they owe all the money. They’ve said that they will pay immediately.'],
    defendantAssertions: ['000MC000', 'You’ve admitted all of the claim and said you’ll pay the full amount immediately.']
  },
  {
    status: 'CCJ - full admission, pay immediately, past deadline - claimant requests CCJ',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, paymentIntention: {
        paymentOption: PaymentOption.IMMEDIATELY,
        paymentDate: MomentFactory.currentDate().subtract(5, 'days')
      }
      },
      countyCourtJudgment: { 'ccjType': 'DEFAULT', 'paidAmount': 10, 'payBySetDate': '2022-01-01', 'paymentOption': 'BY_SPECIFIED_DATE', 'defendantDateOfBirth': '2000-01-01' },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      responseDeadline: MomentFactory.currentDate().subtract(16, 'days')
    },
    claimantAssertions: ['000MC000', 'You requested a County Court Judgment on '],
    defendantAssertions: ['000MC000', 'The claimant has requested a County Court Judgment (CCJ) against you on']
  },
  {
    status: 'CCJ - full admission, pay by set date, claimant accepts the repayment plan and request a CCJ',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'CCJ' },
      countyCourtJudgment: { 'ccjType': 'DETERMINATION', 'paidAmount': 10, 'payBySetDate': '2022-01-01', 'paymentOption': 'BY_SPECIFIED_DATE', 'defendantDateOfBirth': '2000-01-01' },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
    defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
  },
  {
    status: 'CCJ - full admission, pay by set date, claimant accept the repayment plan with settlement agreement, defendant rejects the settlement agreement',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      settlement: claimStoreServiceMock.partySettlementWithSetDateAndRejection,
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'SETTLEMENT' },
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['000MC050', 'John Doe has rejected your settlement agreement. You can request a County Court Judgment against them'],
    defendantAssertions: ['000MC050', 'You rejected the settlement agreement']
  },
  {
    status: 'CCJ - full admission, pay by set date, rejected the defendants repayment plan and accepted alternative plan suggested by the court then requests a CCJ.',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'CCJ',
        courtDetermination: {
          ...courtDeterminationChoseDefendantData
        }
      },
      countyCourtJudgment: { ...ccjDeterminationByInstalment },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
    defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
  },
  {
    status: 'CCJ - full admission, pay by set date, rejected the defendants repayment plan and claimants suggested repayment plan accepted by the court then requests a CCJ.',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'CCJ',
        courtDetermination: {
          ...courtDeterminationChoseClaimantData
        },
        claimantPaymentIntention: {
          paymentDate: '2020-01-01',
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      },
      countyCourtJudgment: { ...ccjDeterminationBySpecifiedDate },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
    defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
  },
  {
    status: 'CCJ - full admission, pay by set date, rejected the defendants repayment plan and rejected alternative plan suggested by the court.',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'REFER_TO_JUDGE' },
      settlementReachedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['000MC050', 'Awaiting judge’s review'],
    defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
  },
  {
    status: 'CCJ - full admission, pay by repayment plan, claimant accepts the repayment plan and requests a CCJ',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      settlement: claimStoreServiceMock.settlementWithSetDateAndAcceptation,
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'CCJ' },
      countyCourtJudgment: { 'ccjType': 'DETERMINATION', 'paidAmount': 10, 'payBySetDate': '2022-01-01', 'paymentOption': 'BY_SPECIFIED_DATE', 'defendantDateOfBirth': '2000-01-01' },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
    },
    claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
    defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
  },
  {
    status: 'CCJ - full admission, pay by repayment plan, rejected the defendants repayment plan and rejected alternative plan suggested by the court.',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'REFER_TO_JUDGE' },
      settlementReachedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
    },
    claimantAssertions: ['000MC050', 'Awaiting judge’s review'],
    defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
  },
  {
    status: 'CCJ - full admission, pay by repayment plan, claimant accepts the repayment plan and offers a settlement agreement, defendant rejects the settlement agreement',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'SETTLEMENT' },
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
    },
    claimantAssertions: ['000MC050', 'John Doe has rejected your settlement agreement. You can request a County Court Judgment against them'],
    defendantAssertions: ['000MC050', 'You rejected the settlement agreement']
  }]

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
