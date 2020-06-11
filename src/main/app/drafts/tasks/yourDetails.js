"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class YourDetails {
    static isCompleted(claim) {
        if (!claim || !claim.claimant) {
            return false;
        }
        return claim.claimant.isCompleted();
    }
}
exports.YourDetails = YourDetails;
