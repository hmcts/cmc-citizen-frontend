"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const draftClaim_1 = require("drafts/models/draftClaim");
const claimAmount_1 = require("drafts/tasks/claimAmount");
const interestRateOption_1 = require("claim/form/models/interestRateOption");
const interestType_1 = require("claim/form/models/interestType");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
const interestDateType_1 = require("common/interestDateType");
const yesNoOption_1 = require("models/yesNoOption");
describe('Claim amount', () => {
    describe('isCompleted', () => {
        it('should return true when the task is completed and no interest has been selected', () => {
            const input = {
                amount: {
                    rows: [{
                            reason: 'Bills',
                            amount: 1000
                        }]
                },
                interest: {
                    option: yesNoOption_1.YesNoOption.NO
                }
            };
            const claim = new draftClaim_1.DraftClaim().deserialize(input);
            chai_1.expect(claimAmount_1.ClaimAmount.isCompleted(claim)).to.equal(true);
        });
        it('should return true when the task is completed and an interest type has been selected', () => {
            const input = {
                amount: {
                    rows: [{
                            reason: 'Bills',
                            amount: 10000
                        }]
                },
                interest: {
                    option: yesNoOption_1.YesNoOption.YES
                },
                interestType: {
                    option: interestType_1.InterestTypeOption.SAME_RATE
                },
                interestRate: {
                    type: interestRateOption_1.InterestRateOption.DIFFERENT,
                    rate: 10,
                    reason: 'Special case'
                },
                interestDate: {
                    type: interestDateType_1.InterestDateType.SUBMISSION
                },
                interestStartDate: {
                    date: {
                        day: 10,
                        month: 12,
                        year: 2016
                    },
                    reason: 'reason'
                },
                interestEndDate: {
                    option: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT
                }
            };
            const claim = new draftClaim_1.DraftClaim().deserialize(input);
            chai_1.expect(claimAmount_1.ClaimAmount.isCompleted(claim)).to.equal(true);
        });
        it('should return false if total amount is not completed', () => {
            const input = {
                amount: {
                    rows: [{
                            reason: 'Bills',
                            amount: 0
                        }]
                },
                interest: {
                    option: yesNoOption_1.YesNoOption.NO
                }
            };
            const claim = new draftClaim_1.DraftClaim().deserialize(input);
            chai_1.expect(claimAmount_1.ClaimAmount.isCompleted(claim)).to.equal(false);
        });
        it('should return false if interest type has not been set', () => {
            const input = {
                amount: {
                    rows: [{
                            reason: 'Bills',
                            amount: 0
                        }]
                }
            };
            const claim = new draftClaim_1.DraftClaim().deserialize(input);
            chai_1.expect(claimAmount_1.ClaimAmount.isCompleted(claim)).to.equal(false);
        });
    });
});
