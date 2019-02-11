import { CourtOfferedInstalmentHelper } from 'claimant-response/helpers/courtOfferedInstalmentHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { expect } from 'chai'

describe('CourtOfferedInstalmentHelper', () => {
  const TOTAL_AMOUNT = 100

  const defendantMonthlyPaymentPlan = PaymentPlan.create(TOTAL_AMOUNT, 20, Frequency.MONTHLY)
  const defendantWeeklyPaymentPlan = PaymentPlan.create(TOTAL_AMOUNT, 20, Frequency.TWO_WEEKLY)

  context('should return defendant entered instalment amount', () => {
    const paymentPlanConvertedToDefendantFrequencyAboveThresholdAmount = PaymentPlan.create(TOTAL_AMOUNT, Frequency.WEEKLY.monthlyRatio + 0.1, Frequency.MONTHLY)

    it('should return correct defendant instalment amount because defendant selected WEEKLY frequency', () => {
      expect(paymentPlanConvertedToDefendantFrequencyAboveThresholdAmount.instalmentAmount).equal(CourtOfferedInstalmentHelper.getCourtOfferedInstalmentAmount(paymentPlanConvertedToDefendantFrequencyAboveThresholdAmount, defendantWeeklyPaymentPlan))
    })

    it('should return correct defendant instalment amount because instalment amount is above than threshold', () => {
      expect(paymentPlanConvertedToDefendantFrequencyAboveThresholdAmount.instalmentAmount).equal(CourtOfferedInstalmentHelper.getCourtOfferedInstalmentAmount(paymentPlanConvertedToDefendantFrequencyAboveThresholdAmount, defendantMonthlyPaymentPlan))
    })
  })

  context('should return court generated instalment amount', () => {
    const paymentPlanConvertedToDefendantFrequencyBelowThresholdAmount = PaymentPlan.create(TOTAL_AMOUNT, Frequency.WEEKLY.monthlyRatio - 0.1, Frequency.MONTHLY)
    it('should return correct court instalment amount because defendant selected MONTHLY frequency', () => {
      expect(paymentPlanConvertedToDefendantFrequencyBelowThresholdAmount.instalmentAmount).equal(CourtOfferedInstalmentHelper.getCourtOfferedInstalmentAmount(paymentPlanConvertedToDefendantFrequencyBelowThresholdAmount, defendantMonthlyPaymentPlan))
    })
    it('should return correct court instalment amount because instalment amount is below threshold', () => {
      expect(paymentPlanConvertedToDefendantFrequencyBelowThresholdAmount.instalmentAmount).equal(CourtOfferedInstalmentHelper.getCourtOfferedInstalmentAmount(paymentPlanConvertedToDefendantFrequencyBelowThresholdAmount, defendantMonthlyPaymentPlan))
    })
  })

})
