"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const soleTraderDetails_1 = require("forms/models/soleTraderDetails");
const partyDetails_1 = require("forms/models/partyDetails");
const splitNamedPartyDetails_1 = require("forms/models/splitNamedPartyDetails");
const partyType_1 = require("common/partyType");
const address_1 = require("forms/models/address");
const correspondenceAddress_1 = require("forms/models/correspondenceAddress");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validAddress = new address_1.Address('line1', 'line2', 'line3', 'city', 'bb127nq');
describe('SoleTraderDetails', () => {
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
            firstName: 'claimantName',
            lastName: 'claimantLastname'
        };
        formInput = Object.assign(Object.assign({}, input), { hasCorrespondenceAddress: 'true' });
    });
    describe('constructor', () => {
        it('should initialise fields with defaults', () => {
            let soleTraderDetails = new soleTraderDetails_1.SoleTraderDetails();
            chai_1.expect(soleTraderDetails.address).to.be.instanceOf(address_1.Address);
            chai_1.expect(soleTraderDetails.correspondenceAddress).to.be.instanceOf(address_1.Address);
            chai_1.expect(soleTraderDetails.type).to.equal(partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value);
            chai_1.expect(soleTraderDetails.name).to.equal(undefined);
            chai_1.expect(soleTraderDetails.title).to.equal(undefined);
            chai_1.expect(soleTraderDetails.firstName).to.equal(undefined);
            chai_1.expect(soleTraderDetails.lastName).to.equal(undefined);
            chai_1.expect(soleTraderDetails.hasCorrespondenceAddress).to.equal(false);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        let soleTraderDetails;
        beforeEach(() => {
            soleTraderDetails = new soleTraderDetails_1.SoleTraderDetails();
        });
        it('should return error when address is undefined', () => {
            soleTraderDetails.address = undefined;
            let errors = validator.validateSync(soleTraderDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.ADDRESS_REQUIRED);
        });
        it('should return errors when required address fields are missing', () => {
            let errors = validator.validateSync(soleTraderDetails);
            validationUtils_1.expectValidationError(errors, address_1.ValidationErrors.FIRST_LINE_REQUIRED);
            validationUtils_1.expectValidationError(errors, address_1.ValidationErrors.POSTCODE_REQUIRED);
        });
        it('should return error when name is undefined if firstName and lastName are undefined', () => {
            soleTraderDetails.name = undefined;
            soleTraderDetails.firstName = undefined;
            soleTraderDetails.lastName = undefined;
            let errors = validator.validateSync(soleTraderDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should return error when name is blank if firstName and lastName are undefined', () => {
            soleTraderDetails.name = '  ';
            soleTraderDetails.firstName = undefined;
            soleTraderDetails.lastName = undefined;
            let errors = validator.validateSync(soleTraderDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should return error when name has more than 255 character if firstName and lastName are undefined', () => {
            soleTraderDetails.name = validationUtils_1.generateString(256);
            soleTraderDetails.firstName = undefined;
            soleTraderDetails.lastName = undefined;
            let errors = validator.validateSync(soleTraderDetails);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.errorTooLong('Name').replace('$constraint1', '255'));
        });
        it('should return error when firstName is undefined if name is undefined', () => {
            soleTraderDetails.name = undefined;
            soleTraderDetails.firstName = undefined;
            soleTraderDetails.lastName = 'some name';
            let errors = validator.validateSync(soleTraderDetails, { groups: ['defendant'] });
            validationUtils_1.expectValidationErrorNotPresent(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.FIRSTNAME_REQUIRED);
            validationUtils_1.expectValidationErrorNotPresent(errors, splitNamedPartyDetails_1.ValidationErrors.LASTNAME_REQUIRED);
        });
        it('should return error when firstName is blank if name is undefined', () => {
            soleTraderDetails.name = undefined;
            soleTraderDetails.firstName = '  ';
            soleTraderDetails.lastName = 'some name';
            let errors = validator.validateSync(soleTraderDetails);
            validationUtils_1.expectValidationErrorNotPresent(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.FIRSTNAME_REQUIRED);
            validationUtils_1.expectValidationErrorNotPresent(errors, splitNamedPartyDetails_1.ValidationErrors.LASTNAME_REQUIRED);
        });
        it('should return error when firstName has more than 255 character if name is undefined', () => {
            soleTraderDetails.name = undefined;
            soleTraderDetails.firstName = validationUtils_1.generateString(256);
            soleTraderDetails.lastName = 'some name';
            let errors = validator.validateSync(soleTraderDetails);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.errorTooLong('First name').replace('$constraint1', '255'));
        });
        it('should return error when lastName is undefined if name is undefined', () => {
            soleTraderDetails.name = undefined;
            soleTraderDetails.firstName = 'some name';
            soleTraderDetails.lastName = undefined;
            let errors = validator.validateSync(soleTraderDetails, { groups: ['defendant'] });
            validationUtils_1.expectValidationErrorNotPresent(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
            validationUtils_1.expectValidationErrorNotPresent(errors, splitNamedPartyDetails_1.ValidationErrors.FIRSTNAME_REQUIRED);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.LASTNAME_REQUIRED);
        });
        it('should return error when lastName is blank if name is undefined', () => {
            soleTraderDetails.name = undefined;
            soleTraderDetails.firstName = 'some name';
            soleTraderDetails.lastName = '  ';
            let errors = validator.validateSync(soleTraderDetails);
            validationUtils_1.expectValidationErrorNotPresent(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
            validationUtils_1.expectValidationErrorNotPresent(errors, splitNamedPartyDetails_1.ValidationErrors.FIRSTNAME_REQUIRED);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.LASTNAME_REQUIRED);
        });
        it('should return error when lastName has more than 255 character if name is undefined', () => {
            soleTraderDetails.name = undefined;
            soleTraderDetails.firstName = 'some name';
            soleTraderDetails.lastName = validationUtils_1.generateString(256);
            let errors = validator.validateSync(soleTraderDetails);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.errorTooLong('Last name').replace('$constraint1', '255'));
        });
        it('should return error when title has more than 35 characters', () => {
            soleTraderDetails.title = validationUtils_1.generateString(36);
            soleTraderDetails.firstName = 'some name';
            soleTraderDetails.lastName = 'some name';
            let errors = validator.validateSync(soleTraderDetails);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.errorTooLong('Title').replace('$constraint1', '35'));
        });
        it('should return no error when business name is blank', () => {
            soleTraderDetails.businessName = '   ';
            soleTraderDetails.firstName = 'claimantName';
            soleTraderDetails.lastName = 'claimantName';
            soleTraderDetails.address = validAddress;
            let errors = validator.validateSync(soleTraderDetails);
            chai_1.expect(errors.length).to.equal(0);
        });
        it('should return error when business name has more than 255 character', () => {
            soleTraderDetails.businessName = validationUtils_1.generateString(256);
            soleTraderDetails.firstName = 'claimantName';
            soleTraderDetails.lastName = 'claimantName';
            soleTraderDetails.address = validAddress;
            let errors = validator.validateSync(soleTraderDetails);
            validationUtils_1.expectValidationError(errors, soleTraderDetails_1.ValidationErrors.ORGANISATION_NAME_TOO_LONG.replace('$constraint1', '35'));
        });
        describe('when "has correspondence address" flag is set to true', () => {
            beforeEach(() => {
                soleTraderDetails.address = validAddress;
                soleTraderDetails.hasCorrespondenceAddress = true;
                soleTraderDetails.firstName = 'claimantName';
                soleTraderDetails.lastName = 'claimantName';
                soleTraderDetails.businessName = 'test';
            });
            it('should return error when correspondence address is undefined', () => {
                soleTraderDetails.correspondenceAddress = undefined;
                let errors = validator.validateSync(soleTraderDetails);
                validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED);
            });
            it('should return errors when correspondence address required fields are missing', () => {
                let errors = validator.validateSync(soleTraderDetails);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.FIRST_LINE_REQUIRED);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.POSTCODE_REQUIRED);
            });
            it('should return no errors when correspondence address is provided', () => {
                soleTraderDetails.correspondenceAddress = validAddress;
                let result = validator.validateSync(soleTraderDetails);
                chai_1.expect(result.length).to.equal(0);
            });
        });
        describe('when "has correspondence address" flag is set to false', () => {
            it('should return no errors when correspondence address is not provided', () => {
                soleTraderDetails.address = validAddress;
                soleTraderDetails.hasCorrespondenceAddress = false;
                soleTraderDetails.firstName = 'claimantName';
                soleTraderDetails.lastName = 'claimantName';
                soleTraderDetails.businessName = 'test';
                let error = validator.validateSync(soleTraderDetails);
                chai_1.expect(error.length).to.equal(0);
            });
        });
    });
    describe('deserialize', () => {
        it('should return object initialized with default values when given undefined', () => {
            let deserialized = new soleTraderDetails_1.SoleTraderDetails().deserialize(undefined);
            chai_1.expect(deserialized.address).to.be.instanceOf(address_1.Address);
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(false);
            chai_1.expect(deserialized.correspondenceAddress).to.be.instanceOf(address_1.Address);
            chai_1.expect(deserialized.type).to.equal(partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value);
            chai_1.expect(deserialized.name).to.equal(undefined);
            chai_1.expect(deserialized.firstName).to.equal(undefined);
            chai_1.expect(deserialized.lastName).to.equal(undefined);
            chai_1.expect(deserialized.title).to.equal(undefined);
        });
        it('should return object with values set from provided input json', () => {
            let deserialized = new soleTraderDetails_1.SoleTraderDetails().deserialize(input);
            chai_1.expect(deserialized.address.line1).to.equal('first line');
            chai_1.expect(deserialized.address.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(true);
            chai_1.expect(deserialized.correspondenceAddress.line1).to.equal('another line');
            chai_1.expect(deserialized.correspondenceAddress.city).to.equal('some city');
            chai_1.expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.type).to.equal(partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value);
            chai_1.expect(deserialized.name).to.equal('claimantName claimantLastname');
            chai_1.expect(deserialized.firstName).to.equal('claimantName');
            chai_1.expect(deserialized.lastName).to.equal('claimantLastname');
            chai_1.expect(deserialized.title).to.equal(undefined);
        });
    });
    describe('form object deserialization', () => {
        it('should return undefined when input is undefined', () => {
            chai_1.expect(soleTraderDetails_1.SoleTraderDetails.fromObject(undefined)).to.equal(undefined);
        });
        it('should deserialize all fields', () => {
            let deserialized = soleTraderDetails_1.SoleTraderDetails.fromObject(formInput);
            chai_1.expect(deserialized.address.line1).to.equal('first line');
            chai_1.expect(deserialized.address.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(true);
            chai_1.expect(deserialized.correspondenceAddress.line1).to.equal('another line');
            chai_1.expect(deserialized.correspondenceAddress.city).to.equal('some city');
            chai_1.expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.type).to.equal(partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value);
            chai_1.expect(deserialized.name).to.equal('claimantName claimantLastname');
            chai_1.expect(deserialized.firstName).to.equal('claimantName');
            chai_1.expect(deserialized.lastName).to.equal('claimantLastname');
        });
        it('should set correspondence address to undefined if "has correspondence address flag is set to false"', () => {
            formInput.hasCorrespondenceAddress = 'false';
            let deserialized = soleTraderDetails_1.SoleTraderDetails.fromObject(formInput);
            chai_1.expect(deserialized.correspondenceAddress).to.equal(undefined);
        });
    });
    describe('isCompleted', () => {
        let soleTraderDetails;
        beforeEach(() => {
            soleTraderDetails = new soleTraderDetails_1.SoleTraderDetails();
            soleTraderDetails.businessName = '';
        });
        it('should return false when address is undefined', () => {
            soleTraderDetails.address = undefined;
            chai_1.expect(soleTraderDetails.isCompleted()).to.equal(false);
        });
        it('should return false when address is not completed', () => {
            soleTraderDetails.address = new address_1.Address();
            chai_1.expect(soleTraderDetails.isCompleted()).to.equal(false);
        });
        it('should return true when address is completed and does not have correspondence address', () => {
            soleTraderDetails.address = validAddress;
            soleTraderDetails.hasCorrespondenceAddress = false;
            soleTraderDetails.firstName = 'claimantName';
            soleTraderDetails.lastName = 'claimantName';
            chai_1.expect(soleTraderDetails.isCompleted()).to.equal(true);
        });
        it('should return false when has correspondence address and correspondence address is undefined', () => {
            soleTraderDetails.address = validAddress;
            soleTraderDetails.hasCorrespondenceAddress = true;
            soleTraderDetails.correspondenceAddress = undefined;
            chai_1.expect(soleTraderDetails.isCompleted()).to.equal(false);
        });
        it('should return false when has name is undefined and first name is undefined', () => {
            soleTraderDetails.address = validAddress;
            soleTraderDetails.name = undefined;
            soleTraderDetails.firstName = undefined;
            soleTraderDetails.lastName = 'McCoffee';
            soleTraderDetails.businessName = 'business';
            soleTraderDetails.hasCorrespondenceAddress = true;
            soleTraderDetails.correspondenceAddress = validAddress;
            chai_1.expect(soleTraderDetails.isCompleted('defendant')).to.equal(false);
        });
        it('should return false when has name is undefined and last name is undefined', () => {
            soleTraderDetails.address = validAddress;
            soleTraderDetails.name = undefined;
            soleTraderDetails.firstName = 'Coffee';
            soleTraderDetails.lastName = undefined;
            soleTraderDetails.businessName = 'business';
            soleTraderDetails.hasCorrespondenceAddress = true;
            soleTraderDetails.correspondenceAddress = validAddress;
            chai_1.expect(soleTraderDetails.isCompleted('defendant')).to.equal(false);
        });
        it('should return false when has name is undefined and first and last name are undefined', () => {
            soleTraderDetails.address = validAddress;
            soleTraderDetails.name = undefined;
            soleTraderDetails.firstName = undefined;
            soleTraderDetails.lastName = undefined;
            soleTraderDetails.businessName = 'business';
            soleTraderDetails.hasCorrespondenceAddress = true;
            soleTraderDetails.correspondenceAddress = validAddress;
            chai_1.expect(soleTraderDetails.isCompleted()).to.equal(false);
        });
        it('should return false when has correspondence address and correspondence address is not completed', () => {
            soleTraderDetails.address = validAddress;
            soleTraderDetails.hasCorrespondenceAddress = true;
            soleTraderDetails.correspondenceAddress = new address_1.Address();
            chai_1.expect(soleTraderDetails.isCompleted()).to.equal(false);
        });
        it('should return true when all the required fields are completed', () => {
            soleTraderDetails.address = validAddress;
            soleTraderDetails.firstName = 'claimantName';
            soleTraderDetails.lastName = 'claimantName';
            soleTraderDetails.hasCorrespondenceAddress = true;
            soleTraderDetails.correspondenceAddress = validAddress;
            chai_1.expect(soleTraderDetails.isCompleted()).to.equal(true);
        });
    });
});
