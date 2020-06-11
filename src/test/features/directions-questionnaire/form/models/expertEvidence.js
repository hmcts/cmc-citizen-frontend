"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const expertEvidence_1 = require("directions-questionnaire/forms/models/expertEvidence");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const yesNoOption_1 = require("models/yesNoOption");
const exceptionalCircumstances_1 = require("directions-questionnaire/forms/models/exceptionalCircumstances");
describe('ExpertEvidence', () => {
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject when null', () => {
            const errors = validator.validateSync(new expertEvidence_1.ExpertEvidence(null, null));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject with no expert evidence option', () => {
            const errors = validator.validateSync(new expertEvidence_1.ExpertEvidence());
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject expert evidence with yes option and no whatToExamine', () => {
            const errors = validator.validateSync(new expertEvidence_1.ExpertEvidence(yesNoOption_1.YesNoOption.YES));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, expertEvidence_1.ValidationErrors.REASON_REQUIRED);
        });
        it('should accept expert evidence with option and what to expect reason', () => {
            const errors = validator.validateSync(new expertEvidence_1.ExpertEvidence(yesNoOption_1.YesNoOption.YES, 'bank statements'));
            chai_1.expect(errors).to.be.empty;
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new expertEvidence_1.ExpertEvidence().deserialize(undefined)).to.deep.equal(new expertEvidence_1.ExpertEvidence());
        });
        it('should deserialize expert evidence to return instance of expert evidence', () => {
            const expertEvidence = new expertEvidence_1.ExpertEvidence(yesNoOption_1.YesNoOption.YES, 'bank statements');
            chai_1.expect(expertEvidence.deserialize(expertEvidence)).to.be.instanceOf(expertEvidence_1.ExpertEvidence);
        });
    });
    describe('from object', () => {
        it('should return instance of expert evidence when passed ExpertEvidence object - Yes', () => {
            const yes = yesNoOption_1.YesNoOption.YES;
            const whatToExamine = 'bank statements';
            chai_1.expect(expertEvidence_1.ExpertEvidence.fromObject({ yes, whatToExamine })).to.be.instanceOf(expertEvidence_1.ExpertEvidence);
        });
        it('should return instance of expert evidence when passed ExpertEvidence object - No', () => {
            const no = yesNoOption_1.YesNoOption.NO;
            chai_1.expect(expertEvidence_1.ExpertEvidence.fromObject({ no })).to.be.instanceOf(expertEvidence_1.ExpertEvidence);
        });
    });
    describe('isCompleted', () => {
        it('should be marked not completed when no option is present', () => {
            const expertEvidence = new expertEvidence_1.ExpertEvidence(undefined);
            chai_1.expect(expertEvidence.isCompleted()).to.be.false;
        });
        it('should be marked complete when no option is selected', () => {
            const expertEvidence = new expertEvidence_1.ExpertEvidence(yesNoOption_1.YesNoOption.NO);
            chai_1.expect(expertEvidence.isCompleted()).to.be.true;
        });
        it('Should be marked not complete when the yes option is selected and no reason is entered', () => {
            const expertEvidence = new expertEvidence_1.ExpertEvidence(yesNoOption_1.YesNoOption.YES);
            chai_1.expect(expertEvidence.isCompleted()).to.be.false;
        });
        it('Should be marked complete when the yes option is selected and what to examine is present', () => {
            const exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances(yesNoOption_1.YesNoOption.YES, 'bank statements');
            chai_1.expect(exceptionalCircumstances.isDefendantCompleted()).to.be.true;
        });
    });
});
