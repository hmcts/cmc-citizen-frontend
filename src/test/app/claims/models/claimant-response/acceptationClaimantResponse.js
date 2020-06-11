"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rawObjectUtils_1 = require("test/rawObjectUtils");
const acceptationClaimantResponse_1 = require("claims/models/claimant-response/acceptationClaimantResponse");
const claimantResponseData_1 = require("test/data/entity/claimantResponseData");
describe('AcceptationClaimantResponse', () => {
    describe('deserialize', () => {
        it('should return undefined when undefined input given', () => {
            const actual = acceptationClaimantResponse_1.AcceptationClaimantResponse.deserialize(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it(`should deserialize valid JSON with no optionals to valid AcceptationClaimantResponse object`, () => {
            const acceptationClaimantResponseWithNoOptionalsData = Object.assign({}, claimantResponseData_1.ccjAcceptationClaimantResponseData);
            delete acceptationClaimantResponseWithNoOptionalsData.claimantPaymentIntention;
            delete acceptationClaimantResponseWithNoOptionalsData.courtDetermination;
            const actual = acceptationClaimantResponse_1.AcceptationClaimantResponse.deserialize(acceptationClaimantResponseWithNoOptionalsData);
            chai_1.expect(rawObjectUtils_1.convertToRawObject(actual)).to.be.deep.equal(acceptationClaimantResponseWithNoOptionalsData);
        });
        const tests = [
            { type: 'CCJ', data: claimantResponseData_1.ccjAcceptationClaimantResponseData },
            { type: 'Settlement Agreement', data: claimantResponseData_1.settlementAcceptationClaimantResponseData },
            { type: 'Refer to Judge', data: claimantResponseData_1.referToJudgeAcceptationClaimantResponseData }
        ];
        tests.forEach(test => it(`should deserialize valid JSON of type '${test.type}' to valid AcceptationClaimantResponse object`, () => {
            const actual = acceptationClaimantResponse_1.AcceptationClaimantResponse.deserialize(test.data);
            chai_1.expect(rawObjectUtils_1.convertToRawObject(actual)).to.be.deep.equal(test.data);
        }));
    });
});
