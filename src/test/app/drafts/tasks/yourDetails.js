"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const draftClaim_1 = require("drafts/models/draftClaim");
const yourDetails_1 = require("drafts/tasks/yourDetails");
describe('Your details', () => {
    describe('isCompleted', () => {
        it('should return true when the task is completed', () => {
            const input = {
                claimant: {
                    phone: {
                        number: '7123123123'
                    },
                    partyDetails: {
                        type: 'individual',
                        address: { line1: 'Here', line2: 'There', line3: '', city: 'London', postcode: 'BB12 7NQ' },
                        name: 'John Doe',
                        dateOfBirth: {
                            known: 'true',
                            date: {
                                day: 10,
                                month: 11,
                                year: 1990
                            }
                        }
                    }
                }
            };
            const claim = new draftClaim_1.DraftClaim().deserialize(input);
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(claim)).to.equal(true);
        });
        it('should return false when the task is not completed', () => {
            const claim = new draftClaim_1.DraftClaim();
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(claim)).to.equal(false);
        });
    });
});
