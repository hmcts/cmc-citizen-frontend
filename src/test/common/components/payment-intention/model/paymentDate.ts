import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import * as moment from 'moment'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { PaymentDate, ValidationErrors } from 'shared/components/payment-intention/model/paymentDate'
import { LocalDate, ValidationErrors as LocalDateValidationErrors } from 'forms/models/localDate'

describe('PaymentDate', () => {

  const validDateInThePastObj: any = { date: { day: 1, month: 1, year: 2000 } }
  const validDateInTheFutureObj: any = { date: { day: 1, month: 1, year: 2100 } }

  describe('deserialize', () => {
    it('should not populate fields when object not given', () => {
      const paymentDate: PaymentDate = new PaymentDate().deserialize({})

      expect(paymentDate.date instanceof LocalDate).to.equal(true)
      expect(paymentDate.date.day).to.equal(undefined)
      expect(paymentDate.date.month).to.equal(undefined)
      expect(paymentDate.date.year).to.equal(undefined)
    })

    it('should not populate fields when object not given', () => {
      const paymentDate: PaymentDate = new PaymentDate().deserialize(validDateInThePastObj)

      expect(paymentDate.date instanceof LocalDate).to.equal(true)
      expect(paymentDate.date.day).to.equal(validDateInThePastObj.date.day)
      expect(paymentDate.date.month).to.equal(validDateInThePastObj.date.month)
      expect(paymentDate.date.year).to.equal(validDateInThePastObj.date.year)
    })
  })

  describe('fromObject', () => {
    it('empty object should return unpopulated PaymentDate', () => {
      const paymentDate: PaymentDate = PaymentDate.fromObject({})

      expect(paymentDate.date).to.equal(undefined)
    })

    it('for valid input should return populated instance of PaymentDate', () => {
      const paymentDate: PaymentDate = PaymentDate.fromObject(validDateInThePastObj)

      expect(paymentDate.date instanceof LocalDate).to.equal(true)
      expect(paymentDate.date.day).to.equal(validDateInThePastObj.date.day)
      expect(paymentDate.date.month).to.equal(validDateInThePastObj.date.month)
      expect(paymentDate.date.year).to.equal(validDateInThePastObj.date.year)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('should reject when', () => {
      context('invalid date', () => {
        it('when date in the past', () => {
          const errors = validator.validateSync(new PaymentDate(new LocalDate().deserialize(validDateInThePastObj.date)))

          expect(errors.length).to.equal(1)
          expectValidationError(errors, ValidationErrors.DATE_TODAY_OR_IN_FUTURE)
        })

        it('when invalid format of year (not 4 digits)', () => {
          const errors = validator.validateSync(new PaymentDate(new LocalDate().deserialize({
            day: 1,
            month: 1,
            year: 40
          })))

          expect(errors.length).to.equal(1)
          expectValidationError(errors, LocalDateValidationErrors.YEAR_FORMAT_NOT_VALID)
        })
      })

      context('when pay by set date is known', () => {
        it('should reject non existing date', () => {
          const errors = validator.validateSync(new PaymentDate(new LocalDate(2017, 2, 29)))

          expect(errors.length).to.equal(1)
          expectValidationError(errors, ValidationErrors.DATE_NOT_VALID)
        })

        it('should reject past date', () => {
          const dayBeforeToday = moment().subtract(1, 'days')

          const errors = validator.validateSync(
            new PaymentDate(new LocalDate(dayBeforeToday.year(), dayBeforeToday.month() + 1, dayBeforeToday.date())))

          expect(errors.length).to.equal(1)
          expectValidationError(errors, ValidationErrors.DATE_TODAY_OR_IN_FUTURE)
        })

        it('should reject date with invalid digits in year', () => {
          const errors = validator.validateSync(new PaymentDate(new LocalDate(90, 12, 31)))

          expect(errors.length).to.equal(1)
          expectValidationError(errors, LocalDateValidationErrors.YEAR_FORMAT_NOT_VALID)
        })
      })
    })

    describe('should accept when', () => {
      it('valid input', () => {
        const errors = validator.validateSync(new PaymentDate().deserialize(validDateInTheFutureObj))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
