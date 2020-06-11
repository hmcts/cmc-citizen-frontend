"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const companyDetails_1 = require("forms/models/companyDetails");
const partyDetails_1 = require("forms/models/partyDetails");
const partyType_1 = require("common/partyType");
const address_1 = require("forms/models/address");
const correspondenceAddress_1 = require("forms/models/correspondenceAddress");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validAddress = new address_1.Address('line1', 'line2', 'line3', 'city', 'bb127nq');
describe('CompanyDetails', () => {
    let input;
    let formInput;
    beforeEach(() => {
        input = {
            address: {
                line1: 'first line',
                postcode: 'bb127nq'
            },
            hasCorrespondenceAddress: true,
            correspondenceAddress: {
                line1: 'another line',
                city: 'some city',
                postcode: 'bb127nq'
            },
            name: 'companyName'
        };
        formInput = Object.assign(Object.assign({}, input), { hasCorrespondenceAddress: 'true' });
    });
    describe('constructor', () => {
        it('should initialise fields with defaults', () => {
            let companyDetails = new companyDetails_1.CompanyDetails();
            chai_1.expect(companyDetails.address).to.be.instanceOf(address_1.Address);
            chai_1.expect(companyDetails.correspondenceAddress).to.be.instanceOf(address_1.Address);
            chai_1.expect(companyDetails.type).to.equal(partyType_1.PartyType.COMPANY.value);
            chai_1.expect(companyDetails.name).to.equal(undefined);
            chai_1.expect(companyDetails.hasCorrespondenceAddress).to.equal(false);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        let companyDetails;
        beforeEach(() => {
            companyDetails = new companyDetails_1.CompanyDetails();
        });
        it('should return error when address is undefined', () => {
            companyDetails.address = undefined;
            let errors = validator.validateSync(companyDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.ADDRESS_REQUIRED);
        });
        it('should return errors when required address fields are missing', () => {
            let errors = validator.validateSync(companyDetails);
            validationUtils_1.expectValidationError(errors, address_1.ValidationErrors.FIRST_LINE_REQUIRED);
            validationUtils_1.expectValidationError(errors, address_1.ValidationErrors.POSTCODE_REQUIRED);
        });
        it('should return error when company name is undefined', () => {
            companyDetails.name = undefined;
            let errors = validator.validateSync(companyDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should return error when company name is blank', () => {
            companyDetails.name = '  ';
            let errors = validator.validateSync(companyDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should return error when company name got more than 255 character', () => {
            companyDetails.name = validationUtils_1.generateString(256);
            companyDetails.contactPerson = 'contactPerson';
            companyDetails.address = validAddress;
            let errors = validator.validateSync(companyDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.NAME_TOO_LONG.replace('$constraint1', '255'));
        });
        it('should return error when contact person got more than 255 character', () => {
            companyDetails.contactPerson = validationUtils_1.generateString(256);
            companyDetails.name = 'companyName';
            companyDetails.address = validAddress;
            let errors = validator.validateSync(companyDetails);
            validationUtils_1.expectValidationError(errors, companyDetails_1.ValidationErrors.CONTACT_PERSON_NAME_TOO_LONG.replace('$constraint1', '30'));
        });
        describe('when "has correspondence address" flag is set to true', () => {
            beforeEach(() => {
                companyDetails.address = validAddress;
                companyDetails.hasCorrespondenceAddress = true;
                companyDetails.contactPerson = 'ClaimantName';
                companyDetails.name = 'test';
            });
            it('should return error when correspondence address is undefined', () => {
                companyDetails.correspondenceAddress = undefined;
                let errors = validator.validateSync(companyDetails);
                validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED);
            });
            it('should return errors when correspondence address required fields are missing', () => {
                let errors = validator.validateSync(companyDetails);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.FIRST_LINE_REQUIRED);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.POSTCODE_REQUIRED);
            });
            it('should return no errors when correspondence address is provided', () => {
                companyDetails.correspondenceAddress = validAddress;
                let result = validator.validateSync(companyDetails);
                chai_1.expect(result.length).to.equal(0);
            });
        });
        describe('when "has correspondence address" flag is set to false', () => {
            it('should return no errors when correspondence address is not provided', () => {
                companyDetails.address = validAddress;
                companyDetails.hasCorrespondenceAddress = false;
                companyDetails.contactPerson = 'ClaimantName';
                companyDetails.name = 'test';
                let error = validator.validateSync(companyDetails);
                chai_1.expect(error.length).to.equal(0);
            });
        });
    });
    describe('deserialize', () => {
        it('should return object initialized with default values when given undefined', () => {
            let deserialized = new companyDetails_1.CompanyDetails().deserialize(undefined);
            chai_1.expect(deserialized.address).to.be.instanceOf(address_1.Address);
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(false);
            chai_1.expect(deserialized.correspondenceAddress).to.be.instanceOf(address_1.Address);
            chai_1.expect(deserialized.type).to.equal(partyType_1.PartyType.COMPANY.value);
            chai_1.expect(deserialized.name).to.equal(undefined);
            chai_1.expect(deserialized.contactPerson).to.equal(undefined);
        });
        it('should return object with values set from provided input json', () => {
            let deserialized = new companyDetails_1.CompanyDetails().deserialize(input);
            chai_1.expect(deserialized.address.line1).to.equal('first line');
            chai_1.expect(deserialized.address.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(true);
            chai_1.expect(deserialized.correspondenceAddress.line1).to.equal('another line');
            chai_1.expect(deserialized.correspondenceAddress.city).to.equal('some city');
            chai_1.expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.type).to.equal(partyType_1.PartyType.COMPANY.value);
            chai_1.expect(deserialized.name).to.equal('companyName');
            chai_1.expect(deserialized.contactPerson).to.equal(undefined);
        });
    });
    describe('form object deserialization', () => {
        it('should return undefined when input is undefined', () => {
            chai_1.expect(companyDetails_1.CompanyDetails.fromObject(undefined)).to.equal(undefined);
        });
        it('should deserialize all fields', () => {
            let deserialized = companyDetails_1.CompanyDetails.fromObject(formInput);
            chai_1.expect(deserialized.address.line1).to.equal('first line');
            chai_1.expect(deserialized.address.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(true);
            chai_1.expect(deserialized.correspondenceAddress.line1).to.equal('another line');
            chai_1.expect(deserialized.correspondenceAddress.city).to.equal('some city');
            chai_1.expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.type).to.equal(partyType_1.PartyType.COMPANY.value);
            chai_1.expect(deserialized.name).to.equal('companyName');
            chai_1.expect(deserialized.contactPerson).to.equal(undefined);
        });
        it('should set correspondence address to undefined if "has correspondence address flag is set to false"', () => {
            formInput.hasCorrespondenceAddress = 'false';
            let deserialized = companyDetails_1.CompanyDetails.fromObject(formInput);
            chai_1.expect(deserialized.correspondenceAddress).to.equal(undefined);
        });
    });
    describe('isCompleted', () => {
        let companyDetails;
        beforeEach(() => {
            companyDetails = new companyDetails_1.CompanyDetails();
            companyDetails.name = 'John Smith';
            companyDetails.address = validAddress;
            companyDetails.hasCorrespondenceAddress = true;
            companyDetails.correspondenceAddress = validAddress;
            companyDetails.contactPerson = '';
        });
        it('should return false when has name is undefined', () => {
            companyDetails.name = undefined;
            chai_1.expect(companyDetails.isCompleted()).to.equal(false);
        });
        it('should return false when address is undefined', () => {
            companyDetails.address = undefined;
            chai_1.expect(companyDetails.isCompleted()).to.equal(false);
        });
        it('should return false when address is not completed', () => {
            companyDetails.address = new address_1.Address();
            chai_1.expect(companyDetails.isCompleted()).to.equal(false);
        });
        it('should return false when has correspondence address and correspondence address is undefined', () => {
            companyDetails.hasCorrespondenceAddress = true;
            companyDetails.correspondenceAddress = undefined;
            chai_1.expect(companyDetails.isCompleted()).to.equal(false);
        });
        it('should return false when has correspondence address and correspondence address is not completed', () => {
            companyDetails.hasCorrespondenceAddress = true;
            companyDetails.correspondenceAddress = new address_1.Address();
            chai_1.expect(companyDetails.isCompleted()).to.equal(false);
        });
        it('should return true when address is completed and does not have correspondence address', () => {
            companyDetails.hasCorrespondenceAddress = false;
            companyDetails.correspondenceAddress = undefined;
            chai_1.expect(companyDetails.isCompleted()).to.equal(true);
        });
        it('should return true when all the required fields are completed', () => {
            chai_1.expect(companyDetails.isCompleted()).to.equal(true);
        });
    });
});
