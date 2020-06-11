"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const email_1 = require("forms/models/email");
describe('Email', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            let email = new email_1.Email();
            chai_1.expect(email.address).to.be.undefined;
        });
    });
    describe('deserialize', () => {
        it('should return a Email instance initialised with defaults for undefined', () => {
            chai_1.expect(new email_1.Email().deserialize(undefined)).to.eql(new email_1.Email());
        });
        it('should return a Email instance initialised with defaults for null', () => {
            chai_1.expect(new email_1.Email().deserialize(null)).to.eql(new email_1.Email());
        });
        it('should return a Email instance with set field "address" from given object', () => {
            let result = new email_1.Email().deserialize({
                address: 'myemail@domain.com'
            });
            chai_1.expect(result.address).to.be.equals('myemail@domain.com');
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject undefined address', () => {
            const errors = validator.validateSync(new email_1.Email(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, email_1.ValidationErrors.ADDRESS_NOT_VALID);
        });
        it('should reject null address', () => {
            const errors = validator.validateSync(new email_1.Email(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, email_1.ValidationErrors.ADDRESS_NOT_VALID);
        });
        it('should reject invalid address', () => {
            const errors = validator.validateSync(new email_1.Email('admin@'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, email_1.ValidationErrors.ADDRESS_NOT_VALID);
        });
        it('should accept valid address', () => {
            const errors = validator.validateSync(new email_1.Email('admin@example.com'));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
    describe('task state', () => {
        context('is incomplete', () => {
            it('when address is undefined', () => {
                const state = new email_1.Email(undefined);
                chai_1.expect(state.isCompleted()).to.be.false;
            });
            it('when address is null', () => {
                const state = new email_1.Email(null);
                chai_1.expect(state.isCompleted()).to.be.false;
            });
            it('when address is invalid', () => {
                const state = new email_1.Email('some-text');
                chai_1.expect(state.isCompleted()).to.be.false;
            });
        });
        context('is complete', () => {
            it('when address is valid', () => {
                const state = new email_1.Email('user@example.com');
                chai_1.expect(state.isCompleted()).to.be.true;
            });
        });
    });
});
