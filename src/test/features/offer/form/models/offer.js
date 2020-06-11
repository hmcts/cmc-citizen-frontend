"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const offer_1 = require("offer/form/models/offer");
const localDate_1 = require("forms/models/localDate");
const moment = require("moment");
describe('Offer', () => {
    describe('constructor', () => {
        it('should set the fields to undefined', () => {
            const offer = new offer_1.Offer();
            chai_1.expect(offer.offerText).to.be.equal(undefined);
            chai_1.expect(offer.completionDate).to.be.equal(undefined);
        });
    });
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(offer_1.Offer.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(offer_1.Offer.fromObject({})).to.deep.equal(new offer_1.Offer());
        });
        it('should deserialize all fields', () => {
            const date = new localDate_1.LocalDate();
            chai_1.expect(offer_1.Offer.fromObject({
                offerText: 'offer Text',
                completionDate: date
            })).to.deep.equal(new offer_1.Offer('offer Text', date));
        });
    });
    describe('deserialization', () => {
        it('should return instance initialised with defaults given undefined', () => {
            chai_1.expect(new offer_1.Offer().deserialize(undefined)).to.deep.equal(new offer_1.Offer());
        });
        it('should return instance with set fields from given object', () => {
            const date = new localDate_1.LocalDate();
            chai_1.expect(new offer_1.Offer().deserialize({
                offerText: 'offer Text',
                completionDate: date.asString()
            })).to.deep.equal(new offer_1.Offer('offer Text', date));
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('should reject when', () => {
            it('undefined offer text', () => {
                const futureDate = moment().add(10, 'days');
                const date = new localDate_1.LocalDate(futureDate.year(), futureDate.month(), futureDate.day());
                const errors = validator.validateSync(new offer_1.Offer('', date));
                chai_1.expect(errors.length).to.equal(2);
                validationUtils_1.expectValidationError(errors, offer_1.ValidationErrors.OFFER_REQUIRED);
            });
            it('undefined offer date', () => {
                const errors = validator.validateSync(new offer_1.Offer('offer text', undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, offer_1.ValidationErrors.DATE_REQUIRED);
            });
            it('date in past', () => {
                const errors = validator.validateSync(new offer_1.Offer('offer text', new localDate_1.LocalDate(1980, 10, 11)));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, offer_1.ValidationErrors.FUTURE_DATE);
            });
        });
        describe('should accept when', () => {
            it('offer text and future date', () => {
                const futureDate = moment().add(10, 'days');
                const date = new localDate_1.LocalDate(futureDate.year(), futureDate.month() + 1, futureDate.date());
                const errors = validator.validateSync(new offer_1.Offer('offer text', date));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
