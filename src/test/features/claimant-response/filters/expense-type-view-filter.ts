import { expect } from 'chai'
import { MonthlyExpenseType } from 'response/form/models/statement-of-means/monthlyExpenseType'
import { ExpenseTypeViewFilter } from 'claimant-response/filters/expense-type-view-filter'

describe('Monthly expense type view filter', () => {
  MonthlyExpenseType.all()
    .forEach(type => {
      it(`should map '${type.value}' to '${type.displayValue}'`, () => {
        expect(ExpenseTypeViewFilter.render(type.value)).to.equal(type.displayValue)
      })
    })

  it('should map anything else to undefined', () => {
    expect(() => ExpenseTypeViewFilter.render('PET_TOYS')).to.throw(TypeError)
  })

  it('should map null to undefined', () => {
    expect(() => ExpenseTypeViewFilter.render(null)).to.throw(TypeError)
  })
})
