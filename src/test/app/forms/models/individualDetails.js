"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dateOfBirth_1 = require("forms/models/dateOfBirth");
const individualDetails_1 = require("forms/models/individualDetails");
const partyDetails_1 = require("forms/models/partyDetails");
const partyType_1 = require("common/partyType");
const address_1 = require("forms/models/address");
const correspondenceAddress_1 = require("forms/models/correspondenceAddress");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const localDate_1 = require("forms/models/localDate");
const splitNamedPartyDetails_1 = require("forms/models/splitNamedPartyDetails");
const validAddress = new address_1.Address('line1', 'line2', 'line3', 'city', 'bb127nq');
describe('IndividualDetails', () => {
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
            name: 'claimantName',
            title: 'Mr.',
            firstName: 'Coffee',
            lastName: 'McCoffee',
            dateOfBirth: {
                known: 'true',
                date: {
                    year: 2017,
                    month: 12,
                    day: 31
                }
            }
        };
        formInput = Object.assign(Object.assign({}, input), { hasCorrespondenceAddress: 'true' });
    });
    describe('constructor', () => {
        it('should initialise fields with defaults', () => {
            let individualDetails = new individualDetails_1.IndividualDetails();
            chai_1.expect(individualDetails.address).to.be.instanceOf(address_1.Address);
            chai_1.expect(individualDetails.correspondenceAddress).to.be.instanceOf(address_1.Address);
            chai_1.expect(individualDetails.type).to.equal(partyType_1.PartyType.INDIVIDUAL.value);
            chai_1.expect(individualDetails.name).to.equal(undefined);
            chai_1.expect(individualDetails.firstName).to.equal(undefined);
            chai_1.expect(individualDetails.lastName).to.equal(undefined);
            chai_1.expect(individualDetails.dateOfBirth).to.equal(undefined);
            chai_1.expect(individualDetails.hasCorrespondenceAddress).to.equal(false);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        let individualDetails;
        beforeEach(() => {
            individualDetails = new individualDetails_1.IndividualDetails();
        });
        it('should return error when address is undefined', () => {
            individualDetails.address = undefined;
            let errors = validator.validateSync(individualDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.ADDRESS_REQUIRED);
        });
        it('should return errors when required address fields are missing', () => {
            let errors = validator.validateSync(individualDetails);
            validationUtils_1.expectValidationError(errors, address_1.ValidationErrors.FIRST_LINE_REQUIRED);
            validationUtils_1.expectValidationError(errors, address_1.ValidationErrors.POSTCODE_REQUIRED);
        });
        it('should return error when name is undefined if firstName and lastName are undefined', () => {
            individualDetails.name = undefined;
            individualDetails.firstName = undefined;
            individualDetails.lastName = undefined;
            let errors = validator.validateSync(individualDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should return error when name is blank if firstName and lastName are undefined', () => {
            individualDetails.name = '  ';
            individualDetails.firstName = undefined;
            individualDetails.lastName = undefined;
            let errors = validator.validateSync(individualDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should return error when name has more than 255 character if firstName and lastName are undefined', () => {
            individualDetails.name = validationUtils_1.generateString(256);
            individualDetails.firstName = undefined;
            individualDetails.lastName = undefined;
            let errors = validator.validateSync(individualDetails);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.errorTooLong('Name').replace('$constraint1', '255'));
        });
        it('should return error when firstName is undefined if name is undefined', () => {
            individualDetails.name = undefined;
            individualDetails.firstName = undefined;
            individualDetails.lastName = 'some name';
            let errors = validator.validateSync(individualDetails, { groups: ['defendant'] });
            validationUtils_1.expectValidationErrorNotPresent(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.FIRSTNAME_REQUIRED);
            validationUtils_1.expectValidationErrorNotPresent(errors, splitNamedPartyDetails_1.ValidationErrors.LASTNAME_REQUIRED);
        });
        it('should return error when firstName is blank if name is undefined', () => {
            individualDetails.name = undefined;
            individualDetails.firstName = '  ';
            individualDetails.lastName = 'some name';
            let errors = validator.validateSync(individualDetails);
            validationUtils_1.expectValidationErrorNotPresent(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.FIRSTNAME_REQUIRED);
            validationUtils_1.expectValidationErrorNotPresent(errors, splitNamedPartyDetails_1.ValidationErrors.LASTNAME_REQUIRED);
        });
        it('should return error when firstName has more than 255 characters if name is undefined', () => {
            individualDetails.name = undefined;
            individualDetails.firstName = validationUtils_1.generateString(256);
            individualDetails.lastName = 'some name';
            let errors = validator.validateSync(individualDetails);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.errorTooLong('First name').replace('$constraint1', '255'));
        });
        it('should return error when lastName is undefined if name is undefined', () => {
            individualDetails.name = undefined;
            individualDetails.firstName = 'some name';
            individualDetails.lastName = undefined;
            let errors = validator.validateSync(individualDetails, { groups: ['defendant'] });
            validationUtils_1.expectValidationErrorNotPresent(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
            validationUtils_1.expectValidationErrorNotPresent(errors, splitNamedPartyDetails_1.ValidationErrors.FIRSTNAME_REQUIRED);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.LASTNAME_REQUIRED);
        });
        it('should return error when lastName is blank if name is undefined', () => {
            individualDetails.name = undefined;
            individualDetails.firstName = 'some name';
            individualDetails.lastName = '  ';
            let errors = validator.validateSync(individualDetails);
            validationUtils_1.expectValidationErrorNotPresent(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
            validationUtils_1.expectValidationErrorNotPresent(errors, splitNamedPartyDetails_1.ValidationErrors.FIRSTNAME_REQUIRED);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.LASTNAME_REQUIRED);
        });
        it('should return error when lastName has more than 255 character if name is undefined', () => {
            individualDetails.name = undefined;
            individualDetails.firstName = 'some name';
            individualDetails.lastName = validationUtils_1.generateString(256);
            let errors = validator.validateSync(individualDetails);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.errorTooLong('Last name').replace('$constraint1', '255'));
        });
        it('should return error when title has more than 35 characters', () => {
            individualDetails.title = validationUtils_1.generateString(36);
            individualDetails.firstName = 'some name';
            individualDetails.lastName = 'some name';
            let errors = validator.validateSync(individualDetails);
            validationUtils_1.expectValidationError(errors, splitNamedPartyDetails_1.ValidationErrors.errorTooLong('Title').replace('$constraint1', '35'));
        });
        it('should return error when dataOfBirth is undefined', () => {
            individualDetails.dateOfBirth = undefined;
            let errors = validator.validateSync(individualDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should return error when dataOfBirth is null', () => {
            individualDetails.dateOfBirth = null;
            let errors = validator.validateSync(individualDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.NAME_REQUIRED);
        });
        describe('when "has correspondence address" flag is set to true', () => {
            beforeEach(() => {
                individualDetails.address = validAddress;
                individualDetails.hasCorrespondenceAddress = true;
                individualDetails.firstName = 'Coffee';
                individualDetails.lastName = 'McCoffee';
                individualDetails.dateOfBirth = new dateOfBirth_1.DateOfBirth();
            });
            it('should return error when correspondence address is undefined', () => {
                individualDetails.correspondenceAddress = undefined;
                let errors = validator.validateSync(individualDetails);
                validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED);
            });
            it('should return errors when correspondence address required fields are missing', () => {
                let errors = validator.validateSync(individualDetails);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.FIRST_LINE_REQUIRED);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.POSTCODE_REQUIRED);
            });
            it('should return no errors when correspondence address is provided', () => {
                individualDetails.correspondenceAddress = validAddress;
                chai_1.expect(validator.validateSync(individualDetails).length).to.equal(0);
            });
        });
        describe('when "has correspondence address" flag is set to false', () => {
            it('should return no errors when correspondence address is not provided', () => {
                individualDetails.address = validAddress;
                individualDetails.hasCorrespondenceAddress = false;
                individualDetails.firstName = 'ClaimantName';
                individualDetails.lastName = 'ClaimantName';
                let error = validator.validateSync(individualDetails);
                chai_1.expect(error.length).to.equal(0);
            });
        });
    });
    describe('deserialize', () => {
        it('should return object initialized with default values when given undefined', () => {
            let deserialized = new individualDetails_1.IndividualDetails().deserialize(undefined);
            chai_1.expect(deserialized.address).to.be.instanceOf(address_1.Address);
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(false);
            chai_1.expect(deserialized.correspondenceAddress).to.be.instanceOf(address_1.Address);
            chai_1.expect(deserialized.type).to.equal(partyType_1.PartyType.INDIVIDUAL.value);
            chai_1.expect(deserialized.name).to.equal(undefined);
            chai_1.expect(deserialized.title).to.equal(undefined);
            chai_1.expect(deserialized.firstName).to.equal(undefined);
            chai_1.expect(deserialized.lastName).to.equal(undefined);
            chai_1.expect(deserialized.dateOfBirth).to.equal(undefined);
        });
        it('should return object with values set from provided input json', () => {
            let deserialized = new individualDetails_1.IndividualDetails().deserialize(input);
            chai_1.expect(deserialized.address.line1).to.equal('first line');
            chai_1.expect(deserialized.address.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(true);
            chai_1.expect(deserialized.correspondenceAddress.line1).to.equal('another line');
            chai_1.expect(deserialized.correspondenceAddress.city).to.equal('some city');
            chai_1.expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.type).to.equal(partyType_1.PartyType.INDIVIDUAL.value);
            chai_1.expect(deserialized.name).to.equal('Mr. Coffee McCoffee');
            chai_1.expect(deserialized.title).to.equal('Mr.');
            chai_1.expect(deserialized.firstName).to.equal('Coffee');
            chai_1.expect(deserialized.lastName).to.equal('McCoffee');
            chai_1.expect(deserialized.dateOfBirth.date.day).to.equal(31);
            chai_1.expect(deserialized.dateOfBirth.date.month).to.equal(12);
            chai_1.expect(deserialized.dateOfBirth.date.year).to.equal(2017);
        });
    });
    describe('form object deserialization', () => {
        it('should return undefined when input is undefined', () => {
            chai_1.expect(individualDetails_1.IndividualDetails.fromObject(undefined)).to.equal(undefined);
        });
        it('should deserialize all fields', () => {
            formInput.title = 'Mr.';
            let deserialized = individualDetails_1.IndividualDetails.fromObject(formInput);
            chai_1.expect(deserialized.address.line1).to.equal('first line');
            chai_1.expect(deserialized.address.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(true);
            chai_1.expect(deserialized.correspondenceAddress.line1).to.equal('another line');
            chai_1.expect(deserialized.correspondenceAddress.city).to.equal('some city');
            chai_1.expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.type).to.equal(partyType_1.PartyType.INDIVIDUAL.value);
            chai_1.expect(deserialized.name).to.equal('Mr. Coffee McCoffee');
            chai_1.expect(deserialized.title).to.equal('Mr.');
            chai_1.expect(deserialized.firstName).to.equal('Coffee');
            chai_1.expect(deserialized.lastName).to.equal('McCoffee');
            chai_1.expect(deserialized.dateOfBirth.date.day).to.equal(31);
            chai_1.expect(deserialized.dateOfBirth.date.month).to.equal(12);
            chai_1.expect(deserialized.dateOfBirth.date.year).to.equal(2017);
        });
        it('should set correspondence address to undefined if "has correspondence address flag is set to false"', () => {
            formInput.hasCorrespondenceAddress = 'false';
            let deserialized = individualDetails_1.IndividualDetails.fromObject(formInput);
            chai_1.expect(deserialized.correspondenceAddress).to.equal(undefined);
        });
    });
    describe('isCompleted', () => {
        let individualDetails;
        beforeEach(() => {
            individualDetails = new individualDetails_1.IndividualDetails();
        });
        it('should return false when address is undefined', () => {
            individualDetails.address = undefined;
            chai_1.expect(individualDetails.isCompleted()).to.equal(false);
        });
        it('should return false when address is not completed', () => {
            individualDetails.address = new address_1.Address();
            chai_1.expect(individualDetails.isCompleted()).to.equal(false);
        });
        it('should return true when address is completed and does not have correspondence address', () => {
            individualDetails.address = validAddress;
            individualDetails.hasCorrespondenceAddress = false;
            individualDetails.firstName = 'claimantName';
            individualDetails.lastName = 'claimantName';
            individualDetails.dateOfBirth = new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(2007, 1, 1));
            chai_1.expect(individualDetails.isCompleted()).to.equal(true);
        });
        it('should return false when has correspondence address and correspondence address is undefined', () => {
            individualDetails.address = validAddress;
            individualDetails.hasCorrespondenceAddress = true;
            individualDetails.correspondenceAddress = undefined;
            chai_1.expect(individualDetails.isCompleted()).to.equal(false);
        });
        it('should return false when has name is undefined', () => {
            individualDetails.address = validAddress;
            individualDetails.name = undefined;
            individualDetails.firstName = undefined;
            individualDetails.lastName = undefined;
            individualDetails.dateOfBirth = new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(2007, 1, 1));
            individualDetails.hasCorrespondenceAddress = true;
            individualDetails.correspondenceAddress = validAddress;
            chai_1.expect(individualDetails.isCompleted()).to.equal(false);
        });
        it('should return false when has name is undefined and first name is undefined', () => {
            individualDetails.address = validAddress;
            individualDetails.name = undefined;
            individualDetails.firstName = undefined;
            individualDetails.lastName = 'McCoffee';
            individualDetails.dateOfBirth = new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(2007, 1, 1));
            individualDetails.hasCorrespondenceAddress = true;
            individualDetails.correspondenceAddress = validAddress;
            chai_1.expect(individualDetails.isCompleted('defendant')).to.equal(false);
        });
        it('should return false when has name is undefined and last name is undefined', () => {
            individualDetails.address = validAddress;
            individualDetails.name = undefined;
            individualDetails.firstName = 'Coffee';
            individualDetails.lastName = undefined;
            individualDetails.dateOfBirth = new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(2007, 1, 1));
            individualDetails.hasCorrespondenceAddress = true;
            individualDetails.correspondenceAddress = validAddress;
            chai_1.expect(individualDetails.isCompleted('defendant')).to.equal(false);
        });
        it('should return false when has name is undefined and first and last name are undefined', () => {
            individualDetails.address = validAddress;
            individualDetails.name = undefined;
            individualDetails.firstName = undefined;
            individualDetails.lastName = undefined;
            individualDetails.dateOfBirth = new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(2007, 1, 1));
            individualDetails.hasCorrespondenceAddress = true;
            individualDetails.correspondenceAddress = validAddress;
            chai_1.expect(individualDetails.isCompleted()).to.equal(false);
        });
        it('should return false when has dateOfBirth is undefined', () => {
            individualDetails.address = validAddress;
            individualDetails.name = 'claimantName';
            individualDetails.dateOfBirth = undefined;
            individualDetails.hasCorrespondenceAddress = true;
            individualDetails.correspondenceAddress = validAddress;
            chai_1.expect(individualDetails.isCompleted('claimant')).to.equal(false);
        });
        it('should return false when has correspondence address and correspondence address is not completed', () => {
            individualDetails.address = validAddress;
            individualDetails.hasCorrespondenceAddress = true;
            individualDetails.correspondenceAddress = new address_1.Address();
            chai_1.expect(individualDetails.isCompleted()).to.equal(false);
        });
        it('should return true when all the required fields are completed', () => {
            individualDetails.address = validAddress;
            individualDetails.name = 'claimantName';
            individualDetails.firstName = 'claimantName';
            individualDetails.lastName = 'claimantName';
            individualDetails.dateOfBirth = new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(2007, 1, 1));
            individualDetails.hasCorrespondenceAddress = true;
            individualDetails.correspondenceAddress = validAddress;
            chai_1.expect(individualDetails.isCompleted()).to.equal(true);
        });
    });
});
