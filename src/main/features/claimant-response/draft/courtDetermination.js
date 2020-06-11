"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rejectionReason_1 = require("claimant-response/form/models/rejectionReason");
class CourtDetermination {
    constructor(courtDecision, courtPaymentIntention, rejectionReason, disposableIncome, decisionType) {
        this.courtDecision = courtDecision;
        this.courtPaymentIntention = courtPaymentIntention;
        this.rejectionReason = rejectionReason;
        this.disposableIncome = disposableIncome;
        this.decisionType = decisionType;
    }
    deserialize(input) {
        if (input) {
            this.courtDecision = input.courtDecision;
            this.courtPaymentIntention = input.courtPaymentIntention;
            this.rejectionReason = new rejectionReason_1.RejectionReason().deserialize(input.rejectionReason);
            this.disposableIncome = input.disposableIncome;
            this.decisionType = input.decisionType;
        }
        return this;
    }
}
exports.CourtDetermination = CourtDetermination;
