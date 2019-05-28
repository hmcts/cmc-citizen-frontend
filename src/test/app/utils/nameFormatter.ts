import { expect } from 'chai'

import { NameFormatter } from 'utils/nameFormatter'

describe('NameFormatter', () => {

  describe('fullName', () => {
    it('should format name from title, first and last name', () => {
      expect(NameFormatter.fullName('Coffee', 'McCoffee', 'Mr.')).to.eq('Mr. Coffee McCoffee')
    })

    it('should format name first and last name and no title', () => {
      expect(NameFormatter.fullName('Coffee', 'McCoffee', undefined)).to.eq('Coffee McCoffee')
      expect(NameFormatter.fullName('Coffee', 'McCoffee', '')).to.eq('Coffee McCoffee')
      expect(NameFormatter.fullName('Coffee', 'McCoffee', ' ')).to.eq('Coffee McCoffee')
      expect(NameFormatter.fullName('Coffee', 'McCoffee')).to.eq('Coffee McCoffee')
    })
  })
})
