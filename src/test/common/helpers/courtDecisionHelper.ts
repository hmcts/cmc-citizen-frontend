import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'
import { Claim } from 'claims/models/claim'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { expect } from 'chai'
import { DecisionType } from 'common/court-calculations/decisionType'
import { PaymentOption, PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { sampleClaimantResponseDraftObj } from 'test/http-mocks/draft-store'
import { MomentFactory } from 'shared/momentFactory'

describe('CourtDecisionHelper', () => {
  let claim: Claim
  let draft: DraftClaimantResponse

  it('should create COURT decision when court calculated payment intention is most reasonable', () => {
    claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
    draft = new DraftClaimantResponse().deserialize({
      alternatePaymentMethod: {
        paymentOption: new PaymentOption(PaymentType.IMMEDIATELY)
      },
      courtDetermination: { disposableIncome: 100 }
    })
    expect(CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(DecisionType.COURT)
  })

  it('should create CLAIMANT decision when claimant payment intention is most reasonable', () => {
    claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
    draft = new DraftClaimantResponse().deserialize({ ...sampleClaimantResponseDraftObj, courtDetermination: { disposableIncome: 100 } })
    expect(CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(DecisionType.CLAIMANT)
  })

  it('should create CLAIMANT_IN_FAVOUR_OF_DEFENDANT decision when claimant is more lenient than defendant', () => {
    claim = new Claim().deserialize({
      ...claimStoreServiceMock.sampleClaimObj,
      ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithReasonablePaymentSchedule
    })
    draft = new DraftClaimantResponse().deserialize({
      alternatePaymentMethod: {
        paymentOption: {
          option: {
            value: 'INSTALMENTS',
            displayValue: 'By instalments'
          }
        },
        paymentPlan: {
          totalAmount: 3326.59,
          instalmentAmount: 1000,
          firstPaymentDate: {
            year: MomentFactory.currentDate().add(82,'days').format('YYYY'),
            month: MomentFactory.currentDate().add(82,'days').format('M'),
            day: MomentFactory.currentDate().add(82,'days').format('D')
          },
          paymentSchedule: {
            value: 'EACH_WEEK',
            displayValue: 'Each week'
          }
        }
      },
      courtDetermination: { disposableIncome: 100 }
    })
    expect(CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT)
  })

  it('should create DEFENDANT decision when defendant payment intention is most reasonable with pay by set date', () => {
    claim = new Claim().deserialize({
      ...claimStoreServiceMock.sampleClaimObj,
      ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithReasonablePaymentSchedule
    })
    draft = new DraftClaimantResponse().deserialize({
      alternatePaymentMethod: {
        paymentOption: {
          option: {
            value: PaymentType.BY_SET_DATE.value
          }
        },
        paymentDate: {
          date: {
            year: 2018,
            month: 1,
            day: 1
          }
        }
      },
      courtDetermination: { disposableIncome: 0 }
    })
    expect(CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(DecisionType.DEFENDANT)
  })

  it('should create DEFENDANT decision when defendant payment intention is most reasonable with pay by instalments', () => {
    claim = new Claim().deserialize({
      ...claimStoreServiceMock.sampleClaimObj,
      ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithNoDisposableIncome
    })
    draft = new DraftClaimantResponse().deserialize({
      alternatePaymentMethod: {
        paymentOption: {
          option: {
            value: 'INSTALMENTS',
            displayValue: 'By instalments'
          }
        },
        paymentPlan: {
          totalAmount: 3326.59,
          instalmentAmount: 1000,
          firstPaymentDate: {
            year: 2019,
            month: 1,
            day: 1
          },
          paymentSchedule: {
            value: 'EACH_WEEK',
            displayValue: 'Each week'
          },
          completionDate: '2019-10-01',
          paymentLength: '1'
        }
      },
      courtDetermination: { disposableIncome: 0 }
    })
    expect(CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(DecisionType.DEFENDANT)
  })
})
