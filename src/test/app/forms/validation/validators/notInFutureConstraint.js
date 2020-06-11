"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const moment = require("moment");
const notInFuture_1 = require("forms/validation/validators/notInFuture");
const localDate_1 = require("forms/models/localDate");
describe('DateNotInFutureConstraint', () => {
    const constraint = new notInFuture_1.DateNotInFutureConstraint();
    describe('validate', () => {
        describe('should return true when ', () => {
            it('given a date is undefined', () => {
                chai_1.expect(constraint.validate(undefined)).to.equal(true);
            });
            it('given a valid date in the past', () => {
                chai_1.expect(constraint.validate(new localDate_1.LocalDate(2000, 1, 1))).to.equal(true);
            });
            it('given an empty values', () => {
                chai_1.expect(constraint.validate(new localDate_1.LocalDate())).to.equal(true);
                chai_1.expect(constraint.validate(new localDate_1.LocalDate(undefined, undefined, undefined))).to.equal(true);
            });
            it('given today date', () => {
                let now = moment();
                chai_1.expect(constraint.validate(new localDate_1.LocalDate(now.year(), now.month() + 1, now.date()))).to.equal(true);
            });
        });
        describe('should return false when ', () => {
            it('given an invalid structure', () => {
                chai_1.expect(constraint.validate({ a: 1, b: 1, c: 2000 })).to.equal(false);
            });
            it('given a valid date in the future', () => {
                let inFuture = moment().add(10, 'years');
                chai_1.expect(constraint.validate(new localDate_1.LocalDate(inFuture.year(), 1, 1))).to.equal(false);
            });
        });
    });
});
