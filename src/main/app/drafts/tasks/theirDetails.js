"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TheirDetails {
    static isCompleted(claim) {
        if (!claim || !claim.defendant) {
            return false;
        }
        return claim.defendant.isCompleted();
    }
}
exports.TheirDetails = TheirDetails;
