"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const moment = require("moment");
const minimumAgeValidator_1 = require("forms/validation/validators/minimumAgeValidator");
const maximumAgeValidator_1 = require("forms/validation/validators/maximumAgeValidator");
const localDate_1 = require("forms/models/localDate");
describe('MinimumAgeValidatorConstraint', () => {
    const constraint = new minimumAgeValidator_1.MinimumAgeValidatorConstraint();
    const minMessage = 'Min Years in the past has to be specified and positive value';
    describe('validate', () => {
        const today = moment();
        it('should throw an error if minYears constraint is not set', () => {
            chai_1.expect(() => constraint.validate(null, yearsLimit(undefined))).to.throw(Error, minMessage);
        });
        it('should accept past date grater than minimum age', () => {
            chai_1.expect(constraint.validate(new localDate_1.LocalDate(today.year() - 19, today.month() + 1, today.date()), yearsLimit(18))).to.be.equal(true);
        });
        it('should accept undefined value', () => {
            chai_1.expect(constraint.validate(undefined, yearsLimit(1))).to.be.equal(true);
        });
        it('should accept undefined value', () => {
            chai_1.expect(constraint.validate(undefined, yearsLimit(1))).to.be.equal(true);
        });
        it('should reject values other then LocalDate', () => {
            chai_1.expect(constraint.validate({}, yearsLimit(1))).to.be.equal(false);
        });
        it('should reject future date', () => {
            chai_1.expect(constraint.validate(new localDate_1.LocalDate(today.year(), today.month() + 1, today.date() + 1), yearsLimit(1))).to.be.equal(false);
        });
        it('should reject current date', () => {
            chai_1.expect(constraint.validate(new localDate_1.LocalDate(today.year(), today.month() + 1, today.date()), yearsLimit(1))).to.be.equal(false);
        });
        it('should reject past date out of the range', () => {
            chai_1.expect(constraint.validate(new localDate_1.LocalDate(today.year() - 17, today.month() + 1, today.date()), yearsLimit(18))).to.be.equal(false);
        });
        it('should accept past date within range', () => {
            chai_1.expect(constraint.validate(new localDate_1.LocalDate(today.year() - 1, today.month() + 1, today.date()), yearsLimit(1))).to.be.equal(true);
        });
    });
});
describe('MaximumAgeValidatorConstraint', () => {
    const constraint = new maximumAgeValidator_1.MaximumAgeValidatorConstraint();
    const maxMessage = 'Max Years in the past has to be specified and positive value';
    describe('validate', () => {
        const today = moment();
        it('should throw an error if maxYears constraint is not set', () => {
            chai_1.expect(() => constraint.validate(null, yearsLimit(undefined))).to.throw(Error, maxMessage);
        });
        it('should accept past date lesser than maximum age', () => {
            chai_1.expect(constraint.validate(new localDate_1.LocalDate(today.year() - 149, today.month() + 1, today.date()), yearsLimit(150))).to.be.equal(true);
        });
        it('should accept undefined value', () => {
            chai_1.expect(constraint.validate(undefined, yearsLimit(1))).to.be.equal(true);
        });
        it('should accept undefined value', () => {
            chai_1.expect(constraint.validate(undefined, yearsLimit(1))).to.be.equal(true);
        });
        it('should reject values other then LocalDate', () => {
            chai_1.expect(constraint.validate({}, yearsLimit(1))).to.be.equal(false);
        });
        it('should reject past date out of the range', () => {
            chai_1.expect(constraint.validate(new localDate_1.LocalDate(today.year() - 151, today.month() + 1, today.date()), yearsLimit(150))).to.be.equal(false);
        });
        it('should accept past date within range', () => {
            chai_1.expect(constraint.validate(new localDate_1.LocalDate(today.year() - 1, today.month() + 1, today.date()), yearsLimit(1))).to.be.equal(true);
        });
    });
});
function yearsLimit(value) {
    return {
        value: undefined,
        targetName: undefined,
        object: undefined,
        property: undefined,
        constraints: [value]
    };
}
