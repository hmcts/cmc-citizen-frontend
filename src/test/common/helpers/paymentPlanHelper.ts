import { Claim } from 'claims/models/claim'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { expect } from 'chai'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { MomentFactory } from 'shared/momentFactory'
import { calculateMonthIncrement } from 'common/calculate-month-increment/calculateMonthIncrement'

describe('PaymentPlanHelper', () => {
  let claim: Claim
  claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })

  context('createPaymentPlanFromDefendantFinancialStatement', () => {
    it('should return correct paymentPlan from defendants financial statement ', () => {
      expect(PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)).to.deep
        .equal(PaymentPlan.create(200,200,Frequency.WEEKLY,calculateMonthIncrement(MomentFactory.currentDate())))
    })
  })
})
