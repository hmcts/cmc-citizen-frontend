import { expect } from 'chai'
import { ValidationError } from '@hmcts/class-validator'
import { Converter, Form, FormValidationError } from 'forms/form'

import { expectPropertyValidationError } from 'test/app/forms/models/validationUtils'

function newValidationError (property: string, constraints: { [type: string]: string }, childern?: ValidationError[]): ValidationError {
  const instance: ValidationError = new ValidationError()
  instance.property = property
  instance.constraints = constraints
  instance.children = childern
  return instance
}

const validationError: ValidationError = newValidationError('address[city]', {
  'IsNotEmpty': 'City must be empty'
})

describe('Form', () => {
  describe('Converter', () => {
    it('should convert simple form field to object property', () => {
      expect(Converter.asProperty('address[city]')).to.equal('address.city')
    })

    it('should convert simple object property to form field', () => {
      expect(Converter.asFieldName('address.city')).to.equal('address[city]')
    })

    it('should convert nested form field to object property', () => {
      expect(Converter.asProperty('claimant[address][city]')).to.equal('claimant.address.city')
    })

    it('should convert nested object property to form field', () => {
      expect(Converter.asFieldName('claimant.address.city')).to.equal('claimant[address][city]')
    })
  })

  describe('FormValidationError', () => {
    it('should have all properties of ValidationError', () => {
      const formValidationError = new FormValidationError(validationError)
      expect(formValidationError.value).to.equal(validationError.value)
      expect(formValidationError.property).to.equal(validationError.property)
      expect(formValidationError.constraints).to.equal(validationError.constraints)
    })

    it('should have form field name populated', () => {
      const formValidationError = new FormValidationError(validationError)
      expect(formValidationError.fieldName).to.equal('address[city]')
    })

    it('should have message populated', () => {
      const formValidationError = new FormValidationError(validationError)
      expect(formValidationError.message).to.equal('City must be empty')
    })

    describe('new instance creation', () => {
      it('should flatten nested validation errors into single errors array', () => {
        const simpleError = newValidationError('amount', {
          'IsDefined': 'Total amount is required'
        })

        const nestedError = newValidationError('rows', {}, [
          newValidationError('0', {}, [
            newValidationError('reason', {
              'IsDefined': 'Reason is required'
            })
          ]),
          newValidationError('1', {}, [
            newValidationError('amount', {
              'IsDefined': 'Amount is required'
            })
          ])
        ])

        const form: Form<any> = new Form(null, [simpleError, nestedError])
        expect(form.errors.length).to.equal(3)
        expectPropertyValidationError(form.errors, 'amount', 'Total amount is required')
        expectPropertyValidationError(form.errors, 'rows.0.reason', 'Reason is required')
        expectPropertyValidationError(form.errors, 'rows.1.amount', 'Amount is required')
      })
    })

    it('should be invalid when at least one error is in the errors array', () => {
      const form: Form<any> = new Form(null, [validationError])
      expect(form.hasErrors()).to.equal(true)
    })

    it('should be valid when there is not errors in the errors array', () => {
      const form: Form<any> = new Form(null, [])
      expect(form.hasErrors()).to.equal(false)
    })

    it('should return error message if error associated with given field exists', () => {
      const form: Form<any> = new Form(null, [validationError])
      expect(form.errorFor('address[city]')).to.equal('City must be empty')
    })

    it('should return undefined if error associated with given field does not exist', () => {
      const form: Form<any> = new Form(null, [])
      expect(form.errorFor('address[city]')).to.equal(undefined)
    })

    it('should return value if value associated with given field exists', () => {
      const form: Form<any> = new Form({ address: { city: 'London' } })
      expect(form.valueFor('address[city]')).to.equal('London')
    })

    it('should return raw value from request body', () => {
      const form: Form<any> = new Form({ amount: '1,45' }, [], { amount: '1,45' })
      expect(form.rawDataFor('amount')).to.equal('1,45')
    })

    it('should return undefined if value associated with given field does not exist', () => {
      const form: Form<any> = new Form({})
      expect(form.valueFor('address[city]')).to.equal(undefined)
    })
  })
})
