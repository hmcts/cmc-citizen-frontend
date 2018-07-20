import { expect } from 'chai'

import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'

describe('FormaliseRepaymentPlanOption', () => {

  describe('all', () => {

    it('should return an array', () => {
      const actual: FormaliseRepaymentPlanOption[] = FormaliseRepaymentPlanOption.all()

      expect(actual).instanceof(Array)
      expect(actual.length).to.eq(2)
    })
  })

  describe('fromObject', () => {

    it('should return undefined when undefined given', () => {

      const actual: FormaliseRepaymentPlanOption = FormaliseRepaymentPlanOption.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return undefined when unknown type given', () => {

      const actual: FormaliseRepaymentPlanOption = FormaliseRepaymentPlanOption.fromObject('I do not know this!')

      expect(actual).to.be.eq(undefined)
    })

    FormaliseRepaymentPlanOption.all().forEach(option => {
      it(`should return valid object for ${option.value}`, () => {

        const actual: FormaliseRepaymentPlanOption = FormaliseRepaymentPlanOption.fromObject(option.value)

        expect(actual).to.be.equal(option)
      })
    })
  })
})
