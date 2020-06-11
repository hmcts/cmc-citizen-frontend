"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const bankAccountType_1 = require("response/form/models/statement-of-means/bankAccountType");
describe('BankAccountType', () => {
    describe('all', () => {
        it('should return an array', () => {
            const actual = bankAccountType_1.BankAccountType.all();
            chai_1.expect(actual).instanceof(Array);
            chai_1.expect(actual.length).to.eq(4);
        });
    });
    describe('valueOf', () => {
        it('should return undefined when undefined given', () => {
            const actual = bankAccountType_1.BankAccountType.valueOf(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it('should return undefined when unknown type given', () => {
            const actual = bankAccountType_1.BankAccountType.valueOf('I do not know this type!');
            chai_1.expect(actual).to.be.eq(undefined);
        });
        bankAccountType_1.BankAccountType.all().forEach(type => {
            it(`should return valid object for ${type.value}`, () => {
                const actual = bankAccountType_1.BankAccountType.valueOf(type.value);
                chai_1.expect(actual).to.be.equal(type);
            });
        });
    });
});
