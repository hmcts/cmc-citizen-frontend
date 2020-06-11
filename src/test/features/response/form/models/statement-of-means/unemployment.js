"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const unemployment_1 = require("response/form/models/statement-of-means/unemployment");
const validationErrors_1 = require("forms/validation/validationErrors");
const unemploymentType_1 = require("response/form/models/statement-of-means/unemploymentType");
const unemploymentDetails_1 = require("response/form/models/statement-of-means/unemploymentDetails");
const otherDetails_1 = require("response/form/models/statement-of-means/otherDetails");
const validationConstraints_1 = require("forms/validation/validationConstraints");
describe('Unemployment', () => {
    describe('deserialize', () => {
        it('should return empty Unemployed for undefined given as input', () => {
            const actual = new unemployment_1.Unemployment().deserialize(undefined);
            chai_1.expect(actual).to.be.instanceof(unemployment_1.Unemployment);
            chai_1.expect(actual.option).to.be.eq(undefined);
            chai_1.expect(actual.unemploymentDetails).to.be.eq(undefined);
            chai_1.expect(actual.otherDetails).to.be.eq(undefined);
        });
        context('should return fully populated Unemployed for option', () => {
            it('UNEMPLOYED', () => {
                const actual = new unemployment_1.Unemployment().deserialize({ option: unemploymentType_1.UnemploymentType.UNEMPLOYED, unemploymentDetails: { years: 1, months: 2 } });
                chai_1.expect(actual.option).to.equal(unemploymentType_1.UnemploymentType.UNEMPLOYED);
                chai_1.expect(actual.unemploymentDetails).to.be.instanceof(unemploymentDetails_1.UnemploymentDetails);
                chai_1.expect(actual.unemploymentDetails.years).to.be.eq(1);
                chai_1.expect(actual.unemploymentDetails.months).to.be.eq(2);
                chai_1.expect(actual.otherDetails).to.be.eq(undefined);
            });
            it('OTHER', () => {
                const actual = new unemployment_1.Unemployment().deserialize({ option: unemploymentType_1.UnemploymentType.OTHER, otherDetails: { details: 'my story' } });
                chai_1.expect(actual.option).to.equal(unemploymentType_1.UnemploymentType.OTHER);
                chai_1.expect(actual.unemploymentDetails).to.be.eq(undefined);
                chai_1.expect(actual.otherDetails).to.be.instanceof(otherDetails_1.OtherDetails);
                chai_1.expect(actual.otherDetails.details).to.be.eq('my story');
            });
            it('RETIRED', () => {
                const actual = new unemployment_1.Unemployment().deserialize({ option: unemploymentType_1.UnemploymentType.RETIRED });
                chai_1.expect(actual.option).to.equal(unemploymentType_1.UnemploymentType.RETIRED);
                chai_1.expect(actual.unemploymentDetails).to.be.eq(undefined);
                chai_1.expect(actual.otherDetails).to.be.eq(undefined);
            });
        });
    });
    describe('fromObject', () => {
        it('should return undefined when undefined given as input', () => {
            const actual = unemployment_1.Unemployment.fromObject(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        context('should return fully populated Unemployed for option', () => {
            it('UNEMPLOYED', () => {
                const actual = unemployment_1.Unemployment.fromObject({ option: unemploymentType_1.UnemploymentType.UNEMPLOYED.value, unemploymentDetails: { years: '1', months: '2' } });
                chai_1.expect(actual.option).to.equal(unemploymentType_1.UnemploymentType.UNEMPLOYED);
                chai_1.expect(actual.unemploymentDetails).to.be.instanceof(unemploymentDetails_1.UnemploymentDetails);
                chai_1.expect(actual.unemploymentDetails.years).to.be.eq(1);
                chai_1.expect(actual.unemploymentDetails.months).to.be.eq(2);
                chai_1.expect(actual.otherDetails).to.be.eq(undefined);
            });
            it('OTHER', () => {
                const actual = unemployment_1.Unemployment.fromObject({ option: unemploymentType_1.UnemploymentType.OTHER.value, otherDetails: { details: 'my story' } });
                chai_1.expect(actual.option).to.equal(unemploymentType_1.UnemploymentType.OTHER);
                chai_1.expect(actual.unemploymentDetails).to.be.eq(undefined);
                chai_1.expect(actual.otherDetails).to.be.instanceof(otherDetails_1.OtherDetails);
                chai_1.expect(actual.otherDetails.details).to.be.eq('my story');
            });
            it('RETIRED', () => {
                const actual = unemployment_1.Unemployment.fromObject({ option: unemploymentType_1.UnemploymentType.RETIRED.value });
                chai_1.expect(actual.option).to.equal(unemploymentType_1.UnemploymentType.RETIRED);
                chai_1.expect(actual.unemploymentDetails).to.be.eq(undefined);
                chai_1.expect(actual.otherDetails).to.be.eq(undefined);
            });
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('should accept when', () => {
            it('option UNEMPLOYED and valid details', () => {
                const errors = validator.validateSync(new unemployment_1.Unemployment(unemploymentType_1.UnemploymentType.UNEMPLOYED, new unemploymentDetails_1.UnemploymentDetails(1, 1)));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('option RETIRED and no details', () => {
                const errors = validator.validateSync(new unemployment_1.Unemployment(unemploymentType_1.UnemploymentType.RETIRED));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('option OTHER and valid details', () => {
                const errors = validator.validateSync(new unemployment_1.Unemployment(unemploymentType_1.UnemploymentType.OTHER, undefined, new otherDetails_1.OtherDetails('my story')));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('option RETIRED and all other details (valid)', () => {
                const errors = validator.validateSync(new unemployment_1.Unemployment(unemploymentType_1.UnemploymentType.RETIRED, new unemploymentDetails_1.UnemploymentDetails(1, 1), new otherDetails_1.OtherDetails('my story')));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('option RETIRED and all other details (invalid)', () => {
                const errors = validator.validateSync(new unemployment_1.Unemployment(unemploymentType_1.UnemploymentType.RETIRED, new unemploymentDetails_1.UnemploymentDetails(-1, -1), new otherDetails_1.OtherDetails('')));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        describe('should reject when', () => {
            context('invalid unemployment details', () => {
                it('invalid years in unemployment details', () => {
                    const errors = validator.validateSync(new unemployment_1.Unemployment(unemploymentType_1.UnemploymentType.UNEMPLOYED, new unemploymentDetails_1.UnemploymentDetails(-1, 0)));
                    validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED);
                });
                it('invalid month in unemployment details', () => {
                    const errors = validator.validateSync(new unemployment_1.Unemployment(unemploymentType_1.UnemploymentType.UNEMPLOYED, new unemploymentDetails_1.UnemploymentDetails(1, -1)));
                    validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED);
                });
                it('too many months in unemployment details', () => {
                    const errors = validator.validateSync(new unemployment_1.Unemployment(unemploymentType_1.UnemploymentType.UNEMPLOYED, new unemploymentDetails_1.UnemploymentDetails(1, unemploymentDetails_1.ValidationConstraints.MAX_NUMBER_OF_MONTHS + 1)));
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, unemploymentDetails_1.ValidationErrors.TOO_MANY.replace('$constraint1', unemploymentDetails_1.ValidationConstraints.MAX_NUMBER_OF_MONTHS.toString()));
                });
                it('too many years in unemployment details', () => {
                    const errors = validator.validateSync(new unemployment_1.Unemployment(unemploymentType_1.UnemploymentType.UNEMPLOYED, new unemploymentDetails_1.UnemploymentDetails(unemploymentDetails_1.ValidationConstraints.MAX_NUMBER_OF_YEARS + 1, 0)));
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, unemploymentDetails_1.ValidationErrors.TOO_MANY.replace('$constraint1', unemploymentDetails_1.ValidationConstraints.MAX_NUMBER_OF_YEARS.toString()));
                });
            });
            context('invalid other details', () => {
                it('empty details', () => {
                    const errors = validator.validateSync(new unemployment_1.Unemployment(unemploymentType_1.UnemploymentType.OTHER, undefined, new otherDetails_1.OtherDetails('')));
                    validationUtils_1.expectValidationError(errors, otherDetails_1.ValidationErrors.DETAILS_REQUIRED);
                });
                it('too long details', () => {
                    const errors = validator.validateSync(new unemployment_1.Unemployment(unemploymentType_1.UnemploymentType.OTHER, undefined, new otherDetails_1.OtherDetails(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1))));
                    validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
                });
            });
        });
    });
});
