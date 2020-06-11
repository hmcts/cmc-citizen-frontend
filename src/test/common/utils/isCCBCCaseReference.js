"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const isCCBCCaseReference_1 = require("shared/utils/isCCBCCaseReference");
describe('isCCBCCaseReference', () => {
    describe('should return true when ', () => {
        it('ccbc identifier is A1QZ1234', () => {
            const referenceNumber = 'A1QZ1234';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.true;
        });
        it('ccbc identifier is A1QZ123A', () => {
            const referenceNumber = 'A1QZ123A';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.true;
        });
        it('ccbc identifier is A1QZ1A23', () => {
            const referenceNumber = 'A1QZ1A23';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.true;
        });
        it('ccbc identifier is A1QZ1A2A', () => {
            const referenceNumber = 'A1QZ1A2A';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.true;
        });
        it('ccbc identifier is A1QZ12AA', () => {
            const referenceNumber = 'A1QZ12AA';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.true;
        });
        it('ccbc identifier is A1A11231', () => {
            const referenceNumber = 'A1A11231';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.true;
        });
        it('ccbc identifier is contained but not at the start', () => {
            const referenceNumber = '111AA167';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.true;
        });
    });
    describe('should return false when ', () => {
        it('ccbc identifier is AA131231', () => {
            const referenceNumber = 'AA131231';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.false;
        });
        it('ccbc identifier is A1AAA231', () => {
            const referenceNumber = 'A1AAA231';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.false;
        });
        it('ccbc identifier is 1QZ12345', () => {
            const referenceNumber = '1QZ12345';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.false;
        });
        it('ccbc identifier doesn’t match', () => {
            const referenceNumber = '000MC001';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.false;
        });
        it('ccbc identifier is PBA1C001', () => {
            const referenceNumber = 'PBA1C001';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.false;
        });
        it('empty reference', () => {
            const referenceNumber = '';
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.false;
        });
        it('undefined reference', () => {
            const referenceNumber = undefined;
            chai_1.expect(isCCBCCaseReference_1.isCCBCCaseReference(referenceNumber)).to.be.false;
        });
    });
});
