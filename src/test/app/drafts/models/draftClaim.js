"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const draftClaim_1 = require("drafts/models/draftClaim");
const claimant_1 = require("drafts/models/claimant");
const defendant_1 = require("drafts/models/defendant");
function verifyDefaultValues(initialValue) {
    const actualDraft = new draftClaim_1.DraftClaim().deserialize(initialValue);
    const expected = new draftClaim_1.DraftClaim();
    chai_1.expect(actualDraft.claimant).to.eql(expected.claimant);
    chai_1.expect(actualDraft.amount).to.eql(expected.amount);
    chai_1.expect(actualDraft.interest).to.eql(expected.interest);
    chai_1.expect(actualDraft.interestDate).to.eql(expected.interestDate);
    chai_1.expect(actualDraft.reason).to.eql(expected.reason);
    chai_1.expect(actualDraft.readResolveDispute).to.eql(expected.readResolveDispute);
    chai_1.expect(actualDraft.readCompletingClaim).to.eql(expected.readCompletingClaim);
}
describe('DraftClaim', () => {
    describe('constructor', () => {
        it('should have instance fields initialised where possible', () => {
            let draftClaim = new draftClaim_1.DraftClaim();
            chai_1.expect(draftClaim.claimant).to.be.instanceof(claimant_1.Claimant);
            chai_1.expect(draftClaim.defendant).to.be.instanceof(defendant_1.Defendant);
        });
    });
    describe('deserialize', () => {
        it('with undefined value should return a DraftClaim instance initialised with defaults', () => {
            verifyDefaultValues(undefined);
        });
        it('with null value should return a DraftClaim instance initialised with defaults', () => {
            verifyDefaultValues(null);
        });
    });
});
