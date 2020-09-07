/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { SupportRequired, ValidationErrors } from 'directions-questionnaire/forms/models/supportRequired'

describe('SupportRequired', () => {
  describe('validation', () => {
    context('Should validate successfully when', () => {
      it('When everything is undefined', () => {
        const errors = new Validator().validateSync(new SupportRequired())
        expect(errors).to.be.empty
      })

      it('When languageSelected and languageInterpreted are set', () => {
        const errors = new Validator().validateSync(new SupportRequired(true, 'language'))
        expect(errors).to.be.empty
      })

      it('When signLanguageSelected and signLanguageInterpreted are set', () => {
        const errors = new Validator().validateSync(new SupportRequired().deserialize({
          signLanguageSelected: true,
          signLanguageInterpreted: 'language'
        }))
        expect(errors).to.be.empty
      })

      it('When otherSupportSelected and otherSupport are set', () => {
        const errors = new Validator().validateSync(new SupportRequired().deserialize({
          otherSupportSelected: true,
          otherSupport: 'otherSupport'
        }))
        expect(errors).to.be.empty
      })

      it('When everything is set', () => {
        const supportRequired: SupportRequired = new SupportRequired(true, 'language', true, 'language', true, true, true, 'other support')
        const errors = new Validator().validateSync(supportRequired)
        expect(errors).to.be.empty
      })
    })

    context('Should fail validation when', () => {
      context('When languageSelected is set to true', () => {
        it('When languageInterpreted is undefined', () => {
          const errors = new Validator().validateSync(new SupportRequired(true, undefined))
          expect(errors).to.not.be.empty
          expectValidationError(errors, ValidationErrors.NO_LANGUAGE_ENTERED)
        })

        it('When languageInterpreted is empty', () => {
          const errors = new Validator().validateSync(new SupportRequired(true, ''))
          expect(errors).to.not.be.empty
          expectValidationError(errors, ValidationErrors.NO_LANGUAGE_ENTERED)
        })
      })

      context('When signLanguageSelected is set to true', () => {
        it('When signLanguageInterpreted is undefined', () => {
          const errors = new Validator().validateSync(new SupportRequired().deserialize({
            signLanguageSelected: true,
            signLanguageInterpreted: undefined
          }))
          expect(errors).to.not.be.empty
          expectValidationError(errors, ValidationErrors.NO_SIGN_LANGUAGE_ENTERED)
        })

        it('When signLanguageInterpreted is empty', () => {
          const errors = new Validator().validateSync(new SupportRequired().deserialize({
            signLanguageSelected: true,
            signLanguageInterpreted: ''
          }))
          expect(errors).to.not.be.empty
          expectValidationError(errors, ValidationErrors.NO_SIGN_LANGUAGE_ENTERED)
        })
      })

      context('When otherSupportSelected is set to true', () => {
        it('When otherSupport is undefined', () => {
          const errors = new Validator().validateSync(new SupportRequired().deserialize({
            otherSupportSelected: true,
            otherSupport: undefined
          }))
          expect(errors).to.not.be.empty
          expectValidationError(errors, ValidationErrors.NO_OTHER_SUPPORT)
        })

        it('When otherSupport is empty', () => {
          const errors = new Validator().validateSync(new SupportRequired().deserialize({
            otherSupportSelected: true,
            otherSupport: ''
          }))
          expect(errors).to.not.be.empty
          expectValidationError(errors, ValidationErrors.NO_OTHER_SUPPORT)
        })
      })

      context('When LanguageInterpreted is not selected ', () => {
        it('When LanguageInterpreted is undefined', () => {
          const actual: SupportRequired = new SupportRequired().deserialize({
            languageSelected: undefined,
            languageInterpreted: undefined
          })
          expect(actual.languageInterpreted).to.be.eql('None')
        })

        it('When LanguageInterpreted is not selected', () => {
          const actual: SupportRequired = new SupportRequired().deserialize({
            languageSelected: false
          })
          expect(actual.languageInterpreted).to.be.eql('None')
        })
      })

      context('When SignLanguageInterpreted is not selected ', () => {
        it('When SignLanguageInterpreted is undefined', () => {
          const actual: SupportRequired = new SupportRequired().deserialize({
            signLanguageSelected: undefined,
            signLanguageInterpreted: undefined
          })
          expect(actual.signLanguageInterpreted).to.be.eql('None')
        })

        it('When SignLanguageInterpreted is not selected', () => {
          const actual: SupportRequired = new SupportRequired().deserialize({
            signLanguageSelected: false
          })
          expect(actual.signLanguageInterpreted).to.be.eql('None')
        })
      })

      context('When OtherSupport is not selected ', () => {
        it('When OtherSupport is undefined', () => {
          const actual: SupportRequired = new SupportRequired().deserialize({
            otherSupportSelected: undefined,
            otherSupport : undefined
          })
          expect(actual.otherSupport).to.be.eql('None')
        })

        it('When OtherSupport is not selected', () => {
          const actual: SupportRequired = new SupportRequired().deserialize({
            otherSupportSelected: false
          })
          expect(actual.otherSupport).to.be.eql('None')
        })
      })
    })
  })

  describe('fromObject should return', () => {

    it('undefined when undefined provided', () => {
      const model = SupportRequired.fromObject(undefined)

      expect(model).to.be.eq(undefined)
    })

    it(`valid object with valid input`, () => {
      const model = SupportRequired.fromObject({ languageSelected: true })

      expect(model.languageSelected).to.be.eq(true)
    })
  })

  describe('deserialize', () => {

    it('should return an instance initialised with defaults for undefined', () => {
      expect(new SupportRequired().deserialize(undefined)).to.be.eql(new SupportRequired())
    })

    it('should return an instance with set values', () => {
      const actual: SupportRequired = new SupportRequired().deserialize({ languageSelected: true,
        languageInterpreted: 'English' , otherSupportSelected: true, otherSupport: 'extraSupport'})
      expect(actual.languageInterpreted).to.be.eql('English')
      expect(actual.otherSupport).to.be.eql('extraSupport')
    })

    it('should return an instance with set values', () => {
      const actual: SupportRequired = new SupportRequired().deserialize(undefined)
      expect(actual).to.be.eql(new SupportRequired())
    })
  })
})
