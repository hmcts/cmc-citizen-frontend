"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function eligible() {
    return {
        eligible: true
    };
}
exports.eligible = eligible;
function notEligible(reason) {
    return {
        eligible: false,
        notEligibleReason: reason
    };
}
exports.notEligible = notEligible;
