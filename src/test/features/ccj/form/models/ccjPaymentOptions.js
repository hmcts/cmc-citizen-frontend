"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const ccjPaymentOption_1 = require("ccj/form/models/ccjPaymentOption");
describe('CCJPaymentOption', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(ccjPaymentOption_1.CCJPaymentOption.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should return null when value is null', () => {
            chai_1.expect(ccjPaymentOption_1.CCJPaymentOption.fromObject(null)).to.be.equal(null);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(ccjPaymentOption_1.CCJPaymentOption.fromObject({})).to.deep.equal(new ccjPaymentOption_1.CCJPaymentOption());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(ccjPaymentOption_1.CCJPaymentOption.fromObject({ option: ccjPaymentOption_1.PaymentType.IMMEDIATELY.value })).to.deep.equal(new ccjPaymentOption_1.CCJPaymentOption(ccjPaymentOption_1.PaymentType.IMMEDIATELY));
        });
    });
    describe('deserialization', () => {
        it('should return instance initialised with defaults given undefined', () => {
            chai_1.expect(new ccjPaymentOption_1.CCJPaymentOption().deserialize(undefined)).to.deep.equal(new ccjPaymentOption_1.CCJPaymentOption());
        });
        it('should return instance initialised with defaults when given null', () => {
            chai_1.expect(new ccjPaymentOption_1.CCJPaymentOption().deserialize(null)).to.deep.equal(new ccjPaymentOption_1.CCJPaymentOption());
        });
        it('should return instance with set fields from given object', () => {
            chai_1.expect(new ccjPaymentOption_1.CCJPaymentOption().deserialize({ option: { value: ccjPaymentOption_1.PaymentType.IMMEDIATELY.value } })).to.deep.equal(new ccjPaymentOption_1.CCJPaymentOption(ccjPaymentOption_1.PaymentType.IMMEDIATELY));
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('should reject when', () => {
            it('undefined option', () => {
                const errors = validator.validateSync(new ccjPaymentOption_1.CCJPaymentOption(undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, ccjPaymentOption_1.ValidationErrors.OPTION_REQUIRED);
            });
            it('invalid option', () => {
                const errors = validator.validateSync(new ccjPaymentOption_1.CCJPaymentOption(new ccjPaymentOption_1.PaymentType('unknown', '')));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, ccjPaymentOption_1.ValidationErrors.OPTION_REQUIRED);
            });
        });
        describe('should accept when', () => {
            it('option is known', () => {
                ccjPaymentOption_1.PaymentType.all().forEach(type => {
                    const errors = validator.validateSync(new ccjPaymentOption_1.CCJPaymentOption(type));
                    chai_1.expect(errors.length).to.equal(0);
                });
            });
        });
    });
});
