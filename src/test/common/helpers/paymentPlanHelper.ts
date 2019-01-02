import { Claim } from 'claims/models/claim'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { expect } from 'chai'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { MomentFactory } from 'shared/momentFactory'
import { calculateMonthIncrement } from 'common/calculate-month-increment/calculateMonthIncrement'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { ClaimData } from 'claims/models/claimData'
import { TheirDetails } from 'claims/models/details/theirs/theirDetails'

describe('PaymentPlanHelper', () => {
  let claim: Claim
  let draft: DraftClaimantResponse

  beforeEach(() => {
    claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
    draft = new DraftClaimantResponse().deserialize({ courtDetermination: { disposableIncome: 1000 } })
  })

  context('createPaymentPlanFromDefendantFinancialStatement', () => {
    it('should return correct paymentPlan from defendants financial statement ', () => {
      expect(PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)).to.deep
        .equal(PaymentPlan.create(200, 200, Frequency.WEEKLY, calculateMonthIncrement(MomentFactory.currentDate())))
    })

    context('should return max date for instalments less than a pound a week', () => {
      it('just under the threshold', () => {
        draft.courtDetermination.disposableIncome = parseFloat(Frequency.WEEKLY.monthlyRatio.toFixed(2)) - 0.01
        const paymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)
        expect(paymentPlan.startDate.toISOString()).to.equal(MomentFactory.maxDate().toISOString())
      })

      it('just over the threshold', () => {
        draft.courtDetermination.disposableIncome = parseFloat(Frequency.WEEKLY.monthlyRatio.toFixed(2)) + 0.01
        const paymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)
        expect(paymentPlan.startDate.toISOString()).not.to.equal(MomentFactory.maxDate().toISOString())
      })
    })

    context('when a defendant is a business', () => {
      it('should return an undefined paymentPlan', () => {
        draft.courtDetermination.disposableIncome = parseFloat(Frequency.WEEKLY.monthlyRatio.toFixed(2)) + 0.01
        claim.claimData = new ClaimData().deserialize({
          defendants: new Array(new TheirDetails().deserialize({
            type: 'organisation',
            name: undefined,
            address: undefined,
            email: undefined
          }))
        })
        const paymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)
        expect(paymentPlan).eq(undefined)
      })
    })
  })
})
