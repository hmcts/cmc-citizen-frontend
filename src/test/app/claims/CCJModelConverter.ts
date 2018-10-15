import { expect } from 'chai'
import { CCJModelConverter } from 'claims/ccjModelConverter'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'

const ccjDraft = new DraftCCJ().deserialize({
  paymentOption: {
    option: PaymentType.IMMEDIATELY
  },
  paidAmount: {
    option: {
      value: 'no'
    },
    claimedAmount: 1060
  }
})

describe('CCJModelConverter - convert CCJDraft to CountyCourtJudgement', () => {

  it('should convert to CCJ - for a valid CCJ draft', () => {
    const draft: DraftCCJ = ccjDraft
    const countyCourtJudgment: CountyCourtJudgment = CCJModelConverter.convertForRequest(draft)
    expect(countyCourtJudgment).to.be.deep.equal(new CountyCourtJudgment(undefined, PaymentOption.IMMEDIATELY, undefined, undefined, undefined,undefined,'DEFAULT'))
  })

})
