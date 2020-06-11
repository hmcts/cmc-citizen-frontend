"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const draftClaim_1 = require("drafts/models/draftClaim");
const claimDetails_1 = require("drafts/tasks/claimDetails");
describe('Claim details', () => {
    describe('isCompleted', () => {
        it('should return true when timeline has a row and reason is given', () => {
            const input = {
                timeline: {
                    rows: [{
                            date: 'may',
                            description: 'it is ok'
                        }]
                },
                reason: { reason: 'It is my reason' }
            };
            const claim = new draftClaim_1.DraftClaim().deserialize(input);
            chai_1.expect(claimDetails_1.ClaimDetails.isCompleted(claim)).to.equal(true);
        });
        context('should return false', () => {
            it('timeline has no rows and reason is valid', () => {
                const input = {
                    timeline: {
                        rows: []
                    },
                    reason: 'It is my reason'
                };
                const claim = new draftClaim_1.DraftClaim().deserialize(input);
                chai_1.expect(claimDetails_1.ClaimDetails.isCompleted(claim)).to.equal(false);
            });
            it('timeline has row but reason is empty', () => {
                const input = {
                    timeline: {
                        rows: [{
                                date: 'may',
                                description: 'it is ok'
                            }]
                    },
                    reason: ''
                };
                const claim = new draftClaim_1.DraftClaim().deserialize(input);
                chai_1.expect(claimDetails_1.ClaimDetails.isCompleted(claim)).to.equal(false);
            });
        });
    });
});
