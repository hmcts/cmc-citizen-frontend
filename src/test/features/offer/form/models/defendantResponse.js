"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const defendantResponse_1 = require("offer/form/models/defendantResponse");
const statementType_1 = require("offer/form/models/statementType");
describe('DefendantResponse', () => {
    describe('constructor', () => {
        it('should set the fields to undefined', () => {
            const defendantResponse = new defendantResponse_1.DefendantResponse();
            chai_1.expect(defendantResponse.option).to.be.equal(undefined);
        });
    });
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(defendantResponse_1.DefendantResponse.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(defendantResponse_1.DefendantResponse.fromObject({})).to.deep.equal(new defendantResponse_1.DefendantResponse());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(defendantResponse_1.DefendantResponse.fromObject({ option: statementType_1.StatementType.ACCEPTATION.value })).to.deep.equal(new defendantResponse_1.DefendantResponse(statementType_1.StatementType.ACCEPTATION));
        });
    });
    describe('deserialization', () => {
        it('should return instance initialised with defaults given undefined', () => {
            chai_1.expect(new defendantResponse_1.DefendantResponse().deserialize(undefined)).to.deep.equal(new defendantResponse_1.DefendantResponse());
        });
        it('should return instance with set fields from given object', () => {
            chai_1.expect(new defendantResponse_1.DefendantResponse().deserialize({ option: statementType_1.StatementType.ACCEPTATION.value })).to.deep.equal(new defendantResponse_1.DefendantResponse(statementType_1.StatementType.ACCEPTATION));
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('should reject when', () => {
            it('undefined option', () => {
                const errors = validator.validateSync(new defendantResponse_1.DefendantResponse(undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, defendantResponse_1.ValidationErrors.OPTION_REQUIRED);
            });
        });
        describe('should accept when', () => {
            context('valid form with selected option', () => {
                it('Acceptation', () => {
                    const errors = validator.validateSync(new defendantResponse_1.DefendantResponse(statementType_1.StatementType.ACCEPTATION));
                    chai_1.expect(errors.length).to.equal(0);
                });
                it('Rejection', () => {
                    const errors = validator.validateSync(new defendantResponse_1.DefendantResponse(statementType_1.StatementType.REJECTION));
                    chai_1.expect(errors.length).to.equal(0);
                });
                it('Make Counter Offer', () => {
                    const errors = validator.validateSync(new defendantResponse_1.DefendantResponse(statementType_1.StatementType.OFFER));
                    chai_1.expect(errors.length).to.equal(0);
                });
            });
        });
    });
});
