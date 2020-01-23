import { expect } from 'chai'

import { MonthlyIncomeType } from 'response/form/models/statement-of-means/monthlyIncomeType'

describe('MonthlyIncomeType', () => {

  describe('all', () => {

    it('should return an array', () => {
      const actual: MonthlyIncomeType[] = MonthlyIncomeType.all()

      expect(actual).instanceof(Array)
      expect(actual.length).to.eq(11)
    })
  })

  describe('valueOf', () => {

    it('should return undefined when undefined given', () => {

      const actual: MonthlyIncomeType = MonthlyIncomeType.valueOf(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return undefined when unknown type given', () => {

      const actual: MonthlyIncomeType = MonthlyIncomeType.valueOf('I do not know this type!')

      expect(actual).to.be.eq(undefined)
    })

    MonthlyIncomeType.all().forEach(type => {
      it(`should return valid object for ${type.value}`, () => {

        const actual: MonthlyIncomeType = MonthlyIncomeType.valueOf(type.value)

        expect(actual).to.be.equal(type)
      })
    })
  })
})
