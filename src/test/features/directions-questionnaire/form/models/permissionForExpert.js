"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const yesNoOption_1 = require("models/yesNoOption");
const permissionForExpert_1 = require("directions-questionnaire/forms/models/permissionForExpert");
describe('PermissionForExpert', () => {
    context('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const permissionForExpert = new permissionForExpert_1.PermissionForExpert();
            chai_1.expect(permissionForExpert.option).to.be.undefined;
        });
    });
    context('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject expert required with null type', () => {
            const errors = validator.validateSync(new permissionForExpert_1.PermissionForExpert(null));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject expert required with no expert required option ', () => {
            const errors = validator.validateSync(new permissionForExpert_1.PermissionForExpert());
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should accept expert required with option present', () => {
            const errors = validator.validateSync(new permissionForExpert_1.PermissionForExpert(yesNoOption_1.YesNoOption.YES));
            chai_1.expect(errors).to.be.empty;
        });
    });
    context('fromObject should return', () => {
        it('undefined when undefined provided', () => {
            const model = permissionForExpert_1.PermissionForExpert.fromObject(undefined);
            chai_1.expect(model).to.be.undefined;
        });
        it('empty object when unknown value provided', () => {
            const model = permissionForExpert_1.PermissionForExpert.fromObject({ option: 'I do not know this value!' });
            chai_1.expect(model.option).to.be.undefined;
        });
        it(`valid object when values provided`, () => {
            const model = permissionForExpert_1.PermissionForExpert.fromObject({ option: 'yes' });
            chai_1.expect(model.option).to.equal(yesNoOption_1.YesNoOption.YES);
        });
    });
    context('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new permissionForExpert_1.PermissionForExpert().deserialize(undefined)).to.deep.equal(new permissionForExpert_1.PermissionForExpert());
        });
        it('should return an instance from given object', () => {
            const actual = new permissionForExpert_1.PermissionForExpert().deserialize({ option: 'yes' });
            chai_1.expect(actual).to.deep.equal(new permissionForExpert_1.PermissionForExpert(yesNoOption_1.YesNoOption.fromObject(yesNoOption_1.YesNoOption.YES)));
        });
    });
    context('isCompleted', () => {
        it('Should be marked completed when an option is selected', () => {
            const permissionForExpert = new permissionForExpert_1.PermissionForExpert(yesNoOption_1.YesNoOption.YES);
            chai_1.expect(permissionForExpert.isCompleted()).to.be.true;
        });
        it('Should be marked not complete when no option is selected', () => {
            const permissionForExpert = new permissionForExpert_1.PermissionForExpert(undefined);
            chai_1.expect(permissionForExpert.isCompleted()).to.be.false;
        });
    });
});
