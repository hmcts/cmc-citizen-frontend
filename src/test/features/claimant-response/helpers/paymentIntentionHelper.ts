import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { PaymentOption, PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { PaymentOption as ClaimPaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { PaymentIntentionHelper } from 'claimant-response/helpers/paymentIntentionHelper'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

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
      expect(PaymentIntentionHelper.getDefendantPaymentIntention(claimWithDefendantInstalmentsResponse).paymentOption)
        .to.be.equal(ClaimPaymentOption.INSTALMENTS)
      expect(PaymentIntentionHelper.getDefendantPaymentIntention(claimWithDefendantPayBySetDateResponse).paymentOption)
        .to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
    })
  })

  context('getClaimantPaymentIntention', () => {
    it('should return correct instance of PaymentIntention', () => {
      expect(PaymentIntentionHelper.getClaimantPaymentIntention(draftClaimantResponseImmediately))
        .to.be.instanceOf(PaymentIntention)
    })

    it('should return PaymentIntention with correct claimants PaymentIntention', () => {
      expect(PaymentIntentionHelper.getClaimantPaymentIntention(draftClaimantResponseImmediately).paymentOption)
        .to.be.equal(ClaimPaymentOption.IMMEDIATELY)
      expect(PaymentIntentionHelper.getClaimantPaymentIntention(draftClaimantResponsePayBySetDate).paymentOption)
        .to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
      expect(PaymentIntentionHelper.getClaimantPaymentIntention(draftClaimantResponseInstalments).paymentOption)
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
        claimWithDefendantPayBySetDateResponse).paymentOption).to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
    })

    it('should return PaymentIntention with correct courts calculated PaymentIntention with ' +
      'PaymentOption as Pay By Set Date when claimant asks to Pay By Set Date', () => {
      expect(PaymentIntentionHelper.getCourtCalculatedPaymentIntention(
        draftClaimantResponsePayBySetDate,
        claimWithDefendantPayBySetDateResponse).paymentOption).to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
    })

    it('should return PaymentIntention with correct courts calculated PaymentIntention with ' +
      'PaymentOption as Pay By Set Date when claimant asks to Pay By Instalments', () => {
      expect(PaymentIntentionHelper.getCourtCalculatedPaymentIntention(
        draftClaimantResponseInstalments,
        claimWithDefendantPayBySetDateResponse).paymentOption).to.be.equal(ClaimPaymentOption.INSTALMENTS)
    })

    it('should return PaymentIntention with correct courts calculated PaymentIntention with ' +
      'PaymentOption as Pay By Set Date when claimant asks to Pay By Instalments and when ' +
      'defendant has no disposable income', () => {
      expect(PaymentIntentionHelper.getCourtCalculatedPaymentIntention(
        draftClaimantResponseInstalmentsWithNegativeDisposableIncome,
        claimWithDefendantPayBySetDateResponse).paymentOption).to.be.equal(ClaimPaymentOption.BY_SPECIFIED_DATE)
    })
  })
})
