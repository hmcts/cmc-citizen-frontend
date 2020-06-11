"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const partyType_1 = require("common/partyType");
const partyTypeResponse_1 = require("forms/models/partyTypeResponse");
describe('PartyTypeResponse', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(partyTypeResponse_1.PartyTypeResponse.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should return null when value is null', () => {
            chai_1.expect(partyTypeResponse_1.PartyTypeResponse.fromObject(null)).to.be.equal(null);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(partyTypeResponse_1.PartyTypeResponse.fromObject({})).to.deep.equal(new partyTypeResponse_1.PartyTypeResponse());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(partyTypeResponse_1.PartyTypeResponse.fromObject({
                type: partyType_1.PartyType.INDIVIDUAL.value
            })).to.deep.equal(new partyTypeResponse_1.PartyTypeResponse(partyType_1.PartyType.INDIVIDUAL));
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject undefined type', () => {
            const errors = validator.validateSync(new partyTypeResponse_1.PartyTypeResponse(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, partyTypeResponse_1.ValidationErrors.TYPE_REQUIRED);
        });
        it('should accept valid type', () => {
            partyType_1.PartyType.all().forEach(type => {
                const errors = validator.validateSync(new partyTypeResponse_1.PartyTypeResponse(type));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
