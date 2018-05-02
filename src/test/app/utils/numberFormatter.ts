import { expect } from 'chai'
import * as numeral from 'numeral'
import 'numeral/locales/en-gb'

import { NumberFormatter } from 'utils/numberFormatter'

describe('NumberFormatter', () => {
  numeral.locale('en-gb')

  describe('formatMoney', () => {
    it('format numeric value to money', () => {
      expect(NumberFormatter.formatMoney(10.01)).to.eq('£10.01')
    })
  })
})
