"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decisionType_1 = require("common/court-calculations/decisionType");
class CourtDecision {
    static calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate) {
        if (!defendantPaymentDate || !claimantPaymentDate) {
            throw new Error('Input should be a moment, cannot be empty');
        }
        if (claimantPaymentDate.isSameOrAfter(defendantPaymentDate)) {
            return decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT;
        }
        if (courtGeneratedPaymentDate.isBefore(claimantPaymentDate)) {
            return decisionType_1.DecisionType.CLAIMANT;
        }
        if (courtGeneratedPaymentDate.isBefore(defendantPaymentDate)) {
            return decisionType_1.DecisionType.COURT;
        }
        return decisionType_1.DecisionType.DEFENDANT;
    }
}
exports.CourtDecision = CourtDecision;
