import { BankAccountType } from 'features/response/form/models/statement-of-means/bankAccountType'
import { expect } from 'chai'
import { BankAccountTypeViewFilter } from 'claimant-response/filters/bank-account-type-view-filter'

describe('Bank account type view filter', () => {
  BankAccountType.all()
    .forEach(type => {
      it(`should map '${type.value}' to '${type.displayValue}'`, () => {
        expect(BankAccountTypeViewFilter.render(type.value)).to.equal(type.displayValue)
      })
    })

  it('should map anything else to undefined', () => {
    expect(() => BankAccountTypeViewFilter.render('RIVER_BANK')).to.throw(TypeError)
  })

  it('should map null to undefined', () => {
    expect(() => BankAccountTypeViewFilter.render(null)).to.throw(TypeError)
  })
})
