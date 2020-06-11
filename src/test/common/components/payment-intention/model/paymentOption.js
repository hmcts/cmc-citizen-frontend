"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
describe('PaymentOption', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(paymentOption_1.PaymentOption.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(paymentOption_1.PaymentOption.fromObject({})).to.deep.equal(new paymentOption_1.PaymentOption());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(paymentOption_1.PaymentOption.fromObject({ option: paymentOption_1.PaymentType.INSTALMENTS.value })).to.deep.equal(new paymentOption_1.PaymentOption(paymentOption_1.PaymentType.INSTALMENTS));
        });
    });
    describe('deserialization', () => {
        it('should return instance initialised with defaults given undefined', () => {
            chai_1.expect(new paymentOption_1.PaymentOption().deserialize(undefined)).to.deep.equal(new paymentOption_1.PaymentOption());
        });
        it('should return instance initialised with defaults when given null', () => {
            chai_1.expect(new paymentOption_1.PaymentOption().deserialize(null)).to.deep.equal(new paymentOption_1.PaymentOption());
        });
        it('should return instance with set fields from given object', () => {
            chai_1.expect(new paymentOption_1.PaymentOption().deserialize({ option: { value: paymentOption_1.PaymentType.INSTALMENTS.value } })).to.deep.equal(new paymentOption_1.PaymentOption(paymentOption_1.PaymentType.INSTALMENTS));
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('should reject when', () => {
            it('undefined option', () => {
                const errors = validator.validateSync(new paymentOption_1.PaymentOption(undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paymentOption_1.ValidationErrors.OPTION_REQUIRED);
            });
            it('invalid option', () => {
                const errors = validator.validateSync(new paymentOption_1.PaymentOption(new paymentOption_1.PaymentType('unknown')));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paymentOption_1.ValidationErrors.OPTION_REQUIRED);
            });
        });
        describe('should accept when', () => {
            it('option is known', () => {
                paymentOption_1.PaymentType.all().forEach(type => {
                    const errors = validator.validateSync(new paymentOption_1.PaymentOption(type));
                    chai_1.expect(errors.length).to.equal(0);
                });
            });
        });
    });
    describe('isOfType', () => {
        it('should return false if option is not set', () => {
            const paymentOption = new paymentOption_1.PaymentOption();
            chai_1.expect(paymentOption.isOfType(paymentOption_1.PaymentType.INSTALMENTS)).to.be.false;
        });
        it('should return true if option is instalments and instalments is passed', () => {
            const paymentOption = new paymentOption_1.PaymentOption(paymentOption_1.PaymentType.INSTALMENTS);
            chai_1.expect(paymentOption.isOfType(paymentOption_1.PaymentType.INSTALMENTS)).to.be.true;
        });
        it('should return true if option is instalments and by set date is passed', () => {
            const paymentOption = new paymentOption_1.PaymentOption(paymentOption_1.PaymentType.INSTALMENTS);
            chai_1.expect(paymentOption.isOfType(paymentOption_1.PaymentType.BY_SET_DATE)).to.be.false;
        });
        it('should return true if option is by set date and by set date is passed', () => {
            const paymentOption = new paymentOption_1.PaymentOption(paymentOption_1.PaymentType.BY_SET_DATE);
            chai_1.expect(paymentOption.isOfType(paymentOption_1.PaymentType.BY_SET_DATE)).to.be.true;
        });
        it('should return true if option is by set date and by instalments is passed', () => {
            const paymentOption = new paymentOption_1.PaymentOption(paymentOption_1.PaymentType.BY_SET_DATE);
            chai_1.expect(paymentOption.isOfType(paymentOption_1.PaymentType.INSTALMENTS)).to.be.false;
        });
    });
});
describe('PaymentType', () => {
    describe('displayValue', () => {
        it(`should return '${paymentOption_1.PaymentTypeLabels.IMMEDIATELY}' for IMMEDIATELY`, () => {
            chai_1.expect(paymentOption_1.PaymentType.IMMEDIATELY.displayValue).to.equal(paymentOption_1.PaymentTypeLabels.IMMEDIATELY);
        });
        it(`should return '${paymentOption_1.PaymentTypeLabels.BY_SET_DATE}' for BY_SET_DATE`, () => {
            chai_1.expect(paymentOption_1.PaymentType.BY_SET_DATE.displayValue).to.equal(paymentOption_1.PaymentTypeLabels.BY_SET_DATE);
        });
        it(`should return '${paymentOption_1.PaymentTypeLabels.INSTALMENTS}' for INSTALMENTS`, () => {
            chai_1.expect(paymentOption_1.PaymentType.INSTALMENTS.displayValue).to.equal(paymentOption_1.PaymentTypeLabels.INSTALMENTS);
        });
    });
});
