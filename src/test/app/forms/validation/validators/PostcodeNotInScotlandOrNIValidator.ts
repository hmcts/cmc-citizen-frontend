import { expect } from 'chai'
import { PostcodeNotInScotlandOrNIValidator } from 'forms/validation/validators/postCodeNotInScotlandOrNI'

describe('PostcodeNotInScotlandOrNIValidator', () => {
  const validator = new PostcodeNotInScotlandOrNIValidator()

  describe('validate', () => {
    it('should return true for a valid postcode in England', () => {
      const result = validator.validate('SW1H 9AJ', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in Wales', () => {
      const result = validator.validate('CF10 3NQ', null)
      expect(result).to.be.true
    })
    it('should return false for a valid postcode in Northern Ireland', () => {
      const result = validator.validate('BT1 1AA', null)
      expect(result).to.be.false
    })
    it('should return false for a valid postcode in Scotland', () => {
      const result = validator.validate('KW1 5BA', null)
      expect(result).to.be.false
    })
    it('should return false for an invalid postcode', () => {
      const result = validator.validate('ABC123', null)
      expect(result).to.be.false
    })
    it('should return false for an empty value', () => {
      const result = validator.validate('', null)
      expect(result).to.be.false
    })
  })

  describe('defaultMessage', () => {
    it('should return the default error message', () => {
      const defaultMessage = validator.defaultMessage(null)
      expect(defaultMessage).to.equal('Postcode must be in England or Wales')
    })
  })
})
