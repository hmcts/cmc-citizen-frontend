"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const numericUtils_1 = require("shared/utils/numericUtils");
describe('toNumberOrUndefined', () => {
    context('should return undefined when', () => {
        it('undefined given', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined(undefined)).to.be.eq(undefined);
        });
        it('NaN given', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined(NaN)).to.be.eq(undefined);
        });
        it('null given', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined(null)).to.be.eq(undefined);
        });
        it('false given', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined(false)).to.be.eq(undefined);
        });
        it('empty given', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('')).to.be.eq(undefined);
        });
        it('blank given', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('    \t\n')).to.be.eq(undefined);
        });
        it('string given', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('lalala')).to.be.eq(undefined);
        });
        it('given 1110,100', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('1110,100')).to.be.eq(undefined);
        });
        it('given 11,10', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('11,10')).to.be.eq(undefined);
        });
        it('given 1,1110.101', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('1,1110.101')).to.be.eq(undefined);
        });
    });
    context('should return number when', () => {
        it('0 given', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined(0)).to.be.eq(0);
        });
        it('negative number given', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined(-10)).to.be.eq(-10);
        });
        it('positive number given', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined(10)).to.be.eq(10);
        });
        it('decimal number given', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined(10.10)).to.be.eq(10.10);
        });
        it('given "0" ', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('0')).to.be.eq(0);
        });
        it('given "-10" ', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('-10')).to.be.eq(-10);
        });
        it('given "-10.1098978" ', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('-10.1098978')).to.be.eq(-10.1098978);
        });
        it('given "10" ', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('10')).to.be.eq(10);
        });
        it('given "1,100" ', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('1,100')).to.be.eq(1100);
        });
        it('given "110,100" ', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('110,100')).to.be.eq(110100);
        });
        it('given "1,110,100" ', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('1,110,100')).to.be.eq(1110100);
        });
        it('given 10.10', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('10.10')).to.be.eq(10.10);
        });
        it('given "110.111" ', () => {
            chai_1.expect(numericUtils_1.toNumberOrUndefined('110.111')).to.be.eq(110.111);
        });
    });
});
