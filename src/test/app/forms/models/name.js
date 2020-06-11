"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const name_1 = require("forms/models/name");
describe('Name', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const name = new name_1.Name();
            chai_1.expect(name.name).to.be.undefined;
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new name_1.Name().deserialize(undefined)).to.eql(new name_1.Name());
        });
        it('should return an instance from given object', () => {
            const name = 'My Full Name';
            const result = new name_1.Name().deserialize({
                name: name
            });
            chai_1.expect(result.name).to.be.equals(name);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject name with undefined', () => {
            const errors = validator.validateSync(new name_1.Name(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, name_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should reject name with empty string', () => {
            const errors = validator.validateSync(new name_1.Name(''));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, name_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should reject name with white spaces string', () => {
            const errors = validator.validateSync(new name_1.Name('   '));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, name_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should reject name with more than 255 characters', () => {
            const errors = validator.validateSync(new name_1.Name(validationUtils_1.generateString(256)));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, name_1.ValidationErrors.NAME_TOO_LONG.replace('$constraint1', '255'));
        });
        it('should accept name with 255 characters', () => {
            const errors = validator.validateSync(new name_1.Name(validationUtils_1.generateString(255)));
            chai_1.expect(errors.length).to.equal(0);
        });
        it('should accept valid name', () => {
            const errors = validator.validateSync(new name_1.Name('Claimant Name'));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
