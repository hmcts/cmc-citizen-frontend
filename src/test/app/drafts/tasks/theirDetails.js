"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const draftClaim_1 = require("drafts/models/draftClaim");
const theirDetails_1 = require("drafts/tasks/theirDetails");
describe('Their details', () => {
    describe('isCompleted', () => {
        it('should return true when the task is completed', () => {
            const input = {
                defendant: {
                    email: { address: 'example@example.com' },
                    partyDetails: {
                        type: 'individual',
                        firstName: 'Janice Henrieta',
                        lastName: 'Clark',
                        address: {
                            line1: 'Another lane',
                            line2: '',
                            line3: '',
                            city: 'Manchester',
                            postcode: 'SW8 4DA'
                        },
                        hasCorrespondenceAddress: false
                    }
                }
            };
            const claim = new draftClaim_1.DraftClaim().deserialize(input);
            chai_1.expect(theirDetails_1.TheirDetails.isCompleted(claim)).to.equal(true);
        });
        it('should return false when the task is not completed', () => {
            const claim = new draftClaim_1.DraftClaim();
            chai_1.expect(theirDetails_1.TheirDetails.isCompleted(claim)).to.equal(false);
        });
    });
});
