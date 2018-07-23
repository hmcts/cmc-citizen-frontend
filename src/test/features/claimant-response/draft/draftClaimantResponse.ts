import { expect } from 'chai'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { FormaliseRepaymentPlan } from 'features/claimant-response/form/models/formaliseRepaymentPlan'
import { FormaliseRepaymentPlanOption } from 'features/claimant-response/form/models/formaliseRepaymentPlanOption'
import { SettlementAgreement } from 'claimant-response/form/models/settlementAgreement'

describe('DraftClaimantResponse', () => {
  describe('deserialization', () => {

    it('should return a DraftClaimantResponse instance initialised with defaults for undefined', () => {
      expect(new DraftClaimantResponse().deserialize(undefined)).to.eql(new DraftClaimantResponse())
    })

    it('should return a DraftClaimantResponse instance initialised with defaults for null', () => {
      expect(new DraftClaimantResponse().deserialize(null)).to.eql(new DraftClaimantResponse())
    })

    it('should return a DraftClaimantResponse instance initialised with valid data', () => {
      const givenExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
      const givenFormaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT) 
      const givenSettlementAgreement = new SettlementAgreement(true) 
      const input = { 
        externalId: givenExternalId,
        formaliseRepaymentPlan:  givenFormaliseRepaymentPlan,
        settlementAgreement: givenSettlementAgreement
      }
      const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize( input)
      expect(draft.externalId).to.eql(givenExternalId)
      expect(draft.formaliseRepaymentPlan).to.eql(givenFormaliseRepaymentPlan)
      expect(draft.settlementAgreement).to.eql(givenSettlementAgreement)
    })
  })
})
