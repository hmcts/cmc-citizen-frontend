import { expect } from 'chai'

import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import { RepaymentPlan, ValidationErrors } from 'ccj/form/models/repaymentPlan'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { LocalDate } from 'forms/models/localDate'
import { MomentFactory } from 'common/momentFactory'
import { ValidationErrors as CommonValidationErrors } from 'app/forms/validation/validationErrors'

const FUTURE_YEAR = MomentFactory.currentDate().add(10, 'years').year()
const DEFAULT_REPAYMENT_PLAN = {
  remainingAmount: 100,
  firstPayment: 50,
  installmentAmount: 50,
  firstPaymentDate: { year: FUTURE_YEAR, month: 10, day: 10 },
  paymentSchedule: PaymentSchedule.EVERY_MONTH.value
}

const REPAYMENT_PLAN_FOR_DESERIALISATION = {
  remainingAmount: 100,
  firstPayment: 50,
  installmentAmount: 50,
  firstPaymentDate: { year: FUTURE_YEAR, month: 10, day: 10 },
  paymentSchedule: { value: PaymentSchedule.EVERY_MONTH.value, displayValue: PaymentSchedule.EVERY_MONTH.displayValue }
}

function validRepaymentPlan (): RepaymentPlan {
  return new RepaymentPlan(100, 50, 50, new LocalDate(FUTURE_YEAR, 10, 10), PaymentSchedule.EVERY_MONTH)
}

describe('RepaymentPlan', () => {
  describe('form object deserialization', () => {
    it('should return new instance when value is undefined', () => {
      expect(RepaymentPlan.fromObject(undefined)).to.deep.equal(new RepaymentPlan())
    })

    it('should leave missing fields undefined', () => {
      expect(RepaymentPlan.fromObject({})).to.deep.equal(new RepaymentPlan())
    })

    it('should deserialize all fields', () => {
      expect(RepaymentPlan.fromObject(DEFAULT_REPAYMENT_PLAN)).to.deep.equal(validRepaymentPlan())
    })
  })

  describe('deserialization', () => {
    it('should return instance initialised with defaults given undefined', () => {
      expect(new RepaymentPlan().deserialize(undefined)).to.deep.equal(new RepaymentPlan())
    })

    it('should return instance with set fields from given object', () => {
      expect(new RepaymentPlan().deserialize(REPAYMENT_PLAN_FOR_DESERIALISATION)).to.deep.equal(validRepaymentPlan())
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('should reject when', () => {
      it('undefined option', () => {
        const errors = validator.validateSync(new RepaymentPlan(undefined))

        expect(errors.length).to.equal(4)
        expectValidationError(errors, ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID)
        expectValidationError(errors, ValidationErrors.INSTALMENTS_AMOUNT_INVALID)
        expectValidationError(errors, ValidationErrors.SELECT_PAYMENT_SCHEDULE)
        expectValidationError(errors, ValidationErrors.INVALID_DATE)
      })

    })

    it('first amount > remainingAmount', () => {
      const repaymentPlan = validRepaymentPlan()
      repaymentPlan.firstPayment = 101
      const errors = validator.validateSync(repaymentPlan)

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID)
    })

    it('instalment amount > remainingAmount', () => {
      const repaymentPlan = validRepaymentPlan()
      repaymentPlan.installmentAmount = 101
      const errors = validator.validateSync(repaymentPlan)

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.INSTALMENTS_AMOUNT_INVALID)
    })

    it('first amount <= 0', () => {
      const repaymentPlan = validRepaymentPlan()
      const valuesToTest = [0, -1]

      valuesToTest.forEach(amount => {
        repaymentPlan.firstPayment = amount
        const errors = validator.validateSync(repaymentPlan)

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.FIRST_PAYMENT_AMOUNT_INVALID)
      })
    })

    it('instalment amount <= 0', () => {
      const repaymentPlan = validRepaymentPlan()
      const valuesToTest = [0, -1]

      valuesToTest.forEach(amount => {
        repaymentPlan.installmentAmount = amount
        const errors = validator.validateSync(repaymentPlan)

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.INSTALMENTS_AMOUNT_INVALID)
      })
    })

    it('instalment amount invalid decimal places', () => {
      const repaymentPlan = validRepaymentPlan()
      repaymentPlan.installmentAmount = 1.022
      const errors = validator.validateSync(repaymentPlan)

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.AMOUNT_INVALID_DECIMALS)
    })

    it('first payment invalid decimal places', () => {
      const repaymentPlan = validRepaymentPlan()
      repaymentPlan.firstPayment = 1.022
      const errors = validator.validateSync(repaymentPlan)

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.AMOUNT_INVALID_DECIMALS)
    })

    it('date is not future', () => {
      const repaymentPlan = validRepaymentPlan()
      const moment = MomentFactory.currentDate()
      repaymentPlan.firstPaymentDate = new LocalDate(moment.year(), moment.month() + 1, moment.date())
      const errors = validator.validateSync(repaymentPlan)

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.FUTURE_DATE)
    })

    it('unknown payment schedule', () => {
      const repaymentPlan = validRepaymentPlan()
      repaymentPlan.paymentSchedule = { value: 'gibberish', displayValue: 'hi' }
      const errors = validator.validateSync(repaymentPlan)

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.SELECT_PAYMENT_SCHEDULE)
    })

    describe('should accept when everything is valid', () => {
      const errors = validator.validateSync(validRepaymentPlan())

      expect(errors.length).to.equal(0)
    })
  })
})
