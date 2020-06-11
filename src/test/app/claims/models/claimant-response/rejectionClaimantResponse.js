"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rawObjectUtils_1 = require("test/rawObjectUtils");
const rejectionClaimantResponse_1 = require("claims/models/claimant-response/rejectionClaimantResponse");
const claimantResponseData_1 = require("test/data/entity/claimantResponseData");
describe('RejectionClaimantResponse', () => {
    describe('deserialize', () => {
        it('should return undefined when undefined input given', () => {
            const actual = rejectionClaimantResponse_1.RejectionClaimantResponse.deserialize(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it(`should deserialize valid JSON with no optionals to valid RejectionClaimantResponse object`, () => {
            const rejectionClaimantResponseDataWithNoOptionalsData = Object.assign({}, claimantResponseData_1.rejectionClaimantResponseData);
            delete rejectionClaimantResponseDataWithNoOptionalsData.freeMediation;
            delete rejectionClaimantResponseDataWithNoOptionalsData.reason;
            const actual = rejectionClaimantResponse_1.RejectionClaimantResponse.deserialize(rejectionClaimantResponseDataWithNoOptionalsData);
            chai_1.expect(rawObjectUtils_1.convertToRawObject(actual)).to.be.deep.equal(rejectionClaimantResponseDataWithNoOptionalsData);
        });
        it(`should deserialize valid JSON to valid RejectionClaimantResponse object`, () => {
            const actual = rejectionClaimantResponse_1.RejectionClaimantResponse.deserialize(claimantResponseData_1.rejectionClaimantResponseData);
            chai_1.expect(rawObjectUtils_1.convertToRawObject(actual)).to.be.deep.equal(claimantResponseData_1.rejectionClaimantResponseData);
        });
    });
});
