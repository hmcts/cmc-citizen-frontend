"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const hearingLocation_1 = require("directions-questionnaire/forms/models/hearingLocation");
const validationErrors_1 = require("forms/validation/validationErrors");
const yesNoOption_1 = require("models/yesNoOption");
describe('HearingLocation', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const hearingLocation = new hearingLocation_1.HearingLocation();
            chai_1.expect(hearingLocation.courtName).to.be.undefined;
            chai_1.expect(hearingLocation.courtPostcode).to.be.undefined;
            chai_1.expect(hearingLocation.courtAccepted).to.be.undefined;
            chai_1.expect(hearingLocation.alternativeOption).to.be.undefined;
            chai_1.expect(hearingLocation.alternativeCourtName).to.be.undefined;
            chai_1.expect(hearingLocation.alternativePostcode).to.be.undefined;
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject when null', () => {
            const errors = validator.validateSync(new hearingLocation_1.HearingLocation(null, null, null, null, null, null));
            chai_1.expect(errors).to.not.be.empty;
        });
        context('When a court name is present', () => {
            it('Should reject when no court accepted option is present', () => {
                let hearingLocation = new hearingLocation_1.HearingLocation();
                hearingLocation.courtName = 'COURT';
                const errors = validator.validateSync(hearingLocation);
                chai_1.expect(errors).to.not.be.empty;
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
            });
            it('Should accept when the court accepted is yes', () => {
                let hearingLocation = new hearingLocation_1.HearingLocation();
                hearingLocation.courtName = 'COURT';
                hearingLocation.courtAccepted = yesNoOption_1.YesNoOption.YES;
                const errors = validator.validateSync(hearingLocation);
                chai_1.expect(errors).to.be.empty;
            });
            context('When court accepted is no', () => {
                it('Should reject when no alternative option is selected', () => {
                    let hearingLocation = new hearingLocation_1.HearingLocation();
                    hearingLocation.courtName = 'COURT';
                    hearingLocation.courtAccepted = yesNoOption_1.YesNoOption.NO;
                    const errors = validator.validateSync(hearingLocation);
                    chai_1.expect(errors).to.not.be.empty;
                    validationUtils_1.expectValidationError(errors, hearingLocation_1.ValidationErrors.SELECT_ALTERNATIVE_OPTION);
                });
                context('When alternative option is courtname', () => {
                    it('Should reject when alternative court name is empty', () => {
                        let hearingLocation = new hearingLocation_1.HearingLocation();
                        hearingLocation.courtName = 'COURT';
                        hearingLocation.courtAccepted = yesNoOption_1.YesNoOption.NO;
                        hearingLocation.alternativeOption = 'name';
                        const errors = validator.validateSync(hearingLocation);
                        chai_1.expect(errors).to.not.be.empty;
                        validationUtils_1.expectValidationError(errors, hearingLocation_1.ValidationErrors.NO_ALTERNATIVE_COURT_NAME);
                    });
                    it('Should accept when alternative court name is not empty', () => {
                        let hearingLocation = new hearingLocation_1.HearingLocation();
                        hearingLocation.courtName = 'COURT';
                        hearingLocation.courtAccepted = yesNoOption_1.YesNoOption.NO;
                        hearingLocation.alternativeOption = 'name';
                        hearingLocation.alternativeCourtName = 'Court';
                        const errors = validator.validateSync(hearingLocation);
                        chai_1.expect(errors).to.be.empty;
                    });
                });
                context('When alternative option is postcode', () => {
                    it('Should reject when alternative postcode is empty', () => {
                        let hearingLocation = new hearingLocation_1.HearingLocation();
                        hearingLocation.courtName = 'COURT';
                        hearingLocation.courtAccepted = yesNoOption_1.YesNoOption.NO;
                        hearingLocation.alternativeOption = 'postcode';
                        const errors = validator.validateSync(hearingLocation);
                        chai_1.expect(errors).to.not.be.empty;
                        validationUtils_1.expectValidationError(errors, hearingLocation_1.ValidationErrors.NO_ALTERNATIVE_POSTCODE);
                    });
                    it('Should reject when alternative postcode is not a valid postcode', () => {
                        let hearingLocation = new hearingLocation_1.HearingLocation();
                        hearingLocation.courtName = 'COURT';
                        hearingLocation.courtAccepted = yesNoOption_1.YesNoOption.NO;
                        hearingLocation.alternativeOption = 'postcode';
                        hearingLocation.alternativePostcode = 'not a valid postcode';
                        const errors = validator.validateSync(hearingLocation);
                        validationUtils_1.expectValidationError(errors, hearingLocation_1.ValidationErrors.NO_ALTERNATIVE_POSTCODE);
                    });
                    it('Should accept when alternative postcode is not empty and a valid postcode', () => {
                        let hearingLocation = new hearingLocation_1.HearingLocation();
                        hearingLocation.courtName = 'COURT';
                        hearingLocation.courtAccepted = yesNoOption_1.YesNoOption.NO;
                        hearingLocation.alternativeOption = 'postcode';
                        hearingLocation.alternativePostcode = 'A111AA';
                        const errors = validator.validateSync(hearingLocation);
                        chai_1.expect(errors).to.be.empty;
                    });
                });
            });
        });
        context('When no court name is provided (as a result of the fallback page)', () => {
            it('Should reject when alternative court name is undefined', () => {
                let hearingLocation = new hearingLocation_1.HearingLocation();
                hearingLocation.alternativeCourtName = undefined;
                const errors = validator.validateSync(hearingLocation);
                chai_1.expect(errors).to.not.be.empty;
                validationUtils_1.expectValidationError(errors, hearingLocation_1.ValidationErrors.NO_ALTERNATIVE_COURT_NAME);
            });
            it('Should reject when alternative court name is empty', () => {
                let hearingLocation = new hearingLocation_1.HearingLocation();
                hearingLocation.alternativeCourtName = '';
                const errors = validator.validateSync(hearingLocation);
                chai_1.expect(errors).to.not.be.empty;
                validationUtils_1.expectValidationError(errors, hearingLocation_1.ValidationErrors.NO_ALTERNATIVE_COURT_NAME);
            });
            it('Should accept when alternative court name is provided', () => {
                let hearingLocation = new hearingLocation_1.HearingLocation();
                hearingLocation.alternativeCourtName = 'court';
                const errors = validator.validateSync(hearingLocation);
                chai_1.expect(errors).to.be.empty;
            });
        });
    });
});
