import { expect } from 'chai'

import { MoneyConverter } from 'fees/moneyConverter'

describe('MoneyConvertor', () => {
  it('should convert fee from pennies to pounds', async () => {
    const amount = MoneyConverter.convertPenniesToPounds(2500)
    expect(amount).to.equal(25)
  })
  it('should convert fee from pounds to pennies', async () => {
    const amount = MoneyConverter.convertPoundsToPennies(33)
    expect(amount).to.equal(3300)
  })
})
