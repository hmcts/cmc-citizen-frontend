"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const statementOfTruth_1 = require("claimant-response/form/models/statementOfTruth");
const signatureType_1 = require("common/signatureType");
describe('StatementOfTruth', () => {
    describe('constructor', () => {
        it('should set signed to undefined', () => {
            const model = new statementOfTruth_1.StatementOfTruth();
            chai_1.expect(model.directionsQuestionnaireSigned).to.be.undefined;
        });
        it('should set signed to true', () => {
            const model = new statementOfTruth_1.StatementOfTruth(signatureType_1.SignatureType.BASIC, true);
            chai_1.expect(model.directionsQuestionnaireSigned).to.be.true;
        });
        it('should set signed to false', () => {
            const model = new statementOfTruth_1.StatementOfTruth(signatureType_1.SignatureType.BASIC, false);
            chai_1.expect(model.directionsQuestionnaireSigned).to.be.false;
        });
    });
    describe('fromObject', () => {
        it('should return an instance initialised with truthy value', () => {
            chai_1.expect(statementOfTruth_1.StatementOfTruth.fromObject(undefined)).to.eql(new statementOfTruth_1.StatementOfTruth(signatureType_1.SignatureType.BASIC));
        });
        it('should return a valid object for "true"', () => {
            chai_1.expect(statementOfTruth_1.StatementOfTruth.fromObject({
                type: 'directions',
                directionsQuestionnaireSigned: 'true'
            })).to.eql(new statementOfTruth_1.StatementOfTruth(signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE, true));
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('should reject', () => {
            [undefined, null, false].forEach((v) => {
                it(`statement of truth with ${v}`, () => {
                    const errors = validator.validateSync(new statementOfTruth_1.StatementOfTruth(signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE, v));
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, statementOfTruth_1.ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE);
                });
            });
        });
        describe('should accept', () => {
            it('statement of truth with true', () => {
                const errors = validator.validateSync(new statementOfTruth_1.StatementOfTruth(signatureType_1.SignatureType.BASIC, true));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
