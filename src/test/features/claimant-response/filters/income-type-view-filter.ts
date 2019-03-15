import { expect } from 'chai'
import { IncomeTypeViewFilter } from 'claimant-response/filters/income-type-view-filter'
import { MonthlyIncomeType } from 'response/form/models/statement-of-means/monthlyIncomeType'

describe('Income type view filter', () => {
  MonthlyIncomeType.all()
    .forEach(type => {
      it(`should map '${type.value}' to '${type.displayValue}'`, () => {
        expect(IncomeTypeViewFilter.render(type.value)).to.equal(type.displayValue)
      })
    })

  it('should throw an error for anything else', () => {
    expect(() => IncomeTypeViewFilter.render('BANK_ROBBERY')).to.throw(TypeError)
  })

  it('should throw an error for null', () => {
    expect(() => IncomeTypeViewFilter.render(null)).to.throw(TypeError)
  })
})
