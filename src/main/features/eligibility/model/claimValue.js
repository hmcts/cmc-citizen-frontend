"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClaimValue {
    constructor(option) {
        this.option = option;
    }
    static fromObject(input) {
        if (!input) {
            return input;
        }
        return this.all().filter(claimValue => claimValue.option === input).pop();
    }
    static all() {
        return [
            ClaimValue.OVER_10000,
            ClaimValue.UNDER_10000,
            ClaimValue.NOT_KNOWN
        ];
    }
}
exports.ClaimValue = ClaimValue;
ClaimValue.OVER_10000 = new ClaimValue('OVER_10000');
ClaimValue.UNDER_10000 = new ClaimValue('UNDER_10000');
ClaimValue.NOT_KNOWN = new ClaimValue('NOT_KNOWN');
