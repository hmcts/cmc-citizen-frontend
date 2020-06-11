"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const residenceType_1 = require("response/form/models/statement-of-means/residenceType");
describe('ResidenceType', () => {
    describe('all', () => {
        it('should contain expected items only', () => {
            chai_1.expect(residenceType_1.ResidenceType.all()).to.have.members([
                residenceType_1.ResidenceType.OWN_HOME,
                residenceType_1.ResidenceType.JOINT_OWN_HOME,
                residenceType_1.ResidenceType.PRIVATE_RENTAL,
                residenceType_1.ResidenceType.COUNCIL_OR_HOUSING_ASSN_HOME,
                residenceType_1.ResidenceType.OTHER
            ]);
        });
    });
    describe('valueOf', () => {
        it('should return correct values', () => {
            residenceType_1.ResidenceType.all().forEach((element) => {
                chai_1.expect(residenceType_1.ResidenceType.valueOf(element.value).value).to.equal(element.value);
            });
        });
        it('should return undefined when given undefined as input', () => {
            chai_1.expect(residenceType_1.ResidenceType.valueOf(undefined)).to.be.undefined;
        });
    });
    describe('except', () => {
        it('should throw error where no exception is provided', () => {
            chai_1.expect(() => residenceType_1.ResidenceType.except(undefined)).to.throw(Error);
        });
        it('should return all items except for the provided one', () => {
            const filtered = residenceType_1.ResidenceType.except(residenceType_1.ResidenceType.OTHER);
            chai_1.expect(filtered).to.contain(residenceType_1.ResidenceType.OWN_HOME);
            chai_1.expect(filtered).to.contain(residenceType_1.ResidenceType.JOINT_OWN_HOME);
            chai_1.expect(filtered).to.contain(residenceType_1.ResidenceType.PRIVATE_RENTAL);
            chai_1.expect(filtered).to.contain(residenceType_1.ResidenceType.COUNCIL_OR_HOUSING_ASSN_HOME);
            chai_1.expect(filtered).not.to.contain(residenceType_1.ResidenceType.OTHER);
        });
    });
});
