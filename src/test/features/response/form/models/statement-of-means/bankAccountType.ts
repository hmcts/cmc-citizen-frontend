import { expect } from 'chai'

import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'

describe('BankAccountType', () => {

  describe('all', () => {

    it('should return an array', () => {
      const actual: BankAccountType[] = BankAccountType.all()

      expect(actual).instanceof(Array)
      expect(actual.length).to.eq(4)
    })
  })

  describe('valueOf', () => {

    it('should return undefined when undefined given', () => {

      const actual: BankAccountType = BankAccountType.valueOf(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return undefined when unknown type given', () => {

      const actual: BankAccountType = BankAccountType.valueOf('I do not know this type!')

      expect(actual).to.be.eq(undefined)
    })

    BankAccountType.all().forEach(type => {
      it(`should return valid object for ${type.value}`, () => {

        const actual: BankAccountType = BankAccountType.valueOf(type.value)

        expect(actual).to.be.equal(type)
      })
    })
  })
})
