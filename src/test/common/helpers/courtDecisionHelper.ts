import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'
import { Claim } from 'claims/models/claim'
import * as claimStoreServiceMock from '../../http-mocks/claim-store'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { expect } from 'chai'
import { DecisionType } from 'common/court-calculations/courtDecision'
import { PaymentOption, PaymentType } from 'shared/components/payment-intention/model/paymentOption'

describe('CourtDecisionHelper', () => {
  let claim: Claim
  let draft: DraftClaimantResponse

  beforeEach(() => {
    claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
    draft = new DraftClaimantResponse().deserialize({ alternatePaymentMethod: {
      paymentOption: new PaymentOption(PaymentType.IMMEDIATELY)
    } })
  })

  it('should create court decision', () => {
    expect(CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(DecisionType.COURT)
  })
})
