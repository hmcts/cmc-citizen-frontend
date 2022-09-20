import { expect } from 'chai'

import { FeesClient } from 'fees/feesClient'

describe('getKeyword', () => {

  it('should return correct keyword for hearing type and an amount in the middle of the range', () => {
    expect(FeesClient.getKeyword('hearing',150)).to.eq('HearingFeeUpTo300')
    expect(FeesClient.getKeyword('hearing', 350)).to.eq('HearingFeeUpTo500')
    expect(FeesClient.getKeyword('hearing', 550)).to.eq('HearingFeeUpTo1000')
    expect(FeesClient.getKeyword('hearing', 1100)).to.eq('HearingFeeUpTo1500')
    expect(FeesClient.getKeyword('hearing',1501)).to.eq('HearingFeeUpTo3k')
    expect(FeesClient.getKeyword('hearing',3001)).to.eq('HearingFeeAbove3k')
  })

  it('should return correct keyword for issue type and amount in the middle of the range', () => {
    expect(FeesClient.getKeyword('issue',150)).to.eq('PaperClaimUpTo300')
    expect(FeesClient.getKeyword('issue',350)).to.eq('PaperClaimUpTo500')
    expect(FeesClient.getKeyword('issue',501)).to.eq('PaperClaimUpTo1000')
    expect(FeesClient.getKeyword('issue', 1001)).to.eq('PaperClaimUpTo1500')
    expect(FeesClient.getKeyword('issue', 1501)).to.eq('PaperClaimUpTo3k')
    expect(FeesClient.getKeyword('issue',4999)).to.eq('PaperClaimUpTo5k')
    expect(FeesClient.getKeyword('issue',9999)).to.eq('PaperClaimUpTo10k')
    expect(FeesClient.getKeyword('issue', 100001)).to.eq('PaperClaimUpTo200k')
    expect(FeesClient.getKeyword('issue', 300000)).to.eq('PaperClaimAbove200k')
    expect(FeesClient.getKeyword('issue',null)).to.eq('UnspecifiedClaim')
  })
})
