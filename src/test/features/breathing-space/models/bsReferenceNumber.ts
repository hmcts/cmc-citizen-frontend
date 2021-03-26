/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { BreathingSpaceReferenceNumber } from 'breathing-space/models/bsReferenceNumber'

describe('Breathing Space Reference Number', () => {
  context('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(BreathingSpaceReferenceNumber.fromObject(undefined)).to.be.undefined
    })

    it('should leave missing fields undefined', () => {
      expect(BreathingSpaceReferenceNumber.fromObject({})).to.deep.equal(new BreathingSpaceReferenceNumber())
    })
  })

  context('deserialize', () => {
    it('should return a BreathingSpaceReferenceNumber instance', () => {
      const deserialized = new BreathingSpaceReferenceNumber().deserialize({})
      expect(deserialized).to.be.instanceof(BreathingSpaceReferenceNumber)
    })

    it('should return a BreathingSpaceReferenceNumber instance with fields set to default values when given "undefined"', () => {
      const deserialized = new BreathingSpaceReferenceNumber().deserialize(undefined)
      expect(deserialized.bsNumber).to.be.undefined
    })

    it('should return a BreathingSpaceReferenceNumber instance with fields set to default values when given "null"', () => {
      const deserialized = new BreathingSpaceReferenceNumber().deserialize(null)
      expect(deserialized.bsNumber).to.be.undefined
    })

    it('should return a BreathingSpaceReferenceNumber instance with fields set when given an object with value', () => {
      const deserialized = new BreathingSpaceReferenceNumber().deserialize({ bsNumber: 'BS-1234567' })
      expect(deserialized.bsNumber).to.be.equal('BS-1234567')
    })
  })

})
