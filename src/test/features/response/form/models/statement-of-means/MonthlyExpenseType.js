"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const monthlyExpenseType_1 = require("response/form/models/statement-of-means/monthlyExpenseType");
describe('MonthlyExpenseType', () => {
    describe('all', () => {
        it('should return an array', () => {
            const actual = monthlyExpenseType_1.MonthlyExpenseType.all();
            chai_1.expect(actual).instanceof(Array);
            chai_1.expect(actual.length).to.eq(14);
        });
    });
    describe('valueOf', () => {
        it('should return undefined when undefined given', () => {
            const actual = monthlyExpenseType_1.MonthlyExpenseType.valueOf(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it('should return undefined when unknown type given', () => {
            const actual = monthlyExpenseType_1.MonthlyExpenseType.valueOf('I do not know this type!');
            chai_1.expect(actual).to.be.eq(undefined);
        });
        monthlyExpenseType_1.MonthlyExpenseType.all().forEach(type => {
            it(`should return valid object for ${type.value}`, () => {
                const actual = monthlyExpenseType_1.MonthlyExpenseType.valueOf(type.value);
                chai_1.expect(actual).to.be.equal(type);
            });
        });
    });
});
