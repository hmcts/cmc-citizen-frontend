import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'
import { INIT_ROW_COUNT } from 'forms/models/timeline'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'
import { EvidenceRow } from 'forms/models/evidenceRow'
import { EvidenceType } from 'forms/models/evidenceType'

describe('DefendantEvidence', () => {

  describe('on init', () => {

    it(`should create array of ${INIT_ROW_COUNT} empty instances of EvidenceRow`, () => {

      const actual: EvidenceRow[] = (new DefendantEvidence()).rows

      expect(actual.length).to.equal(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual)
    })
  })

  describe('fromObject', () => {

    it('should return undefined value when undefined provided', () => {
      const actual: any = DefendantEvidence.fromObject(undefined)

      expect(actual).to.eql(undefined)
    })

    it('should return DefendantTimeline with list of empty EvidenceRow[] when empty input given', () => {
      const actual: DefendantEvidence = DefendantEvidence.fromObject([])

      expectAllRowsToBeEmpty(actual.rows)
      expect(actual.comment).to.be.eq(undefined)
    })

    it('should return DefendantTimeline with first element on list populated', () => {
      const actual: DefendantEvidence = DefendantEvidence.fromObject(
        { rows: [{ type: EvidenceType.PHOTO.value, description: 'OK' }], comment: 'not ok' })

      const populatedItem: EvidenceRow = actual.rows.pop()

      expect(populatedItem.type).to.eq(EvidenceType.PHOTO)
      expect(populatedItem.description).to.eq('OK')

      expectAllRowsToBeEmpty(actual.rows)
      expect(actual.comment).to.be.eq('not ok')
    })

    it('should return object with list of EvidenceRow longer than default', () => {
      const actual: DefendantEvidence = DefendantEvidence.fromObject(
        {
          rows: [
            { type: EvidenceType.PHOTO.value, description: 'OK' },
            { type: EvidenceType.PHOTO.value, description: 'OK' },
            { type: EvidenceType.PHOTO.value, description: 'OK' },
            { type: EvidenceType.PHOTO.value, description: 'OK' },
            { type: EvidenceType.PHOTO.value, description: 'OK' },
            { type: EvidenceType.PHOTO.value, description: 'OK' }
          ], comment: 'I do not agree'
        }
      )

      expect(actual.rows.length).to.be.greaterThan(INIT_ROW_COUNT)
      expectAllRowsToBePopulated(actual.rows)
      expect(actual.comment).to.be.eq('I do not agree')
    })
  })

  describe('deserialize', () => {

    context('should return valid DefendantTimeline object with list of', () => {

      [{}, undefined].forEach(input => {
        it(`empty EvidenceRow when ${input} given`, () => {
          const actual: DefendantEvidence = new DefendantEvidence().deserialize(input)

          expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
          expectAllRowsToBeEmpty(actual.rows)
          expect(actual.comment).to.be.eq(undefined)
        })
      })

      it('should return valid DefendantTimeline object with list of empty EvidenceRow', () => {
        const actual: DefendantEvidence = new DefendantEvidence().deserialize({})

        expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
        expectAllRowsToBeEmpty(actual.rows)
        expect(actual.comment).to.be.eq(undefined)
      })

      it('should return valid DefendantTimeline object with populated first EvidenceRow', () => {
        const actual: DefendantEvidence = new DefendantEvidence().deserialize(
          { rows: [{ type: EvidenceType.PHOTO, description: 'OK' }], comment: 'fine' }
        )

        expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

        const populatedItem: EvidenceRow = actual.rows[0]

        expect(populatedItem.type).to.eq(EvidenceType.PHOTO)
        expect(populatedItem.description).to.eq('OK')

        expectAllRowsToBeEmpty(actual.rows.slice(1))
        expect(actual.comment).to.be.eq('fine')
      })
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should reject when', () => {

      it('an invalid row given', () => {
        const errors = validator.validateSync(
          new DefendantEvidence([row(EvidenceType.PHOTO, generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1))], '')
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.TEXT_TOO_LONG)
      })

      it('an invalid row given', () => {
        const errors = validator.validateSync(
          new DefendantEvidence(
            [row(EvidenceType.PHOTO, 'ok')], generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)
          )
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.TEXT_TOO_LONG)
      })
    })

    context('should accept when', () => {
      it('no rows given, no comment', () => {
        const errors = validator.validateSync(new DefendantEvidence([]))

        expect(errors.length).to.equal(0)
      })

      it('valid rows rows given and valid comment', () => {
        const errors = validator.validateSync(
          new DefendantEvidence([row(EvidenceType.PHOTO, 'ok'), row(EvidenceType.PHOTO, 'ok')], 'comment')
        )

        expect(errors.length).to.equal(0)
      })
    })

  })
})

function row (type: EvidenceType, description: string): EvidenceRow {
  return new EvidenceRow(type, description)
}

function expectAllRowsToBeEmpty (rows: EvidenceRow[]) {
  rows.forEach(item => {
    expect(item).instanceof(EvidenceRow)
    expect(item.isEmpty()).to.eq(true)
  })
}

function expectAllRowsToBePopulated (rows: EvidenceRow[]) {
  rows.forEach(item => {
    expect(item.isEmpty()).to.eq(false)
  })
}
