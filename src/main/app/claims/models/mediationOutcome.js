"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MediationOutcome {
    static all() {
        return [
            MediationOutcome.SUCCEEDED,
            MediationOutcome.FAILED
        ];
    }
}
exports.MediationOutcome = MediationOutcome;
MediationOutcome.SUCCEEDED = 'SUCCEEDED';
MediationOutcome.FAILED = 'FAILED';
