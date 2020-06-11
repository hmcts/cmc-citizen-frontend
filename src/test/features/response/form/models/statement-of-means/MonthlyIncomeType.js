"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const monthlyIncomeType_1 = require("response/form/models/statement-of-means/monthlyIncomeType");
describe('MonthlyIncomeType', () => {
    describe('all', () => {
        it('should return an array', () => {
            const actual = monthlyIncomeType_1.MonthlyIncomeType.all();
            chai_1.expect(actual).instanceof(Array);
            chai_1.expect(actual.length).to.eq(11);
        });
    });
    describe('valueOf', () => {
        it('should return undefined when undefined given', () => {
            const actual = monthlyIncomeType_1.MonthlyIncomeType.valueOf(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it('should return undefined when unknown type given', () => {
            const actual = monthlyIncomeType_1.MonthlyIncomeType.valueOf('I do not know this type!');
            chai_1.expect(actual).to.be.eq(undefined);
        });
        monthlyIncomeType_1.MonthlyIncomeType.all().forEach(type => {
            it(`should return valid object for ${type.value}`, () => {
                const actual = monthlyIncomeType_1.MonthlyIncomeType.valueOf(type.value);
                chai_1.expect(actual).to.be.equal(type);
            });
        });
    });
});
