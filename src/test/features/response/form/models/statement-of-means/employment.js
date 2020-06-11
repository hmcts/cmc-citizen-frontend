"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const employment_1 = require("response/form/models/statement-of-means/employment");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('Employment', () => {
    describe('deserialize', () => {
        it('should return empty Employment for undefined given as input', () => {
            const actual = new employment_1.Employment().deserialize(undefined);
            chai_1.expect(actual).to.be.instanceof(employment_1.Employment);
            chai_1.expect(actual.declared).to.be.eq(undefined);
            chai_1.expect(actual.selfEmployed).to.be.eq(undefined);
            chai_1.expect(actual.employed).to.be.eq(undefined);
        });
        it('should return Employment with populated only isCurrentlyEmployed', () => {
            const actual = new employment_1.Employment().deserialize({ declared: false });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.selfEmployed).to.be.eq(undefined);
            chai_1.expect(actual.employed).to.be.eq(undefined);
        });
        it('should return fully populated Employment', () => {
            const actual = new employment_1.Employment().deserialize({ declared: true, selfEmployed: false, employed: true });
            chai_1.expect(actual.declared).to.be.eq(true);
            chai_1.expect(actual.selfEmployed).to.be.eq(false);
            chai_1.expect(actual.employed).to.be.eq(true);
        });
        it('should NOT populate selfEmployed and employed when declared = false', () => {
            const actual = new employment_1.Employment().deserialize({ declared: false, selfEmployed: true, employed: true });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.selfEmployed).to.be.eq(undefined);
            chai_1.expect(actual.employed).to.be.eq(undefined);
        });
    });
    describe('fromObject', () => {
        it('should return undefined when undefined given as input', () => {
            chai_1.expect(employment_1.Employment.fromObject(undefined)).to.be.eq(undefined);
        });
        it('should return Employment with populated only declared', () => {
            const actual = employment_1.Employment.fromObject({ declared: false });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.selfEmployed).to.be.eq(undefined);
            chai_1.expect(actual.employed).to.be.eq(undefined);
        });
        it('should return fully populated Employment', () => {
            const actual = employment_1.Employment.fromObject({ declared: true, selfEmployed: false, employed: true });
            chai_1.expect(actual.declared).to.be.eq(true);
            chai_1.expect(actual.selfEmployed).to.be.eq(false);
            chai_1.expect(actual.employed).to.be.eq(true);
        });
        it('should NOT populate selfEmployed and employed when declared = false', () => {
            const actual = employment_1.Employment.fromObject({ declared: false, selfEmployed: true, employed: true });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.selfEmployed).to.be.eq(undefined);
            chai_1.expect(actual.employed).to.be.eq(undefined);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('declared', () => {
            context('when declared is undefined', () => {
                it('should reject', () => {
                    const errors = validator.validateSync(new employment_1.Employment());
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
                });
            });
            context('when declared is', () => {
                context('true', () => {
                    context('should reject when', () => {
                        it('no other field is given', () => {
                            const errors = validator.validateSync(new employment_1.Employment(true));
                            chai_1.expect(errors.length).to.equal(1);
                            validationUtils_1.expectValidationError(errors, employment_1.ValidationErrors.SELECT_AT_LEAST_ONE_OPTION);
                        });
                        it('both are false', () => {
                            const errors = validator.validateSync(employment_1.Employment.fromObject({
                                declared: true, selfEmployed: false, employed: false
                            }));
                            chai_1.expect(errors.length).to.equal(1);
                            validationUtils_1.expectValidationError(errors, employment_1.ValidationErrors.SELECT_AT_LEAST_ONE_OPTION);
                        });
                    });
                    context('should accept when', () => {
                        it('all field set true', () => {
                            const errors = validator.validateSync(new employment_1.Employment(true, true, true));
                            chai_1.expect(errors.length).to.equal(0);
                        });
                        it('employed = true and selfEmployed = false', () => {
                            const errors = validator.validateSync(new employment_1.Employment(true, true, false));
                            chai_1.expect(errors.length).to.equal(0);
                        });
                        it('employed = false and selfEmployed = true', () => {
                            const errors = validator.validateSync(new employment_1.Employment(true, false, true));
                            chai_1.expect(errors.length).to.equal(0);
                        });
                    });
                });
                context('declared = false', () => {
                    it('should not validate other fields', () => {
                        const errors = validator.validateSync(new employment_1.Employment(false, false, true));
                        chai_1.expect(errors.length).to.equal(0);
                    });
                });
            });
        });
    });
});
