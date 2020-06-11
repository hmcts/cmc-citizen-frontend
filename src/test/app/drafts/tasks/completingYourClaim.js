"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const draftClaim_1 = require("drafts/models/draftClaim");
const completingYourClaim_1 = require("drafts/tasks/completingYourClaim");
describe('Completing your claim', () => {
    describe('isCompleted', () => {
        it('should return true when the task is completed', () => {
            const input = {
                readCompletingClaim: true
            };
            const claim = new draftClaim_1.DraftClaim().deserialize(input);
            chai_1.expect(completingYourClaim_1.CompletingYourClaim.isCompleted(claim)).to.equal(true);
        });
        it('should return false when the task is not completed', () => {
            const claim = new draftClaim_1.DraftClaim();
            chai_1.expect(completingYourClaim_1.CompletingYourClaim.isCompleted(claim)).to.equal(false);
        });
    });
});
