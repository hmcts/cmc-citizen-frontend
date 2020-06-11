"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const moment = require("moment");
const isTodayOrInFuture_1 = require("forms/validation/validators/isTodayOrInFuture");
const localDate_1 = require("forms/models/localDate");
describe('DateTodayOrInFutureConstraint', () => {
    const constraint = new isTodayOrInFuture_1.DateTodayOrInFutureConstraint();
    describe('validate', () => {
        describe('should return true when ', () => {
            it('given a date is undefined', () => {
                chai_1.expect(constraint.validate(undefined)).to.equal(true);
            });
            it('given a valid date in the future', () => {
                const inFuture = moment().add(10, 'years');
                chai_1.expect(constraint.validate(new localDate_1.LocalDate(inFuture.year(), 1, 1))).to.equal(true);
            });
            it('given today date', () => {
                const now = moment();
                chai_1.expect(constraint.validate(new localDate_1.LocalDate(now.year(), now.month() + 1, now.date()))).to.equal(true);
            });
        });
        describe('should return false when ', () => {
            it('given an invalid structure', () => {
                chai_1.expect(constraint.validate({ a: 1, b: 1, c: 2000 })).to.equal(false);
            });
            it('given a date in the past', () => {
                const inPast = moment().subtract(10, 'years');
                chai_1.expect(constraint.validate(new localDate_1.LocalDate(inPast.year(), 8, 8))).to.equal(false);
            });
        });
    });
});
