"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const yesNoOption_1 = require("models/yesNoOption");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const partPaymentReceived_1 = require("claimant-response/form/models/states-paid/partPaymentReceived");
describe('PartPaymentReceived', () => {
    describe('Validation', () => {
        const validator = new class_validator_1.Validator();
        it('Should reject an undefined option', () => {
            const errors = validator.validateSync(new partPaymentReceived_1.PartPaymentReceived(undefined));
            chai_1.expect(errors).to.be.length(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('Should reject an invalid option', () => {
            const errors = validator.validateSync(new partPaymentReceived_1.PartPaymentReceived(yesNoOption_1.YesNoOption.fromObject('invalid option')));
            chai_1.expect(errors).to.be.length(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
    });
    describe('deserialize', () => {
        it('Should return an object with undefined defaults for undefined inputs', () => {
            chai_1.expect(new partPaymentReceived_1.PartPaymentReceived().deserialize(undefined)).to.be.deep.equal(new partPaymentReceived_1.PartPaymentReceived());
        });
        yesNoOption_1.YesNoOption.all().forEach(item => {
            it('Should return a valid instance for the given object', () => {
                chai_1.expect(new partPaymentReceived_1.PartPaymentReceived().deserialize({ received: item })).to.be.eql(new partPaymentReceived_1.PartPaymentReceived(item));
            });
        });
    });
    describe('fromObject', () => {
        yesNoOption_1.YesNoOption.all().forEach(item => {
            it(`Should return a valid object when ${item.option} is provided`, () => {
                const model = partPaymentReceived_1.PartPaymentReceived.fromObject({ received: item.option });
                chai_1.expect(model.received).to.be.eql(item);
            });
        });
        it('Should return undefined when undefined provided', () => {
            const model = partPaymentReceived_1.PartPaymentReceived.fromObject(undefined);
            chai_1.expect(model).to.be.eq(undefined);
        });
        it('Should return an empty object when unknown value provided', () => {
            const model = partPaymentReceived_1.PartPaymentReceived.fromObject({ accepted: 'unknown' });
            chai_1.expect(model.received).to.be.eq(undefined);
        });
    });
});
