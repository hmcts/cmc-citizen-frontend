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
  baseDefenceData,
  baseFullAdmissionData,
  basePartialAdmissionData,
  basePayByInstalmentsData,
  basePayBySetDateData,
  basePayImmediatelyData,
  baseResponseData,
  defenceWithAmountClaimedAlreadyPaidData,
  partialAdmissionAlreadyPaidData
} from 'test/data/entity/responseData'
import { baseAcceptationClaimantResponseData } from 'test/data/entity/claimantResponseData'

const cookieName: string = config.get<string>('session.cookieName')

const fullAdmissionClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  responseDeadline: MomentFactory.currentDate().add(1, 'days'),
  response: {
    ...baseResponseData,
    ...baseFullAdmissionData
  }
}

const partAdmissionClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  responseDeadline: MomentFactory.currentDate().add(1, 'days'),
  response: {
    ...baseResponseData,
    ...basePartialAdmissionData,
    amount: 30
  }
}

const fullDefenceClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  responseDeadline: MomentFactory.currentDate().add(1, 'days'),
  response: {
    ...baseResponseData,
    ...baseDefenceData,
    amount: 30
  }
}

const testData = [
  {
    status: 'claim issued',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      responseDeadline: MomentFactory.currentDate().add(1, 'days')
    },
    claimantAssertions: ['000MC050', 'Your claim has been sent.'],
    defendantAssertions: ['000MC050', 'Respond to claim.', '(1 day remaining)']
  },
  {
    status: 'requested more time',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      moreTimeRequested: true,
      responseDeadline: '2099-08-08'
    },
    claimantAssertions: ['000MC050', 'John Doe has requested more time to respond.'],
    defendantAssertions: ['000MC050', 'You need to respond before 4pm on 8 August 2099.']
  },
  {
    status: 'full admission, pay immediately',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayImmediatelyData }
    },
    claimantAssertions: ['000MC000', 'The defendant admits they owe all the money. They’ve said that they will pay immediately.'],
    defendantAssertions: ['000MC000', 'You’ve admitted all of the claim and said you’ll pay the full amount immediately.']
  },
  {
    status: 'full admission, pay immediately, past deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayImmediatelyData },
      responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
    },
    claimantAssertions: ['000MC000', 'The defendant has not responded to your claim. You can request a County Court Judgment against them.'],
    defendantAssertions: ['000MC000', 'You haven’t responded to the claim.', 'John Smith can now ask for a County Court Judgment (CCJ) against you.', 'You can still respond to this claim before they ask for a CCJ.']
  },
  {
    status: 'full admission, pay by set date',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['000MC000', 'The defendant has offered to pay by a set date. You can accept or reject their offer.'],
    defendantAssertions: ['000MC000', 'You’ve admitted all of the claim and offered to pay the full amount by 31 December 2050.']
  },
  {
    status: 'full admission,  pay by set date , claimant accept the repayment plan, defendant past deadline, Request CCJ',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
    },
    claimantAssertions: ['000MC000', 'The defendant has not responded to your claim. You can request a County Court Judgment against them.'],
    defendantAssertions: ['000MC000', 'John Smith can now ask for a County Court Judgment (CCJ) against you']
  },
  {
    status: 'full admission,  pay by instalments , claimant accept the repayment plan, defendant miss the past deadline, Request CCJ',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
    },
    claimantAssertions: ['000MC000', 'The defendant has not responded to your claim. You can request a County Court Judgment against them.'],
    defendantAssertions: ['000MC000', 'John Smith can now ask for a County Court Judgment (CCJ) against you']
  },
  {
    status: 'full admission, pay by repayment plan',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      amount: 30
    },
    claimantAssertions: ['000MC000', 'The defendant has offered to pay in instalments. You can accept or reject their offer.'],
    defendantAssertions: ['000MC000', 'You’ve admitted all of the claim and offered to pay the full amount in instalments.']
  },
  {
    status: 'partial admission, pay immediately',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayImmediatelyData }
    },
    claimantAssertions: ['000MC000', 'The defendant believes they owe you £30. You can accept or reject that this is the amount owed.'],
    defendantAssertions: ['000MC000', 'You’ve admitted part of the claim.']
  },
  {
    status: 'partial admission, pay immediately, offer accepted',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayImmediatelyData },
      claimantResponse: baseAcceptationClaimantResponseData
    },
    claimantAssertions: ['000MC000', 'You’ve accepted the defendant’s part admission. They said they’d pay immediately.'],
    defendantAssertions: ['000MC000', 'John Smith accepted your admission of £30']
  },
  {
    status: 'partial admission, pay immediately, offer accepted, payment past deadline',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayImmediatelyData },
      claimantResponse: baseAcceptationClaimantResponseData,
      responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
    },
    claimantAssertions: ['000MC000', 'The defendant has not responded to your claim. You can request a County Court Judgment against them.'],
    defendantAssertions: ['000MC000', 'You haven’t responded to the claim.', 'John Smith can now ask for a County Court Judgment (CCJ) against you.', 'You can still respond to this claim before they ask for a CCJ.']
  },
  {
    status: 'partial admission, pay by set date',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['000MC000', 'The defendant believes they owe you £30. You can accept or reject that this is the amount owed.'],
    defendantAssertions: ['000MC000', 'You’ve admitted part of the claim.']
  },
  {
    status: 'partial admission, pay by repayment plan',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData }
    },
    claimantAssertions: ['000MC000', 'The defendant believes they owe you £30. You can accept or reject that this is the amount owed.'],
    defendantAssertions: ['000MC000', 'You’ve admitted part of the claim.']
  },
  {
    status: 'partial admission, states paid accepted',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partialAdmissionAlreadyPaidData },
      claimantResponse: { type: 'ACCEPTATION' }
    },
    claimantAssertions: ['000MC000', 'This claim is settled.'],
    defendantAssertions: ['000MC000', 'This claim is settled.']
  },
  {
    status: 'partial admission, states paid rejected',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partialAdmissionAlreadyPaidData },
      claimantResponse: { type: 'REJECTION' }
    },
    claimantAssertions: ['000MC000', 'You’ve rejected the defendant’s admission'],
    defendantAssertions: ['000MC000', 'John Smith rejected your admission of £3,000']
  },
  {
    status: 'full defence, states paid accepted',
    claim: fullDefenceClaim,
    claimOverride: {
      response: { ...defenceWithAmountClaimedAlreadyPaidData },
      claimantResponse: { type: 'ACCEPTATION' }
    },
    claimantAssertions: ['000MC000', 'This claim is settled.'],
    defendantAssertions: ['000MC000', 'This claim is settled.']
  },
  {
    status: 'full defence, states paid rejected',
    claim: fullDefenceClaim,
    claimOverride: {
      response: { ...defenceWithAmountClaimedAlreadyPaidData },
      claimantResponse: { type: 'REJECTION' }
    },
    claimantAssertions: ['000MC000', 'You’ve rejected the defendant’s admission'],
    defendantAssertions: ['000MC000', 'John Smith rejected your admission of £100']
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

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        draftStoreServiceMock.resolveFind('claim')
        claimStoreServiceMock.rejectRetrieveByClaimantId('HTTP error')

        await request(app)
          .get(Paths.dashboardPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when no claims issued', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        })

        it('should render page with start claim button when everything is fine', async () => {
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(Paths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your money claims account', 'Make a new money claim'))
        })

        it('should render page with continue claim button when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .get(Paths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your money claims account', 'Continue with claim'))
        })
      })

      context('Dashboard Status', () => {
        context('as a claimant', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          })

          it('should render page with start claim button when everything is fine', async () => {
            draftStoreServiceMock.resolveFindNoDraftFound()
            claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
            await request(app)
              .get(Paths.dashboardPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Your money claims account', 'Make a new money claim'))
              .expect(res => expect(res).to.be.successful.withText('<a href="/eligibility" class="newclaim" id="start-now" >Make a new money claim</a>'))
          })

          it('should render page with claim number and status', async () => {
            draftStoreServiceMock.resolveFindNoDraftFound()
            claimStoreServiceMock.resolveRetrieveByClaimantId(claimStoreServiceMock.sampleClaimIssueObj)
            await request(app)
              .get(Paths.dashboardPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('000MC050', 'Your claim has been sent'))
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

          it('should render page with start claim button when everything is fine', async () => {
            draftStoreServiceMock.resolveFindNoDraftFound()
            claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
            await request(app)
              .get(Paths.dashboardPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Your money claims account', 'Make a new money claim'))
              .expect(res => expect(res).to.be.successful.withText('<a href="/eligibility" class="newclaim" id="start-now" >Make a new money claim</a>'))
          })

          it('should render page with claim number and status', async () => {
            draftStoreServiceMock.resolveFindNoDraftFound()
            claimStoreServiceMock.resolveRetrieveByDefendantId(claimStoreServiceMock.sampleClaimIssueObj.referenceNumber, '1', claimStoreServiceMock.sampleClaimIssueObj)
            await request(app)
              .get(Paths.dashboardPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('000MC050', 'Respond to claim'))
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
