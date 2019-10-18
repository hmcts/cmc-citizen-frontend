import { ValidationErrors } from 'forms/validation/validationErrors'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { expect } from 'chai'
import { AcceptCourtOffer } from 'claimant-response/form/models/acceptCourtOffer'
import { YesNoOption } from 'models/yesNoOption'
import { Validator } from '@hmcts/class-validator'

describe('AcceptCourtOffer', () => {

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new AcceptCourtOffer(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })
    it('should reject when invalid option', () => {
      const errors = validator.validateSync(new AcceptCourtOffer(YesNoOption.fromObject('invalid')))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should accept when recognised option', () => {
      YesNoOption.all().forEach(type => {
        const errors = validator.validateSync(new AcceptCourtOffer(type))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('fromObject should return', () => {

    it('undefined when undefined provided', () => {
      const model = AcceptCourtOffer.fromObject(undefined)

      expect(model).to.be.eq(undefined)
    })

    it('empty object when unknown value provided', () => {
      const model = AcceptCourtOffer.fromObject({ accept: 'I do not know this value!' })

      expect(model.accept).to.be.eq(undefined)
    })

    YesNoOption.all().forEach(item => {
      it(`valid object when ${item.option} provided`, () => {
        const model = AcceptCourtOffer.fromObject({ accept: item.option })

        expect(model.accept).to.be.eq(item)
      })
    })
  })

  describe('deserialize', () => {

    it('should return an instance initialised with defaults for undefined', () => {
      expect(new AcceptCourtOffer().deserialize(undefined)).to.be.eql(new AcceptCourtOffer())
    })

    YesNoOption.all().forEach(item => {
      it('should return an instance from given object', () => {
        const actual: AcceptCourtOffer = new AcceptCourtOffer().deserialize({ accept: item })

        expect(actual).to.be.eql(new AcceptCourtOffer(item))
      })
    })

  })
})
