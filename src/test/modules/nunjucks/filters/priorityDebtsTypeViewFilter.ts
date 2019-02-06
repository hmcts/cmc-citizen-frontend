import { expect } from 'chai'

import { PriorityDebtTypeViewFilter } from 'main/features/claimant-response/filters/priority-debts-type-view-filter'
import { PriorityDebtType } from 'claims/models/response/statement-of-means/priorityDebts'

describe('PriorityDebtTypeViewFilter', () => {
  it('should renders priority debt type in sentence case', () => {
    expect(PriorityDebtTypeViewFilter.render(PriorityDebtType.MORTGAGE)).to.equal('Mortgage')
  })
  context('should throws exception', () => {
    it('when undefined is provided', () => {
      expect(() => {
        PriorityDebtTypeViewFilter.render(undefined)
      }).to.throw(Error, 'Must be a valid priority debt type')
    })
  })
})
