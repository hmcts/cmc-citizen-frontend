import { expect } from 'chai'

import { Validator } from 'class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { RejectAllOfClaim, RejectAllOfClaimOption, ValidationErrors } from 'response/form/models/rejectAllOfClaim'
import {
  HowMuchHaveYouPaid,
  ValidationErrors as HowmuchHaveYouPaidValidationErrors
} from 'response/form/models/howMuchHaveYouPaid'
import { LocalDate } from 'forms/models/localDate'
import { WhyDoYouDisagree } from 'response/form/models/whyDoYouDisagree'
import moment = require('moment')

const pastMoment = moment().subtract(30, 'days')
const pastDate = new LocalDate(pastMoment.year(), pastMoment.month() + 1, pastMoment.date())

const validHowMuchHaveYouPaid = new HowMuchHaveYouPaid(12.34, pastDate, 'I paid this much')

describe('RejectAllOfClaim', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when undefined option', () => {
      const errors = validator.validateSync(new RejectAllOfClaim(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should reject when invalid option', () => {
      const errors = validator.validateSync(new RejectAllOfClaim('reject all'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
    })

    it('should reject when invalid `how much have you paid`', () => {
      RejectAllOfClaimOption.all().forEach(type => {
        const errors = validator.validateSync(new RejectAllOfClaim(type, new HowMuchHaveYouPaid()))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, HowmuchHaveYouPaidValidationErrors.AMOUNT_NOT_VALID)
      })
    })

    it('should accept despite invalid `why do you disagree`', () => {
      const invalidWhyDoYouDisagree = new WhyDoYouDisagree()
      expect(validator.validateSync(invalidWhyDoYouDisagree).length).to.equal(1)

      RejectAllOfClaimOption.all().forEach(type => {
        const errors = validator.validateSync(new RejectAllOfClaim(type, validHowMuchHaveYouPaid, invalidWhyDoYouDisagree))

        expect(errors.length).to.equal(0)
      })
    })

    it('should accept when valid fields', () => {
      RejectAllOfClaimOption.all().forEach(type => {
        const errors = validator.validateSync(new RejectAllOfClaim(type, validHowMuchHaveYouPaid))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
