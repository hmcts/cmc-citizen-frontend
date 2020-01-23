import { expect } from 'chai'

import { MonthlyExpenseType } from 'response/form/models/statement-of-means/monthlyExpenseType'

describe('MonthlyExpenseType', () => {

  describe('all', () => {

    it('should return an array', () => {
      const actual: MonthlyExpenseType[] = MonthlyExpenseType.all()

      expect(actual).instanceof(Array)
      expect(actual.length).to.eq(14)
    })
  })

  describe('valueOf', () => {

    it('should return undefined when undefined given', () => {

      const actual: MonthlyExpenseType = MonthlyExpenseType.valueOf(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return undefined when unknown type given', () => {

      const actual: MonthlyExpenseType = MonthlyExpenseType.valueOf('I do not know this type!')

      expect(actual).to.be.eq(undefined)
    })

    MonthlyExpenseType.all().forEach(type => {
      it(`should return valid object for ${type.value}`, () => {

        const actual: MonthlyExpenseType = MonthlyExpenseType.valueOf(type.value)

        expect(actual).to.be.equal(type)
      })
    })
  })
})
