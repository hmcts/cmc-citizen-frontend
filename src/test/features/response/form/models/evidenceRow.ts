import { expect } from 'chai'

import { Validator } from 'class-validator'
import { expectValidationError, generateString } from '../../../../app/forms/models/validationUtils'
import { EvidenceRow, ValidationConstants, ValidationErrors } from 'response/form/models/evidenceRow'
import { EvidenceType } from 'response/form/models/evidenceType'

describe('EvidenceRow', () => {

  describe('empty', () => {

    it('should return empty instances of EvidenceRow', () => {

      const actual: EvidenceRow = EvidenceRow.empty()

      expect(actual).instanceof(EvidenceRow)
      expect(actual.type).to.eq(undefined)
      expect(actual.description).to.eq(undefined)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should accept', () => {

      it('when both are valid strings', () => {
        const errors = validator.validateSync(new EvidenceRow(EvidenceType.OTHER, 'description'))

        expect(errors.length).to.equal(0)
      })

      it('when valid type given and undefined description', () => {
        const errors = validator.validateSync(new EvidenceRow(EvidenceType.OTHER, undefined))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject', () => {

      it('when description is too long', () => {
        const errors = validator.validateSync(
          new EvidenceRow(EvidenceType.OTHER, generateString(ValidationConstants.DESCRIPTION_MAX_LENGTH + 1))
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DESCRIPTION_TOO_LONG)
      })
    })
  })
})
