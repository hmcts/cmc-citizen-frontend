"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const whyExpertIsNeeded_1 = require("directions-questionnaire/forms/models/whyExpertIsNeeded");
describe('WhyExpertIsNeeded', () => {
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject when null', () => {
            const errors = validator.validateSync(new whyExpertIsNeeded_1.WhyExpertIsNeeded(null));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, whyExpertIsNeeded_1.ValidationErrors.REASON_REQUIRED);
        });
        it('should reject with no expert reason provided', () => {
            const errors = validator.validateSync(new whyExpertIsNeeded_1.WhyExpertIsNeeded());
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, whyExpertIsNeeded_1.ValidationErrors.REASON_REQUIRED);
        });
        it('should accept when reason is provided', () => {
            const errors = validator.validateSync(new whyExpertIsNeeded_1.WhyExpertIsNeeded('Building needs inspecting'));
            chai_1.expect(errors).to.be.empty;
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new whyExpertIsNeeded_1.WhyExpertIsNeeded().deserialize(undefined)).to.deep.equal(new whyExpertIsNeeded_1.WhyExpertIsNeeded());
        });
        it('should deserialize expert evidence to return instance of expert evidence', () => {
            const whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded('Building needs inspecting');
            chai_1.expect(whyExpertIsNeeded.deserialize(whyExpertIsNeeded)).to.be.instanceOf(whyExpertIsNeeded_1.WhyExpertIsNeeded);
        });
    });
    describe('from object', () => {
        it('undefined when undefined provided', () => {
            const model = whyExpertIsNeeded_1.WhyExpertIsNeeded.fromObject(undefined);
            chai_1.expect(model).to.be.undefined;
        });
        it('empty object when unknown value provided', () => {
            const model = whyExpertIsNeeded_1.WhyExpertIsNeeded.fromObject({ explanation: undefined });
            chai_1.expect(model.explanation).to.be.undefined;
        });
        it('should return instance of whyExpertIsNeeded when passed WhyExpertIsNeeded object', () => {
            const explanation = 'Building needs inspecting';
            chai_1.expect(whyExpertIsNeeded_1.WhyExpertIsNeeded.fromObject({ explanation })).to.be.instanceOf(whyExpertIsNeeded_1.WhyExpertIsNeeded);
        });
    });
    describe('isCompleted', () => {
        it('should be marked not completed when no option is present', () => {
            const expertEvidence = new whyExpertIsNeeded_1.WhyExpertIsNeeded(undefined);
            chai_1.expect(expertEvidence.isCompleted()).to.be.false;
        });
        it('should be marked complete when explanation is given', () => {
            const expertEvidence = new whyExpertIsNeeded_1.WhyExpertIsNeeded('Building needs inspecting');
            chai_1.expect(expertEvidence.isCompleted()).to.be.true;
        });
    });
});
