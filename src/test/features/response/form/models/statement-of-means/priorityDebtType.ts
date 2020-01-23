import { PriorityDebtType } from 'response/form/models/statement-of-means/priorityDebtType'
import { expect } from 'chai'

describe('PriorityDebtType', () => {
  describe('all', () => {
    it('should return an array with all PriorityDebtTypes', () => {
      const actual: PriorityDebtType[] = PriorityDebtType.all()

      expect(actual).instanceof(Array)
      expect(actual.length).to.be.equal(7)
    })
  })

  describe('value of', () => {
    it('should return undefined when given undefined', () => {
      expect(PriorityDebtType.valueOf(undefined)).to.be.equal(undefined)
    })

    it('should return undefined when given unknown type', () => {
      expect(PriorityDebtType.valueOf('unknown type test')).to.be.equal(undefined)
    })

    PriorityDebtType.all().forEach(type => {
      it(`should return a valid PriorityDebtType for ${type.value}`, () => {
        const actual: PriorityDebtType = PriorityDebtType.valueOf(type.value)
        expect(actual.value).to.be.equal(type.value)
      })
    })
  })
})
