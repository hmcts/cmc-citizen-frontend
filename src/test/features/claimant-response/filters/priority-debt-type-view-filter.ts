import { expect } from 'chai'
import { PriorityDebtTypeViewFilter } from 'claimant-response/filters/priority-debts-type-view-filter'
import { PriorityDebtType } from 'response/form/models/statement-of-means/priorityDebtType'

describe('Priority debt type view filter', () => {
  PriorityDebtType.all()
    .forEach(type => {
      it(`should map '${type.value}' to '${type.displayValue}'`, () => {
        expect(PriorityDebtTypeViewFilter.render(type.value)).to.equal(type.displayValue)
      })
    })

  it('should throw an error for anything else', () => {
    expect(() => PriorityDebtTypeViewFilter.render('SHARK_LOAN')).to.throw(Error)
  })

  it('should throw an error for null', () => {
    expect(() => PriorityDebtTypeViewFilter.render(null)).to.throw('Must be a valid priority debt type')
  })
})
