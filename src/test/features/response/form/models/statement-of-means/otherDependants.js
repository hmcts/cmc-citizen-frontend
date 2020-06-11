"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const otherDependants_1 = require("response/form/models/statement-of-means/otherDependants");
const validationErrors_1 = require("forms/validation/validationErrors");
const numberOfPeople_1 = require("response/form/models/statement-of-means/numberOfPeople");
describe('OtherDependants', () => {
    describe('deserialize', () => {
        it('should return empty OtherDependants for undefined given as input', () => {
            const actual = new otherDependants_1.OtherDependants().deserialize(undefined);
            chai_1.expect(actual).to.be.instanceof(otherDependants_1.OtherDependants);
            chai_1.expect(actual.declared).to.be.eq(undefined);
            chai_1.expect(actual.numberOfPeople).to.be.eq(undefined);
        });
        it('should return OtherDependants with populated only declared', () => {
            const actual = new otherDependants_1.OtherDependants().deserialize({ declared: false });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.numberOfPeople).to.be.eq(undefined);
        });
        it('should return fully populated OtherDependants', () => {
            const actual = new otherDependants_1.OtherDependants().deserialize({ declared: true, numberOfPeople: { value: 1, details: 'my story' } });
            chai_1.expect(actual.declared).to.be.eq(true);
            chai_1.expect(actual.numberOfPeople.value).to.be.eq(1);
            chai_1.expect(actual.numberOfPeople.details).to.be.eq('my story');
        });
        it('should NOT populate other fields when declared = false', () => {
            const actual = new otherDependants_1.OtherDependants().deserialize({ declared: false, numberOfPeople: { value: 1, details: 'my story' } });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.numberOfPeople).to.be.eq(undefined);
        });
    });
    describe('fromObject', () => {
        it('should return empty OtherDependants for undefined given as input', () => {
            const actual = otherDependants_1.OtherDependants.fromObject(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it('should return OtherDependants with populated only declared', () => {
            const actual = otherDependants_1.OtherDependants.fromObject({ declared: false });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.numberOfPeople).to.be.eq(undefined);
        });
        it('should return fully populated OtherDependants', () => {
            const actual = otherDependants_1.OtherDependants.fromObject({ declared: true, numberOfPeople: { value: '1', details: 'my story' } });
            chai_1.expect(actual.declared).to.be.eq(true);
            chai_1.expect(actual.numberOfPeople.value).to.be.eq(1);
            chai_1.expect(actual.numberOfPeople.details).to.be.eq('my story');
        });
        it('should NOT populate other fields when declared = false', () => {
            const actual = otherDependants_1.OtherDependants.fromObject({ declared: false, numberOfPeople: { value: '1', details: 'my story' } });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.numberOfPeople).to.be.eq(undefined);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('when declared is', () => {
            context('undefined', () => {
                it('should reject', () => {
                    const errors = validator.validateSync(new otherDependants_1.OtherDependants());
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
                });
            });
            context('true', () => {
                context('should reject when', () => {
                    it('all field left empty', () => {
                        const errors = validator.validateSync(new otherDependants_1.OtherDependants(true, new numberOfPeople_1.NumberOfPeople(undefined, '')));
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.INTEGER_REQUIRED);
                        validationUtils_1.expectValidationError(errors, numberOfPeople_1.ValidationErrors.DETAILS_REQUIRED);
                    });
                    it('number of people < 0', () => {
                        const errors = validator.validateSync(new otherDependants_1.OtherDependants(true, new numberOfPeople_1.NumberOfPeople(-1, 'my story')));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED);
                    });
                    it('number of people = 0', () => {
                        const errors = validator.validateSync(new otherDependants_1.OtherDependants(true, new numberOfPeople_1.NumberOfPeople(0, 'my story')));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED);
                    });
                    it('number of people is not integer', () => {
                        const errors = validator.validateSync(new otherDependants_1.OtherDependants(true, new numberOfPeople_1.NumberOfPeople(1.4, 'my story')));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.INTEGER_REQUIRED);
                    });
                    it('details empty', () => {
                        const errors = validator.validateSync(new otherDependants_1.OtherDependants(true, new numberOfPeople_1.NumberOfPeople(1, '')));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, numberOfPeople_1.ValidationErrors.DETAILS_REQUIRED);
                    });
                });
                it('should accept when all required fields are valid', () => {
                    const errors = validator.validateSync(new otherDependants_1.OtherDependants(true, new numberOfPeople_1.NumberOfPeople(10, 'my story')));
                    chai_1.expect(errors.length).to.equal(0);
                });
            });
            context('declared = false', () => {
                it('should accept when other fields empty', () => {
                    const errors = validator.validateSync(new otherDependants_1.OtherDependants(false, undefined));
                    chai_1.expect(errors.length).to.equal(0);
                });
                it('should accept when other fields populated', () => {
                    const errors = validator.validateSync(new otherDependants_1.OtherDependants(false, new numberOfPeople_1.NumberOfPeople(10, 'my story')));
                    chai_1.expect(errors.length).to.equal(0);
                });
            });
        });
    });
});
