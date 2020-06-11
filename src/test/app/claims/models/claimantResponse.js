"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rawObjectUtils_1 = require("test/rawObjectUtils");
const claimantResponse_1 = require("claims/models/claimantResponse");
const claimantResponseData_1 = require("test/data/entity/claimantResponseData");
describe('ClaimantResponse', () => {
    describe('deserialize', () => {
        it('should return undefined when undefined input given', () => {
            const actual = claimantResponse_1.ClaimantResponse.deserialize(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        const tests = [
            { type: 'acceptation', data: claimantResponseData_1.ccjAcceptationClaimantResponseData },
            { type: 'rejection', data: claimantResponseData_1.rejectionClaimantResponseData }
        ];
        tests.forEach(test => it(`should deserialize valid JSON of type '${test.type}' to valid ClaimantResponse object`, () => {
            const actual = claimantResponse_1.ClaimantResponse.deserialize(claimantResponseData_1.rejectionClaimantResponseData);
            chai_1.expect(rawObjectUtils_1.convertToRawObject(actual)).to.be.deep.equal(claimantResponseData_1.rejectionClaimantResponseData);
        }));
    });
});
