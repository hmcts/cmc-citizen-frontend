"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dateFutureConstraint_1 = require("forms/validation/validators/dateFutureConstraint");
const localDate_1 = require("forms/models/localDate");
const momentFactory_1 = require("shared/momentFactory");
const validationArgs = {
    value: undefined,
    targetName: undefined,
    object: undefined,
    property: undefined,
    constraints: [0]
};
describe('DateFutureConstraint', () => {
    const constraint = new dateFutureConstraint_1.DateFutureConstraint();
    describe('validate', () => {
        describe('should return true when ', () => {
            it('given a date is undefined', () => {
                chai_1.expect(constraint.validate(undefined)).to.equal(true);
            });
            it('given a valid date in the future', () => {
                const inFuture = momentFactory_1.MomentFactory.currentDate().add(10, 'years');
                chai_1.expect(constraint.validate(new localDate_1.LocalDate(inFuture.year(), 1, 1), validationArgs)).to.equal(true);
            });
        });
        describe('should return false when ', () => {
            it('given an invalid structure', () => {
                chai_1.expect(constraint.validate({ a: 1, b: 1, c: 2000 }, validationArgs)).to.equal(false);
            });
            it('given today date', () => {
                const now = momentFactory_1.MomentFactory.currentDate();
                chai_1.expect(constraint.validate(new localDate_1.LocalDate(now.year(), now.month() + 1, now.date()), validationArgs)).to.equal(false);
            });
            it('given a date in the past', () => {
                const inPast = momentFactory_1.MomentFactory.currentDate().subtract(10, 'years');
                chai_1.expect(constraint.validate(new localDate_1.LocalDate(inPast.year(), 8, 8), validationArgs)).to.equal(false);
            });
        });
    });
});
