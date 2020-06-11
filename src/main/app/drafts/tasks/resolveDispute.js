"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResolveDispute {
    static isCompleted(claim) {
        return claim.readResolveDispute;
    }
}
exports.ResolveDispute = ResolveDispute;
