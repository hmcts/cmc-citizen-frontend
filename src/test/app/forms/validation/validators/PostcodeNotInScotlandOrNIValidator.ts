import { expect } from 'chai'
import { PostcodeNotInScotlandOrNIValidator } from 'forms/validation/validators/postCodeNotInScotlandOrNI'

describe('PostcodeNotInScotlandOrNIValidator', () => {
  const validator = new PostcodeNotInScotlandOrNIValidator()

  describe('validate', () => {
    it('should return true for a valid postcode in England', () => {
      const result = validator.validate('SW1H 9AJ', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in England starts with TD', () => {
      const result = validator.validate('TD9 9WX', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in England starts with TD', () => {
      const result = validator.validate('TD9 0TS', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in England starts with TD', () => {
      const result = validator.validate('TD12 4TJ', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in England starts with TD', () => {
      const result = validator.validate('TD15 2PA', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in England starts with TD', () => {
      const result = validator.validate('TD15 1BN', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in England starts with TD', () => {
      const result = validator.validate('TD15 1SY', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in England starts with TD', () => {
      const result = validator.validate('TD15 1UB', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in England starts with TD', () => {
      const result = validator.validate('TD15 1BN', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in England starts with TD', () => {
      const result = validator.validate('TD5 8AR', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in England starts with DG', () => {
      const result = validator.validate('DG16 5HZ', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in England starts with GU', () => {
      const result = validator.validate('GU5 0DY', null)
      expect(result).to.be.true
    })
    it('should return true for a valid postcode in England starts with GL', () => {
      const result = validator.validate('GL19 3BE', null)
      expect(result).to.be.true
    })
    it('should return false for a valid postcode in Glasgow', () => {
      const result = validator.validate('G40 4LA', null)
      expect(result).to.be.false
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
    it('should return false for a valid postcode in Scotland starts with TD', () => {
      const result = validator.validate('TD1 1AA', null)
      expect(result).to.be.false
    })
    it('should return false for a valid postcode in Scotland starts with DG', () => {
      const result = validator.validate('DG3 5EZ', null)
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
