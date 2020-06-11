"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const stringUtils_1 = require("utils/stringUtils");
describe('StringUtils', () => {
    describe('trimToUndefined', () => {
        it('should return undefined if value is undefined', () => {
            chai_1.expect(stringUtils_1.StringUtils.trimToUndefined(undefined)).to.be.undefined;
        });
        it('should return undefined for blank string', () => {
            chai_1.expect(stringUtils_1.StringUtils.trimToUndefined('')).to.be.undefined;
        });
        it('should return undefined for empty string', () => {
            chai_1.expect(stringUtils_1.StringUtils.trimToUndefined('   ')).to.be.undefined;
        });
        it('should return trim string if on both ends', () => {
            chai_1.expect(stringUtils_1.StringUtils.trimToUndefined('  abc  ')).to.be.equal('abc');
        });
        it('should return unchanged string if there is nothing to trim', () => {
            chai_1.expect(stringUtils_1.StringUtils.trimToUndefined('abc')).to.be.equal('abc');
        });
    });
});
