import { expect } from 'chai'
import './mocks'

import FeesClient from 'fees/feesClient'

describe('FeesClient', () => {
  it('should return hearing fee', async () => {
    const amount = await FeesClient.calculateHearingFee(100)
    expect(amount).to.equal(50)
  })
  it('should return issue fee', async () => {
    const amount = await FeesClient.calculateIssueFee(33)
    expect(amount).to.equal(100)
  })
})
