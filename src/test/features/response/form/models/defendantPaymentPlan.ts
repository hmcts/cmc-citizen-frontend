import { expect } from 'chai'

import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import { DefendantPaymentPlan, ValidationErrors } from 'response/form/models/defendantPaymentPlan'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { LocalDate } from 'forms/models/localDate'
import { MomentFactory } from 'common/momentFactory'

const FUTURE_YEAR = MomentFactory.currentDate().add(10, 'years').year()
const DEFAULT_PAYMENT_PLAN = {
  remainingAmount: 100,
  firstPayment: 50,
  installmentAmount: 50,
  firstPaymentDate: { year: FUTURE_YEAR, month: 10, day: 10 },
  paymentSchedule: PaymentSchedule.EVERY_MONTH.value,
  text: undefined
}

const DEFENDANT_PAYMENT_PLAN_FOR_DESERIALISATION = {
  remainingAmount: 100,
  firstPayment: 50,
  installmentAmount: 50,
  firstPaymentDate: { year: FUTURE_YEAR, month: 10, day: 10 },
  paymentSchedule: { value: PaymentSchedule.EVERY_MONTH.value, displayValue: PaymentSchedule.EVERY_MONTH.displayValue },
  text: undefined
}

function validPaymentPlan (): DefendantPaymentPlan {
  return new DefendantPaymentPlan(100, 50, 50, new LocalDate(FUTURE_YEAR, 10, 10), PaymentSchedule.EVERY_MONTH, undefined)
}

describe('DefendantPaymentPlan', () => {
  describe('form object deserialization', () => {
    it('should return new instance when value is undefined', () => {
      expect(DefendantPaymentPlan.fromObject(undefined)).to.deep.equal(new DefendantPaymentPlan())
    })

    it('should leave missing fields undefined', () => {
      expect(DefendantPaymentPlan.fromObject({})).to.deep.equal(new DefendantPaymentPlan())
    })

    it('should deserialize all fields', () => {
      expect(DefendantPaymentPlan.fromObject(DEFAULT_PAYMENT_PLAN)).to.deep.equal(validPaymentPlan())
    })
  })

  describe('deserialization', () => {
    it('should return instance initialised with defaults given undefined', () => {
      expect(new DefendantPaymentPlan().deserialize(undefined)).to.deep.equal(new DefendantPaymentPlan())
    })

    it('should return instance with set fields from given object', () => {
      expect(new DefendantPaymentPlan().deserialize(DEFENDANT_PAYMENT_PLAN_FOR_DESERIALISATION)).to.deep.equal(validPaymentPlan())
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('should reject when', () => {
      it('undefined option', () => {
        const errors = validator.validateSync(new DefendantPaymentPlan(undefined))
        expect(errors.length).to.equal(5)
        expectValidationError(errors, ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID)
        expectValidationError(errors, ValidationErrors.INSTALMENTS_AMOUNT_INVALID)
        expectValidationError(errors, ValidationErrors.SELECT_PAYMENT_SCHEDULE)
        expectValidationError(errors, ValidationErrors.INVALID_DATE)
        expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
      })

    })

    it('first amount > remainingAmount', () => {
      const paymentPlan = validPaymentPlan()
      paymentPlan.firstPayment = 101
      const errors = validator.validateSync(paymentPlan)
      expect(errors.length).to.equal(3)
      expectValidationError(errors, ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID)
      expectValidationError(errors, ValidationErrors.INSTALMENTS_AMOUNT_INVALID)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)

    })

    it('instalment amount > remainingAmount', () => {
      const paymentPlan = validPaymentPlan()
      paymentPlan.installmentAmount = 101
      const errors = validator.validateSync(paymentPlan)
      expect(errors.length).to.equal(3)
      expectValidationError(errors, ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID)
      expectValidationError(errors, ValidationErrors.INSTALMENTS_AMOUNT_INVALID)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('first amount <= 0', () => {
      const paymentPlan = validPaymentPlan()
      const valuesToTest = [0, -1]

      valuesToTest.forEach(amount => {
        paymentPlan.firstPayment = amount
        const errors = validator.validateSync(paymentPlan)
        expect(errors.length).to.equal(2)
        expectValidationError(errors, ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID)
        expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
      })
    })

    it('instalment amount <= 0', () => {
      const paymentPlan = validPaymentPlan()
      const valuesToTest = [0, -1]

      valuesToTest.forEach(amount => {
        paymentPlan.installmentAmount = amount
        const errors = validator.validateSync(paymentPlan)
        expect(errors.length).to.equal(2)
        expectValidationError(errors, ValidationErrors.INSTALMENTS_AMOUNT_INVALID)
        expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
      })
    })

    it('instalment amount invalid decimal places', () => {
      const paymentPlan = validPaymentPlan()
      paymentPlan.installmentAmount = 1.022
      const errors = validator.validateSync(paymentPlan)

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.AMOUNT_INVALID_DECIMALS)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('first payment invalid decimal places', () => {
      const paymentPlan = validPaymentPlan()
      paymentPlan.firstPayment = 1.022
      const errors = validator.validateSync(paymentPlan)

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.AMOUNT_INVALID_DECIMALS)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('date is not future', () => {
      const paymentPlan = validPaymentPlan()
      const moment = MomentFactory.currentDate()
      paymentPlan.firstPaymentDate = new LocalDate(moment.year(), moment.month() + 1, moment.date())
      const errors = validator.validateSync(paymentPlan)

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.FUTURE_DATE)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('unknown payment schedule', () => {
      const paymentPlan = validPaymentPlan()
      paymentPlan.paymentSchedule = { value: 'gibberish', displayValue: 'hi' }
      const errors = validator.validateSync(paymentPlan)

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.SELECT_PAYMENT_SCHEDULE)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    describe('should accept when everything is valid', () => {
      const errors = validator.validateSync(validPaymentPlan())
      expect(errors.length).to.equal(1)
    })
  })
})
