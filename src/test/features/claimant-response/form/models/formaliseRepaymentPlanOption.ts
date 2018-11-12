import { expect } from 'chai'

import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'

describe('FormaliseRepaymentPlanOption', () => {

  describe('all', () => {

    it('should return an array', () => {
      const actual: FormaliseRepaymentPlanOption[] = FormaliseRepaymentPlanOption.all()

      expect(actual).instanceof(Array)
      expect(actual.length).to.eq(3)
    })
  })

  describe('valueOf', () => {

    it('should return undefined when undefined given', () => {

      const actual: FormaliseRepaymentPlanOption = FormaliseRepaymentPlanOption.valueOf(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return undefined when unknown type given', () => {

      const actual: FormaliseRepaymentPlanOption = FormaliseRepaymentPlanOption.valueOf('I do not know this option!')

      expect(actual).to.be.eq(undefined)
    })

    FormaliseRepaymentPlanOption.all().forEach(option => {
      it(`should return valid object for ${option.value}`, () => {

        const actual: FormaliseRepaymentPlanOption = FormaliseRepaymentPlanOption.valueOf(option.value)

        expect(actual).to.be.equal(option)
      })
    })
  })
})
