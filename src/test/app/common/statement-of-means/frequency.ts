import { expect } from 'chai'
import { Frequency } from 'common/statement-of-means/frequency'

describe('Frequency', () => {
  describe('of', () => {
    it('should return valid object for valid input', () => {
      const frequency: Frequency = Frequency.of(Frequency.WEEKLY.value)

      expect(frequency instanceof Frequency).to.equal(true)
      expect(frequency.value).to.equal(Frequency.WEEKLY.value)
      expect(frequency.monthlyRatio).to.equal(Frequency.WEEKLY.monthlyRatio)
    })

    it('should throw exception for invalid input', () => {
      try {
        Frequency.of('unknown')
      } catch (e) {
        expect(e.message).to.equal(`There is no Frequency: 'unknown'`)
      }
    })
  })
})
