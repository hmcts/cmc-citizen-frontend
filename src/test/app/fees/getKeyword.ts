import { expect } from 'chai'

import { FeesClient } from 'fees/feesClient'

describe('getKeyword', () => {

  it('should return correct keyword for hearing type and an amount in the middle of the range', () => {
    expect(FeesClient.getKeyword('hearing')).to.eq('HearingSmallClaims')
  })

  it('should return correct keyword for issue type and amount in the middle of the range', () => {
    expect(FeesClient.getKeyword('issue')).to.eq('MoneyClaim')
  })

  it('should throw an error if invalid event passed', () => {
    expect(() => FeesClient.getKeyword('invalid event')).to.throw(Error)
  })
})
