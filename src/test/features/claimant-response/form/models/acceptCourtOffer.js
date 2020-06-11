"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validationErrors_1 = require("forms/validation/validationErrors");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const chai_1 = require("chai");
const acceptCourtOffer_1 = require("claimant-response/form/models/acceptCourtOffer");
const yesNoOption_1 = require("models/yesNoOption");
const class_validator_1 = require("@hmcts/class-validator");
describe('AcceptCourtOffer', () => {
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject when undefined option', () => {
            const errors = validator.validateSync(new acceptCourtOffer_1.AcceptCourtOffer(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject when invalid option', () => {
            const errors = validator.validateSync(new acceptCourtOffer_1.AcceptCourtOffer(yesNoOption_1.YesNoOption.fromObject('invalid')));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should accept when recognised option', () => {
            yesNoOption_1.YesNoOption.all().forEach(type => {
                const errors = validator.validateSync(new acceptCourtOffer_1.AcceptCourtOffer(type));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
    describe('fromObject should return', () => {
        it('undefined when undefined provided', () => {
            const model = acceptCourtOffer_1.AcceptCourtOffer.fromObject(undefined);
            chai_1.expect(model).to.be.eq(undefined);
        });
        it('empty object when unknown value provided', () => {
            const model = acceptCourtOffer_1.AcceptCourtOffer.fromObject({ accept: 'I do not know this value!' });
            chai_1.expect(model.accept).to.be.eq(undefined);
        });
        yesNoOption_1.YesNoOption.all().forEach(item => {
            it(`valid object when ${item.option} provided`, () => {
                const model = acceptCourtOffer_1.AcceptCourtOffer.fromObject({ accept: item.option });
                chai_1.expect(model.accept).to.be.eq(item);
            });
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new acceptCourtOffer_1.AcceptCourtOffer().deserialize(undefined)).to.be.eql(new acceptCourtOffer_1.AcceptCourtOffer());
        });
        yesNoOption_1.YesNoOption.all().forEach(item => {
            it('should return an instance from given object', () => {
                const actual = new acceptCourtOffer_1.AcceptCourtOffer().deserialize({ accept: item });
                chai_1.expect(actual).to.be.eql(new acceptCourtOffer_1.AcceptCourtOffer(item));
            });
        });
    });
});
