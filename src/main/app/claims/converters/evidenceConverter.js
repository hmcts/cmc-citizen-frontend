"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertEvidence(evidence) {
    return evidence.getPopulatedRowsOnly().map(item => {
        return {
            type: item.type.value,
            description: item.description
        };
    });
}
exports.convertEvidence = convertEvidence;
