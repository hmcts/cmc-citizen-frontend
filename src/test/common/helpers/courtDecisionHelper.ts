import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'
import { Claim } from 'claims/models/claim'
import * as claimStoreServiceMock from '../../http-mocks/claim-store'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { expect } from 'chai'
import { DecisionType } from 'common/court-calculations/courtDecision'
import { PaymentOption, PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { sampleClaimantResponseDraftObj } from '../../http-mocks/draft-store'

describe('CourtDecisionHelper', () => {
  let claim: Claim
  let draft: DraftClaimantResponse

  it('should create COURT decision', () => {
    claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
    draft = new DraftClaimantResponse().deserialize({ alternatePaymentMethod: {
      paymentOption: new PaymentOption(PaymentType.IMMEDIATELY)
    } })
    expect(CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(DecisionType.COURT)
  })

  it('should create CLAIMANT decision', () => {
    claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
    draft = new DraftClaimantResponse().deserialize(sampleClaimantResponseDraftObj)
    expect(CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(DecisionType.CLAIMANT)
  })

  it('should create CLAIMANT_IN_FAVOUR_OF_DEFENDANT decision', () => {
    claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj,
      ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithReasonablePaymentSchedule })
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
          }
        }
      }
    })
    expect(CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT)
  })

  it('should create DEFENDANT decision', () => {
    claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj,
      ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithReasonablePaymentSchedule })
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
      }
    })
    expect(CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(DecisionType.DEFENDANT)
  })
})
