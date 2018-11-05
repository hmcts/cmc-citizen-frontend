import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { DecisionType } from 'common/court-calculations/courtDecision'
import { PaymentOptionPage } from 'claimant-response/routes/payment-option'
import { expect } from 'chai'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentOption as ClaimPaymentOption } from 'claims/models/paymentOption'
import { PaymentOption, PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { PaymentDatePage } from 'claimant-response/routes/payment-date'
import { PaymentPlanPage } from 'claimant-response/routes/payment-plan'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

describe('PaymentIntentionHelper', () => {
  let claim: Claim
  let draftClaimantResponseImmediately: DraftClaimantResponse
  let draftClaimantResponsePayBySetDate: DraftClaimantResponse
  let draftClaimantResponseInstalments: DraftClaimantResponse

  beforeEach(() => {
    claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
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
      expect(PaymentOptionPage.generateCourtCalculatedPaymentIntention(draftClaimantResponseImmediately, claim, DecisionType.DEFENDANT)).to.be.instanceOf(PaymentIntention)
      expect(PaymentDatePage.generateCourtCalculatedPaymentIntention(draftClaimantResponseImmediately, claim, DecisionType.DEFENDANT)).to.be.instanceOf(PaymentIntention)
      expect(PaymentPlanPage.generateCourtCalculatedPaymentIntention(draftClaimantResponseImmediately, claim, DecisionType.DEFENDANT)).to.be.instanceOf(PaymentIntention)
    })

    it('should return payment intention with Defendants Payment Option', () => {
      expect(PaymentOptionPage.generateCourtCalculatedPaymentIntention(draftClaimantResponseImmediately, claim, DecisionType.DEFENDANT).paymentOption).to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
      expect(PaymentDatePage.generateCourtCalculatedPaymentIntention(draftClaimantResponseImmediately, claim, DecisionType.DEFENDANT).paymentOption).to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
      expect(PaymentPlanPage.generateCourtCalculatedPaymentIntention(draftClaimantResponseInstalments, claim, DecisionType.DEFENDANT).paymentOption).to.be.equal(ClaimPaymentOption.INSTALMENTS)
    })
  })

  context('generateCourtOfferedPaymentIntention', () => {
    it('should return correct instance of PaymentIntention', () => {
      expect(PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claim, DecisionType.DEFENDANT)).to.be.instanceOf(PaymentIntention)
      expect(PaymentDatePage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claim, DecisionType.DEFENDANT)).to.be.instanceOf(PaymentIntention)
      expect(PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claim, DecisionType.DEFENDANT)).to.be.instanceOf(PaymentIntention)
    })

    it('should return payment intention with Defendants Payment Option', () => {
      expect(PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claim, DecisionType.DEFENDANT).paymentOption).to.be.equal(ClaimPaymentOption.INSTALMENTS)
      expect(PaymentDatePage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claim, DecisionType.DEFENDANT).paymentOption).to.be.equal(ClaimPaymentOption.INSTALMENTS)
      expect(PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claim, DecisionType.DEFENDANT).paymentOption).to.be.equal(ClaimPaymentOption.INSTALMENTS)
    })

    it('should return payment intention with Claimants Payment Option', () => {
      expect(PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claim, DecisionType.CLAIMANT).paymentOption).to.be.equal(ClaimPaymentOption.IMMEDIATELY)
      expect(PaymentDatePage.generateCourtOfferedPaymentIntention(draftClaimantResponsePayBySetDate, claim, DecisionType.CLAIMANT).paymentOption).to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
      expect(PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseInstalments, claim, DecisionType.CLAIMANT).paymentOption).to.be.equal(ClaimPaymentOption.INSTALMENTS)
    })
  })

  context('getCourtDecision', () => {
    it('should return court Decision as COURT', () => {
      expect(PaymentOptionPage.getCourtDecision(draftClaimantResponseImmediately, claim)).to.be.equal(DecisionType.COURT)
    })
  })
})
