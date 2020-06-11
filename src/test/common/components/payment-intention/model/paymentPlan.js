"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const paymentPlan_1 = require("shared/components/payment-intention/model/paymentPlan");
const validationErrors_1 = require("forms/validation/validationErrors");
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
const localDate_1 = require("forms/models/localDate");
const momentFactory_1 = require("shared/momentFactory");
const FUTURE_YEAR = momentFactory_1.MomentFactory.currentDate().add(10, 'years').year();
const DEFAULT_PAYMENT_PLAN = {
    totalAmount: 100,
    instalmentAmount: 50,
    firstPaymentDate: { year: FUTURE_YEAR, month: 10, day: 10 },
    paymentSchedule: paymentSchedule_1.PaymentSchedule.EVERY_MONTH.value,
    text: 'I owe nothing'
};
const DEFENDANT_PAYMENT_PLAN_FOR_DESERIALISATION = {
    totalAmount: 100,
    instalmentAmount: 50,
    firstPaymentDate: { year: FUTURE_YEAR, month: 10, day: 10 },
    paymentSchedule: { value: paymentSchedule_1.PaymentSchedule.EVERY_MONTH.value, displayValue: paymentSchedule_1.PaymentSchedule.EVERY_MONTH.displayValue },
    completionDate: { year: FUTURE_YEAR, month: 11, day: 10 },
    paymentLength: '2 months',
    text: 'I owe nothing'
};
function validPaymentPlan() {
    return new paymentPlan_1.PaymentPlan(100, 50, new localDate_1.LocalDate(FUTURE_YEAR, 10, 10), paymentSchedule_1.PaymentSchedule.EVERY_MONTH);
}
describe('PaymentPlan', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(paymentPlan_1.PaymentPlan.fromObject(undefined)).to.equal(undefined);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(paymentPlan_1.PaymentPlan.fromObject({})).to.deep.equal(new paymentPlan_1.PaymentPlan());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(paymentPlan_1.PaymentPlan.fromObject(DEFAULT_PAYMENT_PLAN)).to.deep.equal(validPaymentPlan());
        });
    });
    describe('deserialization', () => {
        it('should return instance initialised with defaults given undefined', () => {
            chai_1.expect(new paymentPlan_1.PaymentPlan().deserialize(undefined)).to.deep.equal(new paymentPlan_1.PaymentPlan());
        });
        it('should return instance with set fields from given object', () => {
            chai_1.expect(new paymentPlan_1.PaymentPlan().deserialize(DEFENDANT_PAYMENT_PLAN_FOR_DESERIALISATION)).to.deep.equal(validPaymentPlan());
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('should reject when', () => {
            it('undefined option', () => {
                const errors = validator.validateSync(new paymentPlan_1.PaymentPlan(undefined));
                chai_1.expect(errors.length).to.equal(3);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND);
                validationUtils_1.expectValidationError(errors, paymentPlan_1.ValidationErrors.SCHEDULE_REQUIRED);
                validationUtils_1.expectValidationError(errors, paymentPlan_1.ValidationErrors.FIRST_PAYMENT_DATE_INVALID);
            });
            it('instalment amount > remainingAmount', () => {
                const paymentPlan = validPaymentPlan();
                paymentPlan.instalmentAmount = 101;
                const errors = validator.validateSync(paymentPlan);
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paymentPlan_1.ValidationErrors.INSTALMENTS_AMOUNT_INVALID);
            });
            it('instalment amount <= 0.99', () => {
                const paymentPlan = validPaymentPlan();
                const valuesToTest = [0.99, -1];
                valuesToTest.forEach(amount => {
                    paymentPlan.instalmentAmount = amount;
                    const errors = validator.validateSync(paymentPlan);
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND);
                });
            });
            it('instalment amount invalid decimal places', () => {
                const paymentPlan = validPaymentPlan();
                paymentPlan.instalmentAmount = 1.022;
                const errors = validator.validateSync(paymentPlan);
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
            });
            it('date is not future', () => {
                const paymentPlan = validPaymentPlan();
                const moment = momentFactory_1.MomentFactory.currentDate();
                paymentPlan.firstPaymentDate = new localDate_1.LocalDate(moment.year(), moment.month() + 1, moment.date());
                const errors = validator.validateSync(paymentPlan);
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paymentPlan_1.ValidationErrors.FIRST_PAYMENT_DATE_NOT_IN_FUTURE);
            });
            it('unknown payment schedule', () => {
                const paymentPlan = validPaymentPlan();
                paymentPlan.paymentSchedule = { value: 'gibberish', displayValue: 'hi' };
                const errors = validator.validateSync(paymentPlan);
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paymentPlan_1.ValidationErrors.SCHEDULE_REQUIRED);
            });
        });
        describe('should accept when everything is valid', () => {
            const errors = validator.validateSync(validPaymentPlan());
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
