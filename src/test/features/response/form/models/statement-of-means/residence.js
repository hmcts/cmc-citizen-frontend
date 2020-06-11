"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const residence_1 = require("response/form/models/statement-of-means/residence");
const residenceType_1 = require("response/form/models/statement-of-means/residenceType");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const validationConstraints_1 = require("forms/validation/validationConstraints");
describe('Residence', () => {
    context('draft object deserialisation', () => {
        it('should return an instance with blank fields when given undefined', () => {
            const residence = new residence_1.Residence().deserialize(undefined);
            chai_1.expect(residence.type).to.be.undefined;
            chai_1.expect(residence.housingDetails).to.be.undefined;
        });
        it('should return with given values when given an object', () => {
            const residence = new residence_1.Residence().deserialize({
                type: residenceType_1.ResidenceType.OTHER,
                housingDetails: 'Squat'
            });
            chai_1.expect(residence.type.value).to.equal(residenceType_1.ResidenceType.OTHER.value);
            chai_1.expect(residence.housingDetails).to.equal('Squat');
        });
    });
    context('form object deserialisation', () => {
        it('should return undefined if given undefined', () => {
            chai_1.expect(residence_1.Residence.fromObject(undefined)).to.be.undefined;
        });
        it('should return instance with fields set to undefined if given empty object', () => {
            const residence = residence_1.Residence.fromObject({});
            chai_1.expect(residence.type).to.be.undefined;
            chai_1.expect(residence.housingDetails).to.be.undefined;
        });
        it('should return Residence instance build based on given form input', () => {
            const residence = residence_1.Residence.fromObject({
                type: 'OTHER',
                housingDetails: 'Squat'
            });
            chai_1.expect(residence.type.value).to.equal(residenceType_1.ResidenceType.OTHER.value);
            chai_1.expect(residence.housingDetails).to.equal('Squat');
        });
        it('should set housingDetails to undefined if type different to OTHER is provided', () => {
            const residence = residence_1.Residence.fromObject({
                type: 'OWN_HOME',
                otherTypeDetails: 'Some details'
            });
            chai_1.expect(residence.housingDetails).to.be.undefined;
        });
    });
    context('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should have no validation errors when the object is valid', () => {
            const errors = validator.validateSync(new residence_1.Residence(residenceType_1.ResidenceType.OTHER, 'Some description'));
            chai_1.expect(errors).to.be.empty;
        });
        it('should have an error when residence type is not provided', () => {
            const errors = validator.validateSync(new residence_1.Residence());
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.SELECT_AN_OPTION);
        });
        it('should have an error when unknown residence type is provided', () => {
            const errors = validator.validateSync(new residence_1.Residence(new residenceType_1.ResidenceType('whoa', 'Whoa!')));
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.SELECT_AN_OPTION);
        });
        it('should have an error when type is OTHER and housing details are not provided', () => {
            const errors = validator.validateSync(new residence_1.Residence(residenceType_1.ResidenceType.OTHER));
            validationUtils_1.expectValidationError(errors, residence_1.ValidationErrors.DESCRIBE_YOUR_HOUSING);
        });
        it('should have an error when type is OTHER and housing details are is blank', () => {
            const errors = validator.validateSync(new residence_1.Residence(residenceType_1.ResidenceType.OTHER, ''));
            validationUtils_1.expectValidationError(errors, residence_1.ValidationErrors.DESCRIBE_YOUR_HOUSING);
        });
        it('should have an error when provided details are too long', () => {
            const errors = validator.validateSync(new residence_1.Residence(residenceType_1.ResidenceType.OTHER, validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)));
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
        });
        it('should not validate housing details when type is not OTHER', () => {
            const errors = validator.validateSync(new residence_1.Residence(residenceType_1.ResidenceType.OWN_HOME, validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 100)));
            chai_1.expect(errors).to.be.empty;
        });
    });
});
