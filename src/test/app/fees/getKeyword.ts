import { expect } from 'chai'

import { FeesClient } from 'fees/feesClient'

describe('getKeyword', () => {

  it('should return correct keyword for hearing type and an amount in the middle of the range', () => {
    expect(FeesClient.getKeyword('issue',150)).to.eq('HearingFeeUpTo300')
    expect(FeesClient.getKeyword('issue', 250)).to.eq('HearingFeeUpTo500')
    expect(FeesClient.getKeyword('issue', 500)).to.eq('HearingFeeUpTo1000')
    expect(FeesClient.getKeyword('issue', 750)).to.eq('HearingFeeUpTo1500')
    expect(FeesClient.getKeyword('issue',1500)).to.eq('HearingFeeUpTo3k')
    expect(FeesClient.getKeyword('issue',2500)).to.eq('HearingFeeAbove3k')
  })

  it('should return correct keyword for issue type and amount in the middle of the range', () => {
    expect(FeesClient.getKeyword('hearing',150)).to.eq('PaperClaimUpTo300')
    expect(FeesClient.getKeyword('hearing',250)).to.eq('PaperClaimUpTo500')
    expect(FeesClient.getKeyword('hearing',500)).to.eq('PaperClaimUpTo1000')
    expect(FeesClient.getKeyword('hearing', 750)).to.eq('PaperClaimUpTo1500')
    expect(FeesClient.getKeyword('hearing', 1500)).to.eq('PaperClaimUpTo3k')
    expect(FeesClient.getKeyword('hearing',2500)).to.eq('PaperClaimUpTo5k')
    expect(FeesClient.getKeyword('hearing',5000)).to.eq('PaperClaimUpTo10k')
    expect(FeesClient.getKeyword('hearing', 100000)).to.eq('PaperClaimUpTo200k')
    expect(FeesClient.getKeyword('hearing', 300000)).to.eq('PaperClaimAbove200k')
    expect(FeesClient.getKeyword('hearing',null)).to.eq('UnspecifiedClaim')
  })
})
