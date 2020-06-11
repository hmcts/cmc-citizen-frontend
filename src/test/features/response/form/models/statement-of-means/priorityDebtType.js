"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const priorityDebtType_1 = require("response/form/models/statement-of-means/priorityDebtType");
const chai_1 = require("chai");
describe('PriorityDebtType', () => {
    describe('all', () => {
        it('should return an array with all PriorityDebtTypes', () => {
            const actual = priorityDebtType_1.PriorityDebtType.all();
            chai_1.expect(actual).instanceof(Array);
            chai_1.expect(actual.length).to.be.equal(7);
        });
    });
    describe('value of', () => {
        it('should return undefined when given undefined', () => {
            chai_1.expect(priorityDebtType_1.PriorityDebtType.valueOf(undefined)).to.be.equal(undefined);
        });
        it('should return undefined when given unknown type', () => {
            chai_1.expect(priorityDebtType_1.PriorityDebtType.valueOf('unknown type test')).to.be.equal(undefined);
        });
        priorityDebtType_1.PriorityDebtType.all().forEach(type => {
            it(`should return a valid PriorityDebtType for ${type.value}`, () => {
                const actual = priorityDebtType_1.PriorityDebtType.valueOf(type.value);
                chai_1.expect(actual.value).to.be.equal(type.value);
            });
        });
    });
});
