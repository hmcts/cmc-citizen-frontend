import { expect } from 'chai'

import { FeesClient } from 'fees/feesClient'

describe('getKeyword', () => {

  it('should return correct keyword based on event type and amount', () => {
    expect(FeesClient.getKeyword('hearing',0.01)).to.eq('HearingFeeUpTo300')
    expect(FeesClient.getKeyword('issue',0.01)).to.eq('PaperClaimUpTo300')
  })
})
