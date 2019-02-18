import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { Response, ValidationErrors } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'

describe('Response', () => {

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject interest with undefined type', () => {
      const errors = validator.validateSync(new Response(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should reject interest with unrecognised type', () => {
      const errors = validator.validateSync(new Response(new ResponseType('unrecognised-type', 'adas')))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should accept interest with recognised type', () => {
      ResponseType.all().forEach(type => {
        const errors = validator.validateSync(new Response(type))

        expect(errors.length).to.equal(0)
      })
    })
  })

})
