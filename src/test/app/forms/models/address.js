"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const address_1 = require("forms/models/address");
const correspondenceAddress_1 = require("forms/models/correspondenceAddress");
const address_2 = require("claims/models/address");
describe('Address/CorrespondenceAddress', () => {
    [
        {
            classFunction: address_1.Address,
            validationErrors: address_1.ValidationErrors,
            validationConstants: address_1.ValidationConstants
        },
        {
            classFunction: correspondenceAddress_1.CorrespondenceAddress,
            validationErrors: correspondenceAddress_1.ValidationErrors,
            validationConstants: correspondenceAddress_1.ValidationConstants
        }
    ].forEach((testInput) => {
        const ClassFunction = testInput.classFunction;
        const ValidationErrors = testInput.validationErrors;
        const exceededAddressLength = testInput.validationConstants.ADDRESS_MAX_LENGTH + 1;
        describe('constructor', () => {
            it('should set primitive type fields to undefined', () => {
                let address = new ClassFunction();
                chai_1.expect(address.line1).to.be.undefined;
                chai_1.expect(address.line2).to.be.undefined;
                chai_1.expect(address.line3).to.be.undefined;
                chai_1.expect(address.city).to.be.undefined;
                chai_1.expect(address.postcode).to.be.undefined;
            });
        });
        describe('deserialize', () => {
            it('should return a Address instance initialised with defaults for undefined', () => {
                chai_1.expect(new ClassFunction().deserialize(undefined)).to.eql(new ClassFunction());
            });
            it('should return a Address instance initialised with defaults for null', () => {
                chai_1.expect(new ClassFunction().deserialize(null)).to.eql(new ClassFunction());
            });
            it('should return a Address instance with set fields from given object', () => {
                let result = new ClassFunction().deserialize({
                    line1: 'AddressLine1',
                    line2: 'AddressLine2',
                    line3: 'AddressLine3',
                    city: 'City',
                    postcode: 'PostCode'
                });
                chai_1.expect(result.line1).to.be.equals('AddressLine1');
                chai_1.expect(result.line2).to.be.equals('AddressLine2');
                chai_1.expect(result.line3).to.be.equals('AddressLine3');
                chai_1.expect(result.city).to.be.equals('City');
                chai_1.expect(result.postcode).to.be.equals('PostCode');
            });
        });
        describe('fromClaimAddress', () => {
            it('should create a valid Address object', () => {
                const claimAddress = new address_2.Address().deserialize({
                    line1: 'line1',
                    line2: 'line2',
                    line3: 'line3',
                    city: 'city',
                    postcode: 'postcode'
                });
                const address = address_1.Address.fromClaimAddress(claimAddress);
                chai_1.expect(address.line1).to.equal(claimAddress.line1);
                chai_1.expect(address.line2).to.equal(claimAddress.line2);
                chai_1.expect(address.line3).to.equal(claimAddress.line3);
                chai_1.expect(address.city).to.equal(claimAddress.city);
                chai_1.expect(address.postcode).to.equal(claimAddress.postcode);
            });
        });
        describe('validation', () => {
            const validator = new class_validator_1.Validator();
            it('should reject address with empty first address line and postcode', async () => {
                const errors = await validator.validate(new ClassFunction('', '', '', '', ''));
                chai_1.expect(errors.length).to.equal(3);
                validationUtils_1.expectValidationError(errors, ValidationErrors.FIRST_LINE_REQUIRED);
                validationUtils_1.expectValidationError(errors, ValidationErrors.CITY_REQUIRED);
                validationUtils_1.expectValidationError(errors, ValidationErrors.POSTCODE_REQUIRED);
            });
            it('should reject address with blank first address line and postcode', () => {
                const errors = validator.validateSync(new ClassFunction(' ', '', '', '', ' '));
                chai_1.expect(errors.length).to.equal(3);
                validationUtils_1.expectValidationError(errors, ValidationErrors.FIRST_LINE_REQUIRED);
                validationUtils_1.expectValidationError(errors, ValidationErrors.CITY_REQUIRED);
                validationUtils_1.expectValidationError(errors, ValidationErrors.POSTCODE_REQUIRED);
            });
            it('should reject address with first line longer then upper limit', () => {
                const errors = validator.validateSync(new ClassFunction(validationUtils_1.generateString(exceededAddressLength), '', '', 'town', 'bb127nq'));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationUtils_1.evaluateErrorMsg(ValidationErrors.FIRST_LINE_TOO_LONG, testInput.validationConstants.ADDRESS_MAX_LENGTH));
            });
            it('should reject address with second line longer then upper limit', () => {
                const errors = validator.validateSync(new ClassFunction('Apartment 99', validationUtils_1.generateString(exceededAddressLength), '', 'town', 'bb127nq'));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationUtils_1.evaluateErrorMsg(ValidationErrors.SECOND_LINE_TOO_LONG, testInput.validationConstants.ADDRESS_MAX_LENGTH));
            });
            it('should reject address with third line longer then upper limit', () => {
                const errors = validator.validateSync(new ClassFunction('Apartment 99', '', validationUtils_1.generateString(exceededAddressLength), 'town', 'bb127nq'));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationUtils_1.evaluateErrorMsg(ValidationErrors.THIRD_LINE_TOO_LONG, testInput.validationConstants.ADDRESS_MAX_LENGTH));
            });
            it('should reject address with city longer then upper limit', () => {
                const errors = validator.validateSync(new ClassFunction('Apartment 99', '', '', validationUtils_1.generateString(exceededAddressLength), 'bb127nq'));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationUtils_1.evaluateErrorMsg(ValidationErrors.CITY_NOT_VALID, testInput.validationConstants.ADDRESS_MAX_LENGTH));
            });
            it('should reject address with postcode longer then upper limit', () => {
                const errors = validator.validateSync(new ClassFunction('Apartment 99', '', '', 'town', validationUtils_1.generateString(9)));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, ValidationErrors.POSTCODE_NOT_VALID);
            });
            it('should reject address with invalid postcode', () => {
                const errors = validator.validateSync(new ClassFunction('Apartment 99', '', '', 'Town', 'bb1012345'));
                chai_1.expect(errors.length).to.equal(1);
            });
            it('should accept valid address', () => {
                const errors = validator.validateSync(new ClassFunction('Apartment 99', '', '', 'Town', 'bb127nq'));
                chai_1.expect(errors.length).to.equal(0);
            });
            context('address list is not visible and address inputs are not visible', () => {
                it('should reject when postcode fields are not populated', () => {
                    const address = new ClassFunction();
                    address.addressVisible = false;
                    address.addressSelectorVisible = false;
                    const errors = validator.validateSync(address);
                    chai_1.expect(errors.length).to.equal(1);
                });
            });
            context('address list is visible but none selected', () => {
                it('should reject when address is not selected', () => {
                    const address = new ClassFunction();
                    address.addressVisible = false;
                    address.addressSelectorVisible = true;
                    const errors = validator.validateSync(address);
                    chai_1.expect(errors.length).to.equal(1);
                });
            });
            context('address list is visible and address selected', () => {
                it('should accept when address is provided', () => {
                    const address = new ClassFunction('line1', '', '', 'city', 'bb127nq');
                    address.addressVisible = true;
                    address.addressSelectorVisible = true;
                    const errors = validator.validateSync(address);
                    chai_1.expect(errors.length).to.equal(0);
                });
            });
        });
    });
});
