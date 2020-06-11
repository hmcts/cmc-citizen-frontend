"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const availability_1 = require("directions-questionnaire/forms/models/availability");
const localDateUtils_1 = require("test/localDateUtils");
describe('Availability', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const availability = new availability_1.Availability();
            chai_1.expect(availability.hasUnavailableDates).to.be.undefined;
            chai_1.expect(availability.unavailableDates).to.be.undefined;
            chai_1.expect(availability.newDate).to.be.undefined;
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject when null', () => {
            const errors = validator.validateSync(new availability_1.Availability(null, null, null));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject availability without confirmation', () => {
            const errors = validator.validateSync(new availability_1.Availability());
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject availability with affirmation of unavailable dates but no dates given', () => {
            const errors = validator.validateSync(new availability_1.Availability(true));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, availability_1.ValidationErrors.AT_LEAST_ONE_DATE);
        });
        it('should reject availability with a past date', () => {
            const errors = validator.validateSync(new availability_1.Availability(true, [localDateUtils_1.daysFromNow(1)], localDateUtils_1.daysFromNow(-1)));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, availability_1.ValidationErrors.FUTURE_DATE_REQUIRED);
        });
        it('should accept availability with affirmation of unavailable dates and dates given', () => {
            const errors = validator.validateSync(new availability_1.Availability(true, [localDateUtils_1.daysFromNow(1)]));
            chai_1.expect(errors).to.be.empty;
        });
        it('should accept availability with denial of unavailable dates', () => {
            const errors = validator.validateSync(new availability_1.Availability(false));
            chai_1.expect(errors).to.be.empty;
        });
    });
    describe('isCompleted', () => {
        it('Should be marked not completed when no confirmation', () => {
            const availability = new availability_1.Availability(undefined);
            chai_1.expect(availability.isCompleted()).to.be.false;
        });
        it('Should be marked complete when denied having unavailable dates', () => {
            const availability = new availability_1.Availability(false);
            chai_1.expect(availability.isCompleted()).to.be.true;
        });
        it('Should be marked not complete when affirmed having unavailable dates but no dates given', () => {
            const availability = new availability_1.Availability(true);
            chai_1.expect(availability.isCompleted()).to.be.false;
        });
        it('Should be marked complete when affirmed having unavailable dates and dates given', () => {
            const availability = new availability_1.Availability(true, [localDateUtils_1.daysFromNow(2)]);
            chai_1.expect(availability.isCompleted()).to.be.true;
        });
    });
});
