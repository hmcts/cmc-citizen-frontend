"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClaimDetails {
    static isCompleted(claim) {
        return claim.reason.isCompleted() && claim.timeline.isCompleted() && claim.evidence.isCompleted();
    }
}
exports.ClaimDetails = ClaimDetails;
