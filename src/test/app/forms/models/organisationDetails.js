"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const organisationDetails_1 = require("forms/models/organisationDetails");
const partyDetails_1 = require("forms/models/partyDetails");
const partyType_1 = require("common/partyType");
const address_1 = require("forms/models/address");
const correspondenceAddress_1 = require("forms/models/correspondenceAddress");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validAddress = new address_1.Address('line1', 'line2', 'line3', 'city', 'bb127nq');
describe('OrganisationDetails', () => {
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
            name: 'claimantName'
        };
        formInput = Object.assign(Object.assign({}, input), { hasCorrespondenceAddress: 'true' });
    });
    describe('constructor', () => {
        it('should initialise fields with defaults', () => {
            let organisationDetails = new organisationDetails_1.OrganisationDetails();
            chai_1.expect(organisationDetails.address).to.be.instanceOf(address_1.Address);
            chai_1.expect(organisationDetails.correspondenceAddress).to.be.instanceOf(address_1.Address);
            chai_1.expect(organisationDetails.type).to.equal(partyType_1.PartyType.ORGANISATION.value);
            chai_1.expect(organisationDetails.name).to.equal(undefined);
            chai_1.expect(organisationDetails.hasCorrespondenceAddress).to.equal(false);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        let organisationDetails;
        beforeEach(() => {
            organisationDetails = new organisationDetails_1.OrganisationDetails();
        });
        it('should return error when address is undefined', () => {
            organisationDetails.address = undefined;
            let errors = validator.validateSync(organisationDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.ADDRESS_REQUIRED);
        });
        it('should return errors when required address fields are missing', () => {
            let errors = validator.validateSync(organisationDetails);
            validationUtils_1.expectValidationError(errors, address_1.ValidationErrors.FIRST_LINE_REQUIRED);
            validationUtils_1.expectValidationError(errors, address_1.ValidationErrors.POSTCODE_REQUIRED);
        });
        it('should return error when company name is undefined', () => {
            organisationDetails.name = undefined;
            let errors = validator.validateSync(organisationDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should return error when company name is blank', () => {
            organisationDetails.name = '  ';
            let errors = validator.validateSync(organisationDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should return error when company name got more than 255 character', () => {
            organisationDetails.name = validationUtils_1.generateString(256);
            organisationDetails.contactPerson = 'contactPerson';
            organisationDetails.address = validAddress;
            let errors = validator.validateSync(organisationDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.NAME_TOO_LONG.replace('$constraint1', '255'));
        });
        it('should return error when contact person got more than max length', () => {
            organisationDetails.contactPerson = validationUtils_1.generateString(organisationDetails_1.ValidationConstraints.CONTACT_PERSON_MAX_LENGTH + 1);
            organisationDetails.name = 'claimantPerson';
            organisationDetails.address = validAddress;
            let errors = validator.validateSync(organisationDetails);
            validationUtils_1.expectValidationError(errors, organisationDetails_1.ValidationErrors.CONTACT_PERSON_NAME_TOO_LONG.replace('$constraint1', '30'));
        });
        describe('when "has correspondence address" flag is set to true', () => {
            beforeEach(() => {
                organisationDetails.address = validAddress;
                organisationDetails.hasCorrespondenceAddress = true;
                organisationDetails.contactPerson = 'ClaimantName';
                organisationDetails.name = 'test';
            });
            it('should return error when correspondence address is undefined', () => {
                organisationDetails.correspondenceAddress = undefined;
                let errors = validator.validateSync(organisationDetails);
                validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED);
            });
            it('should return errors when correspondence address required fields are missing', () => {
                let errors = validator.validateSync(organisationDetails);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.FIRST_LINE_REQUIRED);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.POSTCODE_REQUIRED);
            });
            it('should return no errors when correspondence address is provided', () => {
                organisationDetails.correspondenceAddress = validAddress;
                let result = validator.validateSync(organisationDetails);
                chai_1.expect(result.length).to.equal(0);
            });
        });
        describe('when "has correspondence address" flag is set to false', () => {
            it('should return no errors when correspondence address is not provided', () => {
                organisationDetails.address = validAddress;
                organisationDetails.hasCorrespondenceAddress = false;
                organisationDetails.contactPerson = 'ClaimantName';
                organisationDetails.name = 'test';
                let error = validator.validateSync(organisationDetails);
                chai_1.expect(error.length).to.equal(0);
            });
        });
    });
    describe('deserialize', () => {
        it('should return object initialized with default values when given undefined', () => {
            let deserialized = new organisationDetails_1.OrganisationDetails().deserialize(undefined);
            chai_1.expect(deserialized.address).to.be.instanceOf(address_1.Address);
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(false);
            chai_1.expect(deserialized.correspondenceAddress).to.be.instanceOf(address_1.Address);
            chai_1.expect(deserialized.type).to.equal(partyType_1.PartyType.ORGANISATION.value);
            chai_1.expect(deserialized.name).to.equal(undefined);
        });
        it('should return object with values set from provided input json', () => {
            let deserialized = new organisationDetails_1.OrganisationDetails().deserialize(input);
            chai_1.expect(deserialized.address.line1).to.equal('first line');
            chai_1.expect(deserialized.address.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(true);
            chai_1.expect(deserialized.correspondenceAddress.line1).to.equal('another line');
            chai_1.expect(deserialized.correspondenceAddress.city).to.equal('some city');
            chai_1.expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.type).to.equal(partyType_1.PartyType.ORGANISATION.value);
            chai_1.expect(deserialized.name).to.equal('claimantName');
        });
    });
    describe('form object deserialization', () => {
        it('should return undefined when input is undefined', () => {
            chai_1.expect(organisationDetails_1.OrganisationDetails.fromObject(undefined)).to.equal(undefined);
        });
        it('should deserialize all fields', () => {
            let deserialized = organisationDetails_1.OrganisationDetails.fromObject(formInput);
            chai_1.expect(deserialized.address.line1).to.equal('first line');
            chai_1.expect(deserialized.address.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(true);
            chai_1.expect(deserialized.correspondenceAddress.line1).to.equal('another line');
            chai_1.expect(deserialized.correspondenceAddress.city).to.equal('some city');
            chai_1.expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.type).to.equal(partyType_1.PartyType.ORGANISATION.value);
            chai_1.expect(deserialized.name).to.equal('claimantName');
        });
        it('should set correspondence address to undefined if "has correspondence address flag is set to false"', () => {
            formInput.hasCorrespondenceAddress = 'false';
            let deserialized = organisationDetails_1.OrganisationDetails.fromObject(formInput);
            chai_1.expect(deserialized.correspondenceAddress).to.equal(undefined);
        });
    });
    describe('isCompleted', () => {
        let organisationDetails;
        beforeEach(() => {
            organisationDetails = new organisationDetails_1.OrganisationDetails();
        });
        it('should return false when address is undefined', () => {
            organisationDetails.address = undefined;
            chai_1.expect(organisationDetails.isCompleted()).to.equal(false);
        });
        it('should return false when address is not completed', () => {
            organisationDetails.address = new address_1.Address();
            chai_1.expect(organisationDetails.isCompleted()).to.equal(false);
        });
        it('should return true when address is completed and does not have correspondence address', () => {
            organisationDetails.address = validAddress;
            organisationDetails.hasCorrespondenceAddress = false;
            organisationDetails.name = 'claimantName';
            organisationDetails.contactPerson = 'contactPerson';
            chai_1.expect(organisationDetails.isCompleted()).to.equal(true);
        });
        it('should return false when has correspondence address and correspondence address is undefined', () => {
            organisationDetails.address = validAddress;
            organisationDetails.hasCorrespondenceAddress = true;
            organisationDetails.correspondenceAddress = undefined;
            chai_1.expect(organisationDetails.isCompleted()).to.equal(false);
        });
        it('should return false when has name is undefined', () => {
            organisationDetails.address = validAddress;
            organisationDetails.name = undefined;
            organisationDetails.hasCorrespondenceAddress = true;
            organisationDetails.correspondenceAddress = validAddress;
            chai_1.expect(organisationDetails.isCompleted()).to.equal(false);
        });
        it('should return false when has correspondence address and correspondence address is not completed', () => {
            organisationDetails.address = validAddress;
            organisationDetails.hasCorrespondenceAddress = true;
            organisationDetails.correspondenceAddress = new address_1.Address();
            chai_1.expect(organisationDetails.isCompleted()).to.equal(false);
        });
        it('should return true when all the required fields are completed', () => {
            organisationDetails.address = validAddress;
            organisationDetails.name = 'claimantName';
            organisationDetails.contactPerson = 'contactPerson';
            organisationDetails.hasCorrespondenceAddress = true;
            organisationDetails.correspondenceAddress = validAddress;
            chai_1.expect(organisationDetails.isCompleted()).to.equal(true);
        });
    });
});
