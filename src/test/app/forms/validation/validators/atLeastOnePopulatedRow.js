"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const atLeastOnePopulatedRow_1 = require("forms/validation/validators/atLeastOnePopulatedRow");
const EMPTY = true;
const POPULATED = false;
describe('AtLeastOnePopulatedRowConstraint', () => {
    const constraint = new atLeastOnePopulatedRow_1.AtLeastOnePopulatedRowConstraint();
    describe('validate', () => {
        context('should accept', () => {
            it('should accept undefined value', () => {
                chai_1.expect(constraint.validate(undefined)).to.be.equal(true);
            });
            it('array of populated objects', () => {
                chai_1.expect(constraint.validate([buildObject(POPULATED), buildObject(POPULATED), buildObject(POPULATED)])).to.be.equal(true);
            });
            it('array with only one populated object', () => {
                chai_1.expect(constraint.validate([buildObject(POPULATED)])).to.be.equal(true);
            });
            it('array with many objects, but only one populated', () => {
                chai_1.expect(constraint.validate([
                    buildObject(EMPTY), buildObject(EMPTY),
                    buildObject(POPULATED),
                    buildObject(EMPTY), buildObject(EMPTY)
                ])).to.be.equal(true);
            });
        });
        context('should reject', () => {
            it('empty object', () => {
                chai_1.expect(constraint.validate({})).to.be.equal(false);
            });
            it('empty array', () => {
                chai_1.expect(constraint.validate([])).to.be.equal(false);
            });
            it('array of empty objects', () => {
                chai_1.expect(constraint.validate([buildObject(EMPTY), buildObject(EMPTY)])).to.be.equal(false);
            });
        });
    });
});
function buildObject(isEmpty) {
    return {
        isEmpty: () => isEmpty
    };
}
