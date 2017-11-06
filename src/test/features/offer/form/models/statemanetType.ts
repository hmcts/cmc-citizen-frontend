import { expect } from 'chai'
import { StatementType } from 'offer/form/models/statementType'

describe('StatementType', () => {

  describe('valueOf', () => {

    it('should return StatementType for valid input', () => {
      expect(StatementType.valueOf(StatementType.ACCEPTATION.value)).to.be.equal(StatementType.ACCEPTATION)
    })

    it('should return undefined for invalid string', () => {
      expect(StatementType.valueOf('Unknown type!!!')).to.be.equal(undefined)
    })
  })
})
