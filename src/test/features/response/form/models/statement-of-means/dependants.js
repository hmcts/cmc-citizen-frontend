"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const dependants_1 = require("response/form/models/statement-of-means/dependants");
const validationErrors_1 = require("forms/validation/validationErrors");
const numberOfChildren_1 = require("response/form/models/statement-of-means/numberOfChildren");
describe('Dependants', () => {
    describe('deserialize', () => {
        it('should return empty Dependants for undefined given as input', () => {
            const actual = new dependants_1.Dependants().deserialize(undefined);
            chai_1.expect(actual).to.be.instanceof(dependants_1.Dependants);
            chai_1.expect(actual.declared).to.be.eq(undefined);
            chai_1.expect(actual.numberOfChildren).to.be.eq(undefined);
        });
        it('should return Dependants with populated only declared', () => {
            const actual = new dependants_1.Dependants().deserialize({ declared: false });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.numberOfChildren).to.be.eq(undefined);
        });
        it('should return fully populated Dependants', () => {
            const actual = new dependants_1.Dependants().deserialize({ declared: true, numberOfChildren: { under11: 1, between11and15: 2, between16and19: 3 } });
            chai_1.expect(actual.declared).to.be.eq(true);
            chai_1.expect(actual.numberOfChildren.under11).to.be.eq(1);
            chai_1.expect(actual.numberOfChildren.between11and15).to.be.eq(2);
            chai_1.expect(actual.numberOfChildren.between16and19).to.be.eq(3);
        });
        it('should NOT populate other fields when declared = false', () => {
            const actual = new dependants_1.Dependants().deserialize({ declared: false, numberOfChildren: { under11: 1, between11and15: 2, between16and19: 3 } });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.numberOfChildren).to.be.eq(undefined);
        });
    });
    describe('fromObject', () => {
        it('should return empty Dependants for undefined given as input', () => {
            const actual = dependants_1.Dependants.fromObject(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it('should return Dependants with populated only declared', () => {
            const actual = dependants_1.Dependants.fromObject({ declared: false });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.numberOfChildren).to.be.eq(undefined);
        });
        it('should return fully populated Dependants', () => {
            const actual = dependants_1.Dependants.fromObject({ declared: true, numberOfChildren: { under11: '1', between11and15: '2', between16and19: '3' } });
            chai_1.expect(actual.declared).to.be.eq(true);
            chai_1.expect(actual.numberOfChildren.under11).to.be.eq(1);
            chai_1.expect(actual.numberOfChildren.between11and15).to.be.eq(2);
            chai_1.expect(actual.numberOfChildren.between16and19).to.be.eq(3);
        });
        it('should NOT populate other fields when declared = false', () => {
            const actual = dependants_1.Dependants.fromObject({ declared: false, numberOfChildren: { under11: '1', between11and15: '2', between16and19: '3' } });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.numberOfChildren).to.be.eq(undefined);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('when declared is', () => {
            context('undefined', () => {
                it('should reject', () => {
                    const errors = validator.validateSync(new dependants_1.Dependants());
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
                });
            });
            context('true', () => {
                context('should reject when', () => {
                    it('all are not given', () => {
                        const errors = validator.validateSync(new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(undefined, undefined, undefined)));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, dependants_1.ValidationErrors.ENTER_AT_LEAST_ONE);
                    });
                    it('all field set 0', () => {
                        const errors = validator.validateSync(new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(0, 0, 0)));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, dependants_1.ValidationErrors.ENTER_AT_LEAST_ONE);
                    });
                    it('under11 is < 0', () => {
                        const errors = validator.validateSync(new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(-1, 2, 0)));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED);
                    });
                    it('between11and15 is < 0', () => {
                        const errors = validator.validateSync(new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(1, -1, 0)));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED);
                    });
                    it('between16and19 is < 0', () => {
                        const errors = validator.validateSync(new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(1, 1, -1)));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED);
                    });
                    it('under11 is decimal', () => {
                        const errors = validator.validateSync(new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(1.1, 0, 0)));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.INTEGER_REQUIRED);
                    });
                    it('between11and15 is decimal', () => {
                        const errors = validator.validateSync(new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(0, 1.5, 0)));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.INTEGER_REQUIRED);
                    });
                    it('between16and19 is decimal', () => {
                        const errors = validator.validateSync(new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(0, 1, 1.2)));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.INTEGER_REQUIRED);
                    });
                });
                context('should accept when', () => {
                    it('one of other field is not given', () => {
                        const errors = validator.validateSync(new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(10, 10, undefined)));
                        chai_1.expect(errors.length).to.equal(0);
                    });
                    it('positive number', () => {
                        const errors = validator.validateSync(new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(1, 1, 1)));
                        chai_1.expect(errors.length).to.equal(0);
                    });
                });
            });
            context('isCurrentlyEmployed = false', () => {
                it('should not validate other fields', () => {
                    const errors = validator.validateSync(new dependants_1.Dependants(false, new numberOfChildren_1.NumberOfChildren(-10, -10, -10)));
                    chai_1.expect(errors.length).to.equal(0);
                });
            });
        });
    });
});
