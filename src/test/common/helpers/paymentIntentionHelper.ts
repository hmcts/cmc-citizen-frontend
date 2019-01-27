import { expect } from 'chai'
import { Claim } from 'main/app/claims/models/claim'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { PaymentOption, PaymentType } from 'main/common/components/payment-intention/model/paymentOption'
import { PaymentOption as ClaimPaymentOption } from 'main/app/claims/models/paymentOption'
import { PaymentSchedule } from 'main/app/claims/models/response/core/paymentSchedule'
import { MomentFactory } from 'main/common/momentFactory'
import { PaymentIntentionHelper } from 'shared/helpers/paymentIntentionHelper'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { PaymentIntention } from 'shared/models/paymentIntention'

function draftClaimantResponseInstalmentsTestData (
  draftClaimantResponseInstalments: DraftClaimantResponse,
  disposableIncomeVal: number
) {
  return new DraftClaimantResponse().deserialize({
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
    courtDetermination: { disposableIncome: disposableIncomeVal }
  })
}

describe('PaymentIntentionHelper', () => {
  let claimWithDefendantInstalmentsResponse: Claim
  let claimWithDefendantPayBySetDateResponse: Claim
  let draftClaimantResponseImmediately: DraftClaimantResponse
  let draftClaimantResponsePayBySetDate: DraftClaimantResponse
  let draftClaimantResponseInstalments: DraftClaimantResponse
  let draftClaimantResponseInstalmentsWithNegativeDisposableIncome: DraftClaimantResponse

  beforeEach(() => {
    claimWithDefendantInstalmentsResponse = new Claim().deserialize(
      { ...claimStoreServiceMock.sampleClaimObj,
        ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
    claimWithDefendantPayBySetDateResponse = new Claim().deserialize(
      { ...claimStoreServiceMock.sampleClaimObj,
        ...claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj })
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

    draftClaimantResponseInstalments = draftClaimantResponseInstalmentsTestData(
      draftClaimantResponseInstalments,
      1000)

    draftClaimantResponseInstalmentsWithNegativeDisposableIncome = draftClaimantResponseInstalmentsTestData(
      draftClaimantResponseInstalments,
      -100)
  })

  context('getDefendantPaymentIntention', () => {
    it('should return correct instance of PaymentIntention', () => {
      expect(PaymentIntentionHelper.getDefendantPaymentIntention(claimWithDefendantInstalmentsResponse))
        .to.be.instanceOf(PaymentIntention)
    })

    it('should return PaymentIntention with correct defendants PaymentIntention', () => {
      expect(PaymentIntentionHelper.getDefendantPaymentIntention(claimWithDefendantInstalmentsResponse).PaymentOption)
        .to.be.equal(ClaimPaymentOption.INSTALMENTS)
      expect(PaymentIntentionHelper.getDefendantPaymentIntention(claimWithDefendantPayBySetDateResponse).PaymentOption)
        .to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
    })
  })

  context('getClaimantPaymentIntention', () => {
    it('should return correct instance of PaymentIntention', () => {
      expect(PaymentIntentionHelper.getClaimantPaymentIntention(draftClaimantResponseImmediately))
        .to.be.instanceOf(PaymentIntention)
    })

    it('should return PaymentIntention with correct claimants PaymentIntention', () => {
      expect(PaymentIntentionHelper.getClaimantPaymentIntention(draftClaimantResponseImmediately).PaymentOption)
        .to.be.equal(ClaimPaymentOption.IMMEDIATELY)
      expect(PaymentIntentionHelper.getClaimantPaymentIntention(draftClaimantResponsePayBySetDate).PaymentOption)
        .to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
      expect(PaymentIntentionHelper.getClaimantPaymentIntention(draftClaimantResponseInstalments).PaymentOption)
        .to.be.equal(ClaimPaymentOption.INSTALMENTS)
    })
  })

  context('getCourtCalculatedPaymentIntention', () => {
    it('should return correct instance of PaymentIntention', () => {
      expect(PaymentIntentionHelper.getCourtCalculatedPaymentIntention(
        draftClaimantResponseImmediately,
        claimWithDefendantPayBySetDateResponse)).to.be.instanceOf(PaymentIntention)
    })

    it('should return PaymentIntention with correct court calculated PaymentIntention with ' +
      'PaymentOption as Pay By Set Date when claimant asks to Pay Immediately', () => {
      expect(PaymentIntentionHelper.getCourtCalculatedPaymentIntention(
        draftClaimantResponseImmediately,
        claimWithDefendantPayBySetDateResponse).PaymentOption).to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
    })

    it('should return PaymentIntention with correct courts calculated PaymentIntention with ' +
      'PaymentOption as Pay By Set Date when claimant asks to Pay By Set Date', () => {
      expect(PaymentIntentionHelper.getCourtCalculatedPaymentIntention(
        draftClaimantResponsePayBySetDate,
        claimWithDefendantPayBySetDateResponse).PaymentOption).to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
    })

    it('should return PaymentIntention with correct courts calculated PaymentIntention with ' +
      'PaymentOption as Pay By Set Date when claimant asks to Pay By Instalments', () => {
      expect(PaymentIntentionHelper.getCourtCalculatedPaymentIntention(
        draftClaimantResponseInstalments,
        claimWithDefendantPayBySetDateResponse).PaymentOption).to.be.equal(ClaimPaymentOption.INSTALMENTS)
    })

    it('should return PaymentIntention with correct courts calculated PaymentIntention with ' +
      'PaymentOption as Pay By Set Date when claimant asks to Pay By Instalments and when ' +
      'defendant has no disposable income', () => {
      const paymentIntention: PaymentIntention = PaymentIntentionHelper.getCourtCalculatedPaymentIntention(
        draftClaimantResponseInstalmentsWithNegativeDisposableIncome,
        claimWithDefendantPayBySetDateResponse)
      expect(paymentIntention.PaymentOption).to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
      expect(paymentIntention.PaymentDate.toISOString()).to.be.equal(MomentFactory.maxDate().toISOString())
    })
  })
})
