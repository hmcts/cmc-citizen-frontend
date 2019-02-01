import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'
import { EvidenceRow } from 'forms/models/evidenceRow'
import { EvidenceType } from 'forms/models/evidenceType'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

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
          new EvidenceRow(EvidenceType.OTHER, generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1))
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.TEXT_TOO_LONG)
      })
    })
  })
})
