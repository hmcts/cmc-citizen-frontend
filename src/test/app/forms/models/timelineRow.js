"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const timelineRow_1 = require("forms/models/timelineRow");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('TimelineRow', () => {
    describe('empty', () => {
        it('should return empty instances of TimelineRow', () => {
            const actual = timelineRow_1.TimelineRow.empty();
            chai_1.expect(actual).instanceof(timelineRow_1.TimelineRow);
            chai_1.expect(actual.date).to.eq(undefined);
            chai_1.expect(actual.description).to.eq(undefined);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('should accept', () => {
            it('when both undefined', () => {
                const errors = validator.validateSync(new timelineRow_1.TimelineRow(undefined, undefined));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when both are valid strings', () => {
                const errors = validator.validateSync(new timelineRow_1.TimelineRow('Date', 'description'));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        context('should reject', () => {
            it('when date given, but no description', () => {
                const errors = validator.validateSync(new timelineRow_1.TimelineRow('May', ''));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, timelineRow_1.ValidationErrors.DESCRIPTION_REQUIRED);
            });
            it('when description given, but no date', () => {
                const errors = validator.validateSync(new timelineRow_1.TimelineRow('', 'Let me tell you what happened'));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DATE_REQUIRED);
            });
            it('when both args are empty strings', () => {
                const errors = validator.validateSync(new timelineRow_1.TimelineRow('', ''));
                chai_1.expect(errors.length).to.equal(2);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DATE_REQUIRED);
                validationUtils_1.expectValidationError(errors, timelineRow_1.ValidationErrors.DESCRIPTION_REQUIRED);
            });
            it('when date is too long', () => {
                const errors = validator.validateSync(new timelineRow_1.TimelineRow(validationUtils_1.generateString(timelineRow_1.ValidationConstraints.DATE_MAX_LENGTH + 1), 'description'));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, timelineRow_1.ValidationErrors.DATE_TOO_LONG.replace('$constraint1', timelineRow_1.ValidationConstraints.DATE_MAX_LENGTH.toString()));
            });
            it('when description is too long', () => {
                const errors = validator.validateSync(new timelineRow_1.TimelineRow('date', validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
            });
        });
    });
});
