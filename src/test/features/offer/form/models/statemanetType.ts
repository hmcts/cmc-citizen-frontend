import { expect } from 'chai'
import { StatementType } from 'offer/form/models/statementType'

describe('StatementType', () => {

  describe('valueOf', () => {

    it('should return StatementType for valid strings', () => {
      expect(StatementType.valueOf(StatementType.ACCEPTATION.value)).to.be.equal(StatementType.ACCEPTATION)
      expect(StatementType.valueOf(StatementType.REJECTION.value)).to.be.equal(StatementType.REJECTION)
      expect(StatementType.valueOf(StatementType.OFFER.value)).to.be.equal(StatementType.OFFER)
    })

    it('should return undefined for invalid string', () => {
      expect(StatementType.valueOf('Unknown type!!!')).to.be.equal(undefined)
    })
  })
})
