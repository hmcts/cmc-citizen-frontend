import { expect } from 'chai'
import { FormaliseRepaymentPlanOptionFilter } from 'claimant-response/filters/renderFormaliseRepaymentPlanOption'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'

describe('Formalise repayment plan option filter', () => {
  FormaliseRepaymentPlanOption.all()
    .forEach(type => {
      it(`should map '${type.value}' to '${type.displayValue}'`, () => {
        expect(FormaliseRepaymentPlanOptionFilter.render(type)).to.equal(type.displayValue)
      })
    })

  it('should throw an error for null', () => {
    expect(() => FormaliseRepaymentPlanOptionFilter.render(null)).to.throw(Error)
  })
})
