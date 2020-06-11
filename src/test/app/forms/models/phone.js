"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const phone_1 = require("forms/models/phone");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('Phone', () => {
    describe('constructor', () => {
        it('should have the primitive fields set to undefined', () => {
            let phone = new phone_1.Phone();
            chai_1.expect(phone.number).to.be.undefined;
        });
    });
    describe('deserialize', () => {
        it('should return a Phone instance initialised with defaults given undefined', () => {
            chai_1.expect(new phone_1.Phone().deserialize(undefined)).to.eql(new phone_1.Phone());
        });
        it('should return a Phone instance initialised with defaults when given null', () => {
            chai_1.expect(new phone_1.Phone().deserialize(null)).to.eql(new phone_1.Phone());
        });
        it('should return a Phone instance with set fields from given object', () => {
            let result = new phone_1.Phone().deserialize({
                number: '+447123456789'
            });
            chai_1.expect(result.number).to.equal('+447123456789');
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject empty phone number', () => {
            const errors = validator.validateSync(new phone_1.Phone());
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, phone_1.ValidationErrors.NUMBER_REQUIRED);
        });
        it('should reject max allowed characters in phone number', () => {
            const errors = validator.validateSync(new phone_1.Phone(validationUtils_1.generateString(31)));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
        });
        it('should accept valid mobile phone number', () => {
            const errors = validator.validateSync(new phone_1.Phone('07555055505'));
            chai_1.expect(errors.length).to.equal(0);
        });
        it('should accept valid land line number', () => {
            const errors = validator.validateSync(new phone_1.Phone('0203 010 3512'));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
