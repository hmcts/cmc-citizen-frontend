"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const convertToPounds_1 = require("modules/nunjucks/filters/convertToPounds");
describe('convertToPoundsFilter', () => {
    it('converts pennies to pounds', () => {
        chai_1.expect(convertToPounds_1.convertToPoundsFilter(151)).to.eq(1.51);
        chai_1.expect(convertToPounds_1.convertToPoundsFilter(150)).to.eq(1.5);
        chai_1.expect(convertToPounds_1.convertToPoundsFilter(100)).to.eq(1);
    });
    describe('throws exception when', () => {
        it('undefined given', () => {
            expectToThrowError(undefined);
        });
        it('non number given', () => {
            expectToThrowError('Hi');
        });
    });
});
function expectToThrowError(input) {
    chai_1.expect(() => {
        convertToPounds_1.convertToPoundsFilter(input);
    }).to.throw(Error, 'Value should be a number');
}
