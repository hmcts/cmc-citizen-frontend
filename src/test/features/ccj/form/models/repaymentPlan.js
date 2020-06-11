"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const repaymentPlan_1 = require("ccj/form/models/repaymentPlan");
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
const localDate_1 = require("forms/models/localDate");
const momentFactory_1 = require("shared/momentFactory");
const validationErrors_1 = require("forms/validation/validationErrors");
const FUTURE_YEAR = momentFactory_1.MomentFactory.currentDate().add(10, 'years').year();
const DEFAULT_REPAYMENT_PLAN = {
    remainingAmount: 100,
    instalmentAmount: 50,
    firstPaymentDate: { year: FUTURE_YEAR, month: 10, day: 10 },
    paymentSchedule: paymentSchedule_1.PaymentSchedule.EVERY_MONTH.value
};
const REPAYMENT_PLAN_FOR_DESERIALISATION = {
    remainingAmount: 100,
    instalmentAmount: 50,
    firstPaymentDate: { year: FUTURE_YEAR, month: 10, day: 10 },
    paymentSchedule: { value: paymentSchedule_1.PaymentSchedule.EVERY_MONTH.value, displayValue: paymentSchedule_1.PaymentSchedule.EVERY_MONTH.displayValue }
};
function validRepaymentPlan() {
    return new repaymentPlan_1.RepaymentPlan(100, 50, new localDate_1.LocalDate(FUTURE_YEAR, 10, 10), paymentSchedule_1.PaymentSchedule.EVERY_MONTH);
}
describe('RepaymentPlan', () => {
    describe('form object deserialization', () => {
        it('should return new instance when value is undefined', () => {
            chai_1.expect(repaymentPlan_1.RepaymentPlan.fromObject(undefined)).to.deep.equal(new repaymentPlan_1.RepaymentPlan());
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(repaymentPlan_1.RepaymentPlan.fromObject({})).to.deep.equal(new repaymentPlan_1.RepaymentPlan());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(repaymentPlan_1.RepaymentPlan.fromObject(DEFAULT_REPAYMENT_PLAN)).to.deep.equal(validRepaymentPlan());
        });
    });
    describe('deserialization', () => {
        it('should return instance initialised with defaults given undefined', () => {
            chai_1.expect(new repaymentPlan_1.RepaymentPlan().deserialize(undefined)).to.deep.equal(new repaymentPlan_1.RepaymentPlan());
        });
        it('should return instance with set fields from given object', () => {
            chai_1.expect(new repaymentPlan_1.RepaymentPlan().deserialize(REPAYMENT_PLAN_FOR_DESERIALISATION)).to.deep.equal(validRepaymentPlan());
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('should reject when', () => {
            it('undefined option', () => {
                const errors = validator.validateSync(new repaymentPlan_1.RepaymentPlan(undefined));
                chai_1.expect(errors.length).to.equal(3);
                validationUtils_1.expectValidationError(errors, repaymentPlan_1.ValidationErrors.INSTALMENTS_AMOUNT_INVALID);
                validationUtils_1.expectValidationError(errors, repaymentPlan_1.ValidationErrors.SELECT_PAYMENT_SCHEDULE);
                validationUtils_1.expectValidationError(errors, repaymentPlan_1.ValidationErrors.INVALID_DATE);
            });
        });
        it('instalment amount > remainingAmount', () => {
            const repaymentPlan = validRepaymentPlan();
            repaymentPlan.instalmentAmount = 101;
            const errors = validator.validateSync(repaymentPlan);
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, repaymentPlan_1.ValidationErrors.INSTALMENTS_AMOUNT_INVALID);
        });
        it('instalment amount <= 0', () => {
            const repaymentPlan = validRepaymentPlan();
            const valuesToTest = [0, -1];
            valuesToTest.forEach(amount => {
                repaymentPlan.instalmentAmount = amount;
                const errors = validator.validateSync(repaymentPlan);
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, repaymentPlan_1.ValidationErrors.INSTALMENTS_AMOUNT_INVALID);
            });
        });
        it('instalment amount invalid decimal places', () => {
            const repaymentPlan = validRepaymentPlan();
            repaymentPlan.instalmentAmount = 1.022;
            const errors = validator.validateSync(repaymentPlan);
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
        });
        it('date is not future', () => {
            const repaymentPlan = validRepaymentPlan();
            const moment = momentFactory_1.MomentFactory.currentDate();
            repaymentPlan.firstPaymentDate = new localDate_1.LocalDate(moment.year(), moment.month() + 1, moment.date());
            const errors = validator.validateSync(repaymentPlan);
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, repaymentPlan_1.ValidationErrors.FUTURE_DATE);
        });
        it('unknown payment schedule', () => {
            const repaymentPlan = validRepaymentPlan();
            repaymentPlan.paymentSchedule = { value: 'gibberish', displayValue: 'hi' };
            const errors = validator.validateSync(repaymentPlan);
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, repaymentPlan_1.ValidationErrors.SELECT_PAYMENT_SCHEDULE);
        });
        describe('should accept when everything is valid', () => {
            const errors = validator.validateSync(validRepaymentPlan());
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
