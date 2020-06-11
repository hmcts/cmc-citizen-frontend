"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatementOfTruth {
    constructor(signerName, signerRole) {
        this.signerName = signerName;
        this.signerRole = signerRole;
    }
    deserialize(input) {
        if (input) {
            return new StatementOfTruth(input.signerName, input.signerRole);
        }
        return undefined;
    }
}
exports.StatementOfTruth = StatementOfTruth;
