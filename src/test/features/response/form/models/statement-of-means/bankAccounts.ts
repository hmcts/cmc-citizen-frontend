import { expect } from 'chai'
import { BankAccounts, INIT_ROW_COUNT } from 'response/form/models/statement-of-means/bankAccounts'
import { BankAccountRow } from 'response/form/models/statement-of-means/bankAccountRow'
import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'

describe('BankAccounts', () => {

  describe('on init', () => {

    it(`should create array of ${INIT_ROW_COUNT} empty instances of BankAccountRow`, () => {

      const actual: BankAccountRow[] = (new BankAccounts()).rows

      expect(actual.length).to.equal(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual)
    })
  })

  describe('fromObject', () => {

    it('should return undefined value when undefined provided', () => {
      const actual: any = BankAccounts.fromObject(undefined)

      expect(actual).to.eql(undefined)
    })

    it('should return BankAccounts with list of empty BankAccountRow[] when empty input given', () => {
      const actual: BankAccounts = BankAccounts.fromObject([])

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return BankAccounts with first element on list populated', () => {
      const actual: BankAccounts = BankAccounts.fromObject({
        rows: [
          { typeOfAccount: BankAccountType.SAVING_ACCOUNT.value, joint: true, balance: 100 }
        ]
      })

      const populatedItem: BankAccountRow = actual.rows.pop()

      expect(populatedItem.typeOfAccount).to.eq(BankAccountType.SAVING_ACCOUNT)
      expect(populatedItem.joint).to.eq(true)
      expect(populatedItem.balance).to.eq(100)

      expectAllRowsToBeEmpty(actual.rows)
    })
  })
})

function expectAllRowsToBeEmpty (rows: BankAccountRow[]) {
  rows.forEach(item => {
    expect(item).instanceof(BankAccountRow)
    expect(item.typeOfAccount).to.eq(undefined)
    expect(item.joint).to.eq(undefined)
    expect(item.balance).to.eq(undefined)
  })
}
