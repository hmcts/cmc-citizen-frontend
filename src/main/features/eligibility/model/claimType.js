"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClaimType {
    constructor(option, displayValue) {
        this.option = option;
        this.displayValue = displayValue;
    }
    static fromObject(input) {
        if (!input) {
            return input;
        }
        return ClaimType.all().filter(claimType => claimType.option === input).pop();
    }
    static all() {
        return [
            ClaimType.PERSONAL_CLAIM,
            ClaimType.MULTIPLE_CLAIM,
            ClaimType.REPRESENTATIVE_CLAIM
        ];
    }
}
exports.ClaimType = ClaimType;
ClaimType.PERSONAL_CLAIM = new ClaimType('PERSONAL_CLAIM', 'Just myself or my organisation');
ClaimType.MULTIPLE_CLAIM = new ClaimType('MULTIPLE_CLAIM', 'More than one person or organisation');
ClaimType.REPRESENTATIVE_CLAIM = new ClaimType('REPRESENTATIVE_CLAIM', 'A client - I’m their solicitor');
