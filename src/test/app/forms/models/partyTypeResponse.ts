/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { PartyType } from 'common/partyType'
import { PartyTypeResponse, ValidationErrors } from 'forms/models/partyTypeResponse'

describe('PartyTypeResponse', () => {
  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(PartyTypeResponse.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(PartyTypeResponse.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(PartyTypeResponse.fromObject({})).to.deep.equal(new PartyTypeResponse())
    })

    it('should deserialize all fields', () => {
      expect(PartyTypeResponse.fromObject({
        type: PartyType.INDIVIDUAL.value
      })).to.deep.equal(new PartyTypeResponse(PartyType.INDIVIDUAL))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject undefined type', () => {
      const errors = validator.validateSync(new PartyTypeResponse(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should accept valid type', () => {
      PartyType.all().forEach(type => {
        const errors = validator.validateSync(new PartyTypeResponse(type))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
