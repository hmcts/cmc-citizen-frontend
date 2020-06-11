"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const partyDetails_1 = require("forms/models/partyDetails");
const address_1 = require("forms/models/address");
const correspondenceAddress_1 = require("forms/models/correspondenceAddress");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validAddress = new address_1.Address('line1', 'line2', 'line3', 'city', 'bb127nq');
describe('PartyDetails', () => {
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
            }
        };
        formInput = Object.assign(Object.assign({}, input), { hasCorrespondenceAddress: 'true' });
    });
    describe('constructor', () => {
        it('should initialise object fields with new instances', () => {
            let partyDetails = new partyDetails_1.PartyDetails();
            chai_1.expect(partyDetails.address).to.be.instanceOf(address_1.Address);
            chai_1.expect(partyDetails.correspondenceAddress).to.be.instanceOf(address_1.Address);
        });
        it('should initialise hasCorrespondenceAddress to false by default', () => {
            let partyDetails = new partyDetails_1.PartyDetails();
            chai_1.expect(partyDetails.hasCorrespondenceAddress).to.equal(false);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        let partyDetails;
        beforeEach(() => {
            partyDetails = new partyDetails_1.PartyDetails();
        });
        it('should return error when address is undefined', () => {
            partyDetails.address = undefined;
            let errors = validator.validateSync(partyDetails);
            validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.ADDRESS_REQUIRED);
        });
        it('should return errors when required address fields are missing', () => {
            let errors = validator.validateSync(partyDetails);
            validationUtils_1.expectValidationError(errors, address_1.ValidationErrors.FIRST_LINE_REQUIRED);
            validationUtils_1.expectValidationError(errors, address_1.ValidationErrors.CITY_REQUIRED);
            validationUtils_1.expectValidationError(errors, address_1.ValidationErrors.POSTCODE_REQUIRED);
        });
        describe('when "has correspondence address" flag is set to true', () => {
            beforeEach(() => {
                partyDetails.address = validAddress;
                partyDetails.hasCorrespondenceAddress = true;
            });
            it('should return error when correspondence address is undefined', () => {
                partyDetails.correspondenceAddress = undefined;
                let errors = validator.validateSync(partyDetails);
                validationUtils_1.expectValidationError(errors, partyDetails_1.ValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED);
            });
            it('should return errors when correspondence address required fields are missing', () => {
                let errors = validator.validateSync(partyDetails);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.FIRST_LINE_REQUIRED);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.CITY_REQUIRED);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.POSTCODE_REQUIRED);
            });
            it('should return errors when correspondence address fields have too long values', () => {
                let errors = validator.validateSync(partyDetails);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.FIRST_LINE_REQUIRED);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.CITY_REQUIRED);
                validationUtils_1.expectValidationError(errors, correspondenceAddress_1.ValidationErrors.POSTCODE_REQUIRED);
            });
            it('should return no errors when correspondence address is provided', () => {
                partyDetails.correspondenceAddress = validAddress;
                partyDetails.name = 'claimantName';
                chai_1.expect(validator.validateSync(partyDetails).length).to.equal(0);
            });
        });
        describe('when "has correspondence address" flag is set to false', () => {
            it('should return no errors when correspondence address is not provided', () => {
                partyDetails.address = validAddress;
                partyDetails.hasCorrespondenceAddress = false;
                partyDetails.name = 'claimantName';
                chai_1.expect(validator.validateSync(partyDetails).length).to.equal(0);
            });
        });
    });
    describe('deserialize', () => {
        it('should return object initialized with default values when given undefined', () => {
            let deserialized = new partyDetails_1.PartyDetails().deserialize(undefined);
            chai_1.expect(deserialized.address).to.be.instanceOf(address_1.Address);
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(false);
            chai_1.expect(deserialized.correspondenceAddress).to.be.instanceOf(address_1.Address);
        });
        it('should return object with values set from provided input json', () => {
            let deserialized = new partyDetails_1.PartyDetails().deserialize(input);
            chai_1.expect(deserialized.address.line1).to.equal('first line');
            chai_1.expect(deserialized.address.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(true);
            chai_1.expect(deserialized.correspondenceAddress.line1).to.equal('another line');
            chai_1.expect(deserialized.correspondenceAddress.city).to.equal('some city');
            chai_1.expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq');
        });
    });
    describe('form object deserialization', () => {
        it('should return undefined when input is undefined', () => {
            chai_1.expect(partyDetails_1.PartyDetails.fromObject(undefined)).to.equal(undefined);
        });
        it('should deserialize all fields', () => {
            let deserialized = partyDetails_1.PartyDetails.fromObject(formInput);
            chai_1.expect(deserialized.address.line1).to.equal('first line');
            chai_1.expect(deserialized.address.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.hasCorrespondenceAddress).to.equal(true);
            chai_1.expect(deserialized.correspondenceAddress.line1).to.equal('another line');
            chai_1.expect(deserialized.correspondenceAddress.city).to.equal('some city');
            chai_1.expect(deserialized.correspondenceAddress.postcode).to.equal('bb127nq');
            chai_1.expect(deserialized.type).to.equal(undefined);
        });
        it('should set correspondence address to undefined if "has correspondence address flag is set to false"', () => {
            formInput.hasCorrespondenceAddress = 'false';
            let deserialized = partyDetails_1.PartyDetails.fromObject(formInput);
            chai_1.expect(deserialized.correspondenceAddress).to.equal(undefined);
        });
    });
    describe('isCompleted', () => {
        let partyDetails;
        beforeEach(() => {
            partyDetails = new partyDetails_1.PartyDetails();
        });
        it('should return false when address is undefined', () => {
            partyDetails.address = undefined;
            chai_1.expect(partyDetails.isCompleted()).to.equal(false);
        });
        it('should return false when address is not completed', () => {
            partyDetails.address = new address_1.Address();
            chai_1.expect(partyDetails.isCompleted()).to.equal(false);
        });
        it('should return true when address is completed and does not have correspondence address', () => {
            partyDetails.address = validAddress;
            partyDetails.hasCorrespondenceAddress = false;
            partyDetails.name = 'claimantName';
            chai_1.expect(partyDetails.isCompleted()).to.equal(true);
        });
        it('should return false when has correspondence address and correspondence address is undefined', () => {
            partyDetails.address = validAddress;
            partyDetails.hasCorrespondenceAddress = true;
            partyDetails.correspondenceAddress = undefined;
            chai_1.expect(partyDetails.isCompleted()).to.equal(false);
        });
        it('should return false when has correspondence address and correspondence address is not completed', () => {
            partyDetails.address = validAddress;
            partyDetails.hasCorrespondenceAddress = true;
            partyDetails.correspondenceAddress = new address_1.Address();
            chai_1.expect(partyDetails.isCompleted()).to.equal(false);
        });
        it('should return true when has correspondence address and correspondence address is completed', () => {
            partyDetails.address = validAddress;
            partyDetails.hasCorrespondenceAddress = true;
            partyDetails.correspondenceAddress = validAddress;
            partyDetails.name = 'claimantName';
            chai_1.expect(partyDetails.isCompleted()).to.equal(true);
        });
    });
});
