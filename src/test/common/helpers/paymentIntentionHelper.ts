import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { DecisionType } from 'common/court-calculations/decisionType'
import { PaymentOptionPage } from 'claimant-response/routes/payment-option'
import { expect } from 'chai'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentOption as ClaimPaymentOption } from 'claims/models/paymentOption'
import { PaymentOption, PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { PaymentDatePage } from 'claimant-response/routes/payment-date'
import { PaymentPlanPage } from 'claimant-response/routes/payment-plan'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

describe('PaymentIntentionHelper', () => {
  let claimWithDefendantInstalmentsResponse: Claim
  let claimWithDefendantPayBySetDateResponse: Claim
  let draftClaimantResponseImmediately: DraftClaimantResponse
  let draftClaimantResponsePayBySetDate: DraftClaimantResponse
  let draftClaimantResponseInstalments: DraftClaimantResponse

  beforeEach(() => {
    claimWithDefendantInstalmentsResponse = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
    claimWithDefendantPayBySetDateResponse = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj })
    draftClaimantResponseImmediately = new DraftClaimantResponse().deserialize({
      alternatePaymentMethod: {
        paymentOption: new PaymentOption(PaymentType.IMMEDIATELY)
      },
      courtDetermination: { disposableIncome: 100 }
    })

    draftClaimantResponsePayBySetDate = new DraftClaimantResponse().deserialize({
      alternatePaymentMethod: {
        paymentOption: new PaymentOption(PaymentType.BY_SET_DATE),
        paymentDate: {
          date: {
            year: 2050,
            month: 12,
            day: 31
          }
        }
      },
      courtDetermination: { disposableIncome: 100 }
    })

    draftClaimantResponseInstalments = new DraftClaimantResponse().deserialize({
      alternatePaymentMethod: {
        paymentOption: new PaymentOption(PaymentType.INSTALMENTS),
        paymentPlan: {
          totalAmount: 1060,
          instalmentAmount: 100,
          paymentSchedule: {
            value: PaymentSchedule.EVERY_MONTH
          },
          firstPaymentDate: {
            year: 2018,
            month: 12,
            day: 31
          },
          completionDate: {
            year: 2019,
            month: 12,
            day: 30
          },
          paymentLength: ''
        }
      },
      courtDetermination: { disposableIncome: 100 }
    })
  })

  context('getDefendantPaymentIntention', () => {
    it('should return correct instance of PaymentIntention', () => {
      expect(PaymentOptionPage.generateCourtCalculatedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse)).to.be.instanceOf(PaymentIntention)
      expect(PaymentDatePage.generateCourtCalculatedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse)).to.be.instanceOf(PaymentIntention)
      expect(PaymentPlanPage.generateCourtCalculatedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse)).to.be.instanceOf(PaymentIntention)
    })

    it('should return payment intention with Defendants Payment Option', () => {
      expect(PaymentOptionPage.generateCourtCalculatedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse).paymentOption).to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
      expect(PaymentDatePage.generateCourtCalculatedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse).paymentOption).to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
      expect(PaymentPlanPage.generateCourtCalculatedPaymentIntention(draftClaimantResponseInstalments, claimWithDefendantInstalmentsResponse).paymentOption).to.be.equal(ClaimPaymentOption.INSTALMENTS)
    })
  })

  context('generateCourtOfferedPaymentIntention', () => {
    it('should return correct instance of PaymentIntention', () => {
      expect(PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse, DecisionType.DEFENDANT)).to.be.instanceOf(PaymentIntention)
      expect(PaymentDatePage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse, DecisionType.DEFENDANT)).to.be.instanceOf(PaymentIntention)
      expect(PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse, DecisionType.DEFENDANT)).to.be.instanceOf(PaymentIntention)
    })

    it('should return payment intention with Defendants Payment Option', () => {
      expect(PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse, DecisionType.DEFENDANT).paymentOption).to.be.equal(ClaimPaymentOption.INSTALMENTS)
      expect(PaymentDatePage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse, DecisionType.DEFENDANT).paymentOption).to.be.equal(ClaimPaymentOption.INSTALMENTS)
      expect(PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse, DecisionType.DEFENDANT).paymentOption).to.be.equal(ClaimPaymentOption.INSTALMENTS)
    })

    it('should return payment intention with Claimants Payment Option', () => {
      expect(PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse, DecisionType.CLAIMANT).paymentOption).to.be.equal(ClaimPaymentOption.IMMEDIATELY)
      expect(PaymentDatePage.generateCourtOfferedPaymentIntention(draftClaimantResponsePayBySetDate, claimWithDefendantInstalmentsResponse, DecisionType.CLAIMANT).paymentOption).to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
      expect(PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseInstalments, claimWithDefendantInstalmentsResponse, DecisionType.CLAIMANT).paymentOption).to.be.equal(ClaimPaymentOption.INSTALMENTS)
    })

    it('should return payment intention with claimants instalments payment frequency converted to defendants payment frequency', () => {
      expect(PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseInstalments, claimWithDefendantInstalmentsResponse, DecisionType.COURT).repaymentPlan.paymentSchedule).to.be.equal(PaymentSchedule.EACH_WEEK)
      expect(PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseInstalments, claimWithDefendantInstalmentsResponse, DecisionType.COURT).repaymentPlan.paymentSchedule).to.be.equal(PaymentSchedule.EACH_WEEK)
    })

    it('should return payment intention with monthly instalments when claimant asks to pay immediately', () => {
      expect(PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseInstalments, claimWithDefendantPayBySetDateResponse, DecisionType.COURT).repaymentPlan.paymentSchedule).to.be.equal(PaymentSchedule.EVERY_MONTH)
    })
  })

  context('getCourtDecision', () => {
    it('should return court Decision as COURT', () => {
      expect(PaymentOptionPage.getCourtDecision(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse)).to.be.equal(DecisionType.COURT)
    })
  })
})
