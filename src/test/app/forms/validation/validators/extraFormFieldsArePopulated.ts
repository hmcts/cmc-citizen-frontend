import { expect } from 'chai'
import { ExtraFormFieldsArePopulatedConstraint } from 'forms/validation/validators/extraFormFieldsArePopulated'
import { ValidationArguments } from 'class-validator'

function validationArgs (field1: string, field2: string): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: { field1: field1, field2: field2 },
    property: undefined,
    constraints: ['field1', 'field2']
  }
}

describe('ExtraFormFieldsArePopulatedConstraint', () => {
  const constraint: ExtraFormFieldsArePopulatedConstraint = new ExtraFormFieldsArePopulatedConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {
      it('all fields are populated', () => {
        expect(constraint.validate(undefined, validationArgs('1', '2'))).to.equal(true)
      })
    })

    describe('should return false when ', () => {
      it('first field is unpopulated', () => {
        expect(constraint.validate(undefined, validationArgs(undefined, '2'))).to.equal(false)
      })

      it('last field in unpopulated', () => {
        expect(constraint.validate(undefined, validationArgs('1', undefined))).to.equal(false)
      })

      it('all fields are unpopulated', () => {
        expect(constraint.validate(undefined, validationArgs(undefined, undefined))).to.equal(false)
      })
    })
  })
})
