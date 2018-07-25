import { expect } from 'chai'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'
import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'
import { YesNoOption } from 'models/yesNoOption'
import { SettlementAgreement } from 'claimant-response/form/models/settlementAgreement'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { SignatureType } from 'common/signatureType'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'

describe('DraftClaimantResponse', () => {
  describe('deserialization', () => {

    it('should return a DraftClaimantResponse instance initialised with defaults for undefined', () => {
      expect(new DraftClaimantResponse().deserialize(undefined)).to.eql(new DraftClaimantResponse())
    })

    it('should return a DraftClaimantResponse instance initialised with defaults for null', () => {
      expect(new DraftClaimantResponse().deserialize(null)).to.eql(new DraftClaimantResponse())
    })

    it('should return a DraftClaimantResponse instance initialised with valid data', () => {
      const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
      const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({
        externalId: myExternalId,
        settleAdmitted: {
          admitted: {
            option: 'yes'
          }
        },
        acceptPaymentMethod: {
          accept: {
            option: 'no'
          }
        },
        settlementAgreement: {
          type: SignatureType.BASIC,
          signed: true
        },
        formaliseRepaymentPlan: {
          option: FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT
        }
      })
      expect(draft.externalId).to.eql(myExternalId)
      expect(draft).to.be.instanceof(DraftClaimantResponse)
      expect(draft.acceptPaymentMethod).to.be.instanceOf(AcceptPaymentMethod)
      expect(draft.acceptPaymentMethod.accept).to.be.instanceOf(YesNoOption)
      expect(draft.acceptPaymentMethod.accept.option).to.be.equals(YesNoOption.NO.option)
      expect(draft.settleAdmitted).to.be.instanceOf(SettleAdmitted)
      expect(draft.settleAdmitted.admitted).to.be.instanceOf(YesNoOption)
      expect(draft.settleAdmitted.admitted.option).to.be.equals(YesNoOption.YES.option)
      expect(draft.settlementAgreement).to.be.instanceOf(SettlementAgreement)
      expect(draft.settlementAgreement.signed).to.be.eqls(true)
      expect(draft.settlementAgreement.type).to.be.eqls(SignatureType.BASIC)
      expect(draft.formaliseRepaymentPlan).to.be.instanceOf(FormaliseRepaymentPlan)
      expect(draft.formaliseRepaymentPlan.option).to.be.eqls(FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT)

    })
  })
})
