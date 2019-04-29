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
import * as moment from 'moment'
import { MomentFactory } from 'shared/momentFactory'

import {
  baseFullAdmissionData,
  basePayByInstalmentsData,
  basePayBySetDateData,
  basePayImmediatelyData,
  baseResponseData
} from 'test/data/entity/responseData'

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
    status: 'Full admission - defendant responded to pay immediately',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayImmediatelyData }
    },
    claimantAssertions: ['The defendant admits they owe all the money. They’ve said that they will pay immediately.'],
    defendantAssertions: ['You’ve admitted all of the claim and said you’ll pay the full amount immediately.']
  },
  {
    status: 'Full admission - defendant responded to pay immediately - past payment deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayImmediatelyData },
      responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
    },
    claimantAssertions: ['The defendant has not responded to your claim. You can request a County Court Judgment against them.'],
    defendantAssertions: [
      'You haven’t responded to the claim.',
      fullAdmissionClaim.claim.claimants[0].name + ' can now ask for a County Court Judgment (CCJ) against you.',
      'You can still respond to this claim before they ask for a CCJ.'
    ]
  },

  {
    status: 'Full admission - defendant responded to pay by set date',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['The defendant has offered to pay by a set date. You can accept or reject their offer.'],
    defendantAssertions: ['You’ve admitted all of the claim and offered to pay the full amount by ' + moment(basePayBySetDateData.paymentIntention.paymentDate).format('LL')]
  },
  {
    status: 'Full admission - defendant responded to pay by set date - claimant accepts repayment plan and referred to judge',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'REFER_TO_JUDGE' }
    },
    claimantAssertions: ['Awaiting judge’s review.'],
    defendantAssertions: [fullAdmissionClaim.claim.claimants[0].name + ' requested a County Court Judgment against you']
  }
  // {
  //   status: 'Full admission - defendant responded to pay by set date - claimant accepts repayment plan by admission'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by set date - claimant accepts repayment plan by determination'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by set date - claimant accepts the repayment plan by admission - defendant past counter signature deadline'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by set date - claimant accepts the repayment plan by determination - defendant past counter signature deadline'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by set date - claimant accepts repayment plan by admission - defendant rejected'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by set date - claimant accepts repayment plan by determination - defendant rejected'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by set date - claimant accepts repayment plan by admission - defendant signed contract'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by set date - claimant accepts repayment plan by determination - defendant signed contract'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by set date - claimant accepts repayment plan by admission - defendant signed contract - past payment deadline'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by set date - claimant accepts repayment plan by determination - defendant signed contract - past payment deadline'
  // },
  //
  // {
  //   status: 'Full admission - defendant responded to pay by installments',
  //   claim: fullAdmissionClaim,
  //   claimOverride: {
  //     response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
  //     amount: 30
  //   },
  //   claimantAssertions: ['000MC000', 'The defendant has offered to pay in instalments. You can accept or reject their offer.'],
  //   defendantAssertions: ['000MC000', 'You’ve admitted all of the claim and offered to pay the full amount in instalments.']
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by installments - claimant accepts repayment plan and referred to judge'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by installments - claimant accepts repayment plan by admission'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by installments - claimant accepts repayment plan by determination'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by installments - claimant accepts the repayment plan by admission - defendant past counter signature deadline'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by installments - claimant accepts the repayment plan by determination - defendant past counter signature deadline'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by installments - claimant accepts repayment plan by admission - defendant rejected'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by installments - claimant accepts repayment plan by determination - defendant rejected'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by installments - claimant accepts repayment plan by admission - defendant signed contract'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by installments - claimant accepts repayment plan by determination - defendant signed contract'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by installments - claimant accepts repayment plan by admission - defendant signed contract - past payment deadline'
  // },
  // {
  //   status: 'Full admission - defendant responded to pay by installments - claimant accepts repayment plan by determination - defendant signed contract - past payment deadline'
  // },
  //
  //
  // {
  //   status: 'Full admission - defendant responded to pay by set date - claimant accept the repayment plan by admission - defendant past counter signature deadline',
  //   claim: fullAdmissionClaim,
  //   claimOverride: {
  //     response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
  //     responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
  //   },
  //   claimantAssertions: ['000MC000', 'The defendant has not responded to your claim. You can request a County Court Judgment against them.'],
  //   defendantAssertions: ['000MC000', 'John Smith can now ask for a County Court Judgment (CCJ) against you']
  // },
  //
  // {
  //   status: 'Full admission - defendant responded to pay by installments - claimant accept the repayment plan - defendant past counter signature deadline',
  //   claim: fullAdmissionClaim,
  //   claimOverride: {
  //     response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
  //     responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
  //   },
  //   claimantAssertions: ['000MC000', 'The defendant has not responded to your claim. You can request a County Court Judgment against them.'],
  //   defendantAssertions: ['000MC000', 'John Smith can now ask for a County Court Judgment (CCJ) against you']
  // },
  //
  // {
  //   status: 'full admission, pay by set date , claimant and defendant both accept the repayment plan and sign',
  //   claim: claimStoreServiceMock.sampleClaimIssueObj,
  //   claimOverride: {
  //     settlement: claimStoreServiceMock.settlementWithSetDateAndAcceptation,
  //     claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'SETTLEMENT' },
  //     settlementReachedAt: MomentFactory.currentDate().subtract(1, 'days'),
  //     response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
  //   },
  //   claimantAssertions: ['000MC050', 'You’ve both signed a legal agreement'],
  //   defendantAssertions: ['000MC050', 'You’ve both signed a legal agreement']
  // },
  // {
  //   status: 'full admission, pay by set date , claimant accept the repayment plan and signed a settlement agreement. defendant yet to respond',
  //   claim: claimStoreServiceMock.sampleClaimIssueObj,
  //   claimOverride: {
  //     settlement: claimStoreServiceMock.partySettlementWithSetDateAndAcceptation,
  //     claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'SETTLEMENT' },
  //     response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
  //   },
  //   claimantAssertions: ['000MC050', 'You’ve signed a settlement agreement. The defendant can choose to sign it or not'],
  //   defendantAssertions: ['000MC050', 'John Smith asked you to sign a settlement agreement']
  // },
  // {
  //   status: 'full admission, pay by set date, claimant accept the repayment plan and request a CCJ',
  //   claim: claimStoreServiceMock.sampleClaimIssueObj,
  //   claimOverride: {
  //     settlement: claimStoreServiceMock.settlementWithSetDateAndAcceptation,
  //     claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'CCJ' },
  //     countyCourtJudgment: {
  //       'ccjType': 'DETERMINATION',
  //       'paidAmount': 10,
  //       'payBySetDate': '2022-01-01',
  //       'paymentOption': 'BY_SPECIFIED_DATE',
  //       'defendantDateOfBirth': '2000-01-01'
  //     },
  //     countyCourtJudgmentRequestedAt: MomentFactory.currentDate().subtract(1, 'days'),
  //     response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
  //   },
  //   claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
  //   defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
  // },
  // {
  //   status: 'full admission, pay by set date, claimant accept the repayment plan and request a CCJ, claim settled by claimant',
  //   claim: claimStoreServiceMock.sampleClaimIssueObj,
  //   claimOverride: {
  //     settlement: claimStoreServiceMock.settlementWithSetDateAndAcceptation,
  //     claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'CCJ' },
  //     countyCourtJudgment: {
  //       'ccjType': 'DETERMINATION',
  //       'paidAmount': 10,
  //       'payBySetDate': '2022-01-01',
  //       'paymentOption': 'BY_SPECIFIED_DATE',
  //       'defendantDateOfBirth': '2000-01-01'
  //     },
  //     countyCourtJudgmentRequestedAt: MomentFactory.currentDate().subtract(1, 'days'),
  //     moneyReceivedOn: MomentFactory.currentDate(),
  //     response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
  //   },
  //   claimantAssertions: ['000MC050', 'This claim is settled.'],
  //   defendantAssertions: ['000MC050', 'John Smith confirmed you’ve paid']
  // },
  // {
  //   status: 'full admission, pay by set date,  rejected the defendant’s repayment plan and an alternative plan suggested by the court.',
  //   claim: claimStoreServiceMock.sampleClaimIssueObj,
  //   claimOverride: {
  //     claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'REFER_TO_JUDGE' },
  //     settlementReachedAt: MomentFactory.currentDate().subtract(1, 'days'),
  //     response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
  //   },
  //   claimantAssertions: ['000MC050', 'Awaiting judge’s review'],
  //   defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
  // },
  // {
  //   status: 'full admission, pay by set date , claimant accept the repayment plan, defendant reject the settlement',
  //   claim: claimStoreServiceMock.sampleClaimIssueObj,
  //   claimOverride: {
  //     settlement: claimStoreServiceMock.partySettlementWithSetDateAndRejection,
  //     claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'SETTLEMENT' },
  //     response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
  //   },
  //   claimantAssertions: ['000MC050', 'John Doe has rejected your settlement agreement. You can request a County Court Judgment against them'],
  //   defendantAssertions: ['000MC050', 'You rejected the settlement agreement']
  // },
  // {
  //   status: 'full admission, pay by instalments , claimant accept the repayment plan, defendant miss the past deadline, Request CCJ',
  //   claim: fullAdmissionClaim,
  //   claimOverride: {
  //     response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
  //     responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
  //   },
  //   claimantAssertions: ['000MC000', 'The defendant has not responded to your claim. You can request a County Court Judgment against them.'],
  //   defendantAssertions: ['000MC000', 'John Smith can now ask for a County Court Judgment (CCJ) against you']
  // },
  //
  // {
  //   status: 'full admission, pay by repayment plan, claimant and defendant both accept the repayment plan and sign',
  //   claim: claimStoreServiceMock.sampleClaimIssueObj,
  //   claimOverride: {
  //     settlement: claimStoreServiceMock.settlementWithSetDateAndAcceptation,
  //     claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'SETTLEMENT' },
  //     settlementReachedAt: MomentFactory.currentDate().subtract(1, 'days'),
  //     response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
  //   },
  //   claimantAssertions: ['000MC050', 'You’ve both signed a legal agreement'],
  //   defendantAssertions: ['000MC050', 'You’ve both signed a legal agreement']
  // },
  // {
  //   status: 'full admission, pay by repayment plan , claimant accept the repayment plan and signed a settlement agreement. defendant yet to respond',
  //   claim: claimStoreServiceMock.sampleClaimIssueObj,
  //   claimOverride: {
  //     settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndAcceptation,
  //     claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'SETTLEMENT' },
  //     response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
  //   },
  //   claimantAssertions: ['000MC050', 'You’ve signed a settlement agreement. The defendant can choose to sign it or not'],
  //   defendantAssertions: ['000MC050', 'John Smith asked you to sign a settlement agreement']
  // },
  // {
  //   status: 'full admission, pay by repayment plan, claimant accept the repayment plan and request a CCJ',
  //   claim: claimStoreServiceMock.sampleClaimIssueObj,
  //   claimOverride: {
  //     settlement: claimStoreServiceMock.settlementWithSetDateAndAcceptation,
  //     claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'CCJ' },
  //     countyCourtJudgment: {
  //       'ccjType': 'DETERMINATION',
  //       'paidAmount': 10,
  //       'payBySetDate': '2022-01-01',
  //       'paymentOption': 'BY_SPECIFIED_DATE',
  //       'defendantDateOfBirth': '2000-01-01'
  //     },
  //     countyCourtJudgmentRequestedAt: MomentFactory.currentDate().subtract(1, 'days'),
  //     response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
  //   },
  //   claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
  //   defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
  // },
  // {
  //   status: 'full admission, pay by repayment plan, claimant accept the repayment plan and request a CCJ, claim settled by claimant',
  //   claim: claimStoreServiceMock.sampleClaimIssueObj,
  //   claimOverride: {
  //     settlement: claimStoreServiceMock.settlementWithSetDateAndAcceptation,
  //     claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'CCJ' },
  //     countyCourtJudgment: {
  //       'ccjType': 'DETERMINATION',
  //       'paidAmount': 10,
  //       'payBySetDate': '2022-01-01',
  //       'paymentOption': 'BY_SPECIFIED_DATE',
  //       'defendantDateOfBirth': '2000-01-01'
  //     },
  //     countyCourtJudgmentRequestedAt: MomentFactory.currentDate().subtract(1, 'days'),
  //     moneyReceivedOn: MomentFactory.currentDate(),
  //     response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
  //   },
  //   claimantAssertions: ['000MC050', 'This claim is settled.'],
  //   defendantAssertions: ['000MC050', 'John Smith confirmed you’ve paid']
  // },
  // {
  //   status: 'full admission, pay by repayment plan,  rejected the defendant’s repayment plan and an alternative plan suggested by the court.',
  //   claim: claimStoreServiceMock.sampleClaimIssueObj,
  //   claimOverride: {
  //     claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'REFER_TO_JUDGE' },
  //     settlementReachedAt: MomentFactory.currentDate().subtract(1, 'days'),
  //     response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
  //   },
  //   claimantAssertions: ['000MC050', 'Awaiting judge’s review'],
  //   defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
  // },
  // {
  //   status: 'full admission, pay by instalments , claimant accept the repayment plan, defendant reject the settlement',
  //   claim: claimStoreServiceMock.sampleClaimIssueObj,
  //   claimOverride: {
  //     settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
  //     claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'SETTLEMENT' },
  //     response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
  //   },
  //   claimantAssertions: ['000MC050', 'John Doe has rejected your settlement agreement. You can request a County Court Judgment against them'],
  //   defendantAssertions: ['000MC050', 'You rejected the settlement agreement']
  // }
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
