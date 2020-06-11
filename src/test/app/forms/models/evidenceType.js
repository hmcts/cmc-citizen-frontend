"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const evidenceType_1 = require("forms/models/evidenceType");
describe('EvidenceType', () => {
    describe('valueOf', () => {
        it('should return EvidenceType object when valid input given', () => {
            const actual = evidenceType_1.EvidenceType.valueOf(evidenceType_1.EvidenceType.OTHER.value);
            chai_1.expect(actual).to.equal(evidenceType_1.EvidenceType.OTHER);
        });
        it('should return unknown when invalid input given', () => {
            const actual = evidenceType_1.EvidenceType.valueOf('unknown type');
            chai_1.expect(actual).to.equal(undefined);
        });
    });
    describe('all', () => {
        it('should return array of EvidenceType', () => {
            chai_1.expect(evidenceType_1.EvidenceType.all().length).to.equal(7);
        });
    });
});
