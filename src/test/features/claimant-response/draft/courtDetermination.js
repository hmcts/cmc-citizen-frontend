"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const courtDetermination_1 = require("claimant-response/draft/courtDetermination");
const decisionType_1 = require("common/court-calculations/decisionType");
const paymentIntentionDraft_1 = require("test/data/draft/paymentIntentionDraft");
const rejectionReason_1 = require("claimant-response/form/models/rejectionReason");
describe('CourtDetermination', () => {
    context('deserialize', () => {
        it('should return instance initialised with defaults given undefined', () => {
            chai_1.expect(new courtDetermination_1.CourtDetermination().deserialize(undefined)).to.deep.equal(new courtDetermination_1.CourtDetermination());
        });
        it('should return instance with set fields from given object', () => {
            chai_1.expect(new courtDetermination_1.CourtDetermination().deserialize({
                courtDecision: paymentIntentionDraft_1.intentionOfPaymentByInstalments,
                courtPaymentIntention: paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate,
                rejectionReason: { text: 'rejection reason' },
                disposableIncome: 1000,
                decisionType: decisionType_1.DecisionType.COURT
            })).to.deep.equal(new courtDetermination_1.CourtDetermination(paymentIntentionDraft_1.intentionOfPaymentByInstalments, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate, new rejectionReason_1.RejectionReason('rejection reason'), 1000, decisionType_1.DecisionType.COURT));
        });
    });
});
