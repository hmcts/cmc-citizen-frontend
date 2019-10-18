import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { BankAccountRow } from 'response/form/models/statement-of-means/bankAccountRow'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'

describe('BankAccountRow', () => {

  describe('deserialize', () => {

    it('should return empty object for undefined', () => {
      const actual: BankAccountRow = new BankAccountRow().deserialize(undefined)

      expect(actual).instanceof(BankAccountRow)
      expect(actual.typeOfAccount).to.eq(undefined)
      expect(actual.joint).to.eq(undefined)
      expect(actual.balance).to.eq(undefined)
    })

    it('should return populated object', () => {
      const actual: BankAccountRow = new BankAccountRow().deserialize({
        typeOfAccount: BankAccountType.SAVING_ACCOUNT, joint: false, balance: 10
      })

      expect(actual).instanceof(BankAccountRow)
      expect(actual.typeOfAccount).to.eq(BankAccountType.SAVING_ACCOUNT)
      expect(actual.joint).to.eq(false)
      expect(actual.balance).to.eq(10)
    })
  })

  describe('fromObject', () => {

    it('should return undefined when undefined given', () => {
      const actual: BankAccountRow = BankAccountRow.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return populated object', () => {
      const actual: BankAccountRow = BankAccountRow.fromObject({
        typeOfAccount: BankAccountType.SAVING_ACCOUNT.value, joint: false, balance: 10
      })

      expect(actual).instanceof(BankAccountRow)
      expect(actual.typeOfAccount).to.eq(BankAccountType.SAVING_ACCOUNT)
      expect(actual.joint).to.eq(false)
      expect(actual.balance).to.eq(10)
    })
  })

  describe('empty', () => {

    it('should return empty instances of BankAccountRow', () => {

      const actual: BankAccountRow = BankAccountRow.empty()

      expect(actual).instanceof(BankAccountRow)
      expect(actual.typeOfAccount).to.eq(undefined)
      expect(actual.joint).to.eq(undefined)
      expect(actual.balance).to.eq(undefined)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should accept', () => {

      it('when all fields undefined', () => {
        const errors = validator.validateSync(new BankAccountRow(undefined, undefined, undefined))

        expect(errors.length).to.equal(0)
      })

      it('when all are valid', () => {
        const errors = validator.validateSync(new BankAccountRow(BankAccountType.SAVING_ACCOUNT, true, 10))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject', () => {

      it('when invalid balance', () => {
        const errors = validator.validateSync(new BankAccountRow(BankAccountType.SAVING_ACCOUNT, true, 10.111))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_DECIMALS)
      })
    })
  })
})
