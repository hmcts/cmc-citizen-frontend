import { expect } from 'chai'

import MoneyConvertor from 'app/fees/moneyConvertor'

describe('MoneyConvertor', () => {
  it('should convert fee from pennies to pounds', async () => {
    const amount = MoneyConvertor.convertPenniesToPounds(2500)
    expect(amount).to.equal(25)
  })
  it('should convert fee from pounds to pennies', async () => {
    const amount = MoneyConvertor.convertPoundsToPennies(33)
    expect(amount).to.equal(3300)
  })
})
