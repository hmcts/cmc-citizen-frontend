import { expect } from 'chai'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'
import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'
import { YesNoOption } from 'models/yesNoOption'

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
      const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({ externalId: myExternalId })
      expect(draft.externalId).to.eql(myExternalId)
    })
    it('should return a DraftClaimantResponse instance initialised with valid data', () => {
      const draft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({
        externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8',
        settleAdmitted: {
          admitted: {
            option: 'yes'
          }
        },
        acceptPaymentMethod: {
          accept: {
            option: 'no'
          }
        }
      })
      expect(draft).to.be.instanceof(DraftClaimantResponse)
      expect(draft.acceptPaymentMethod).to.be.instanceOf(AcceptPaymentMethod)
      expect(draft.acceptPaymentMethod.accept).to.be.instanceOf(YesNoOption)
      expect(draft.acceptPaymentMethod.accept.option).to.be.equals(YesNoOption.NO.option)
      expect(draft.settleAdmitted).to.be.instanceOf(SettleAdmitted)
      expect(draft.settleAdmitted.admitted).to.be.instanceOf(YesNoOption)
      expect(draft.settleAdmitted.admitted.option).to.be.equals(YesNoOption.YES.option)
    })
  })
})
