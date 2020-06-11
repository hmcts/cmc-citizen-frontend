"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InterestType {
    static all() {
        return [
            InterestType.STANDARD,
            InterestType.DIFFERENT,
            InterestType.NO_INTEREST,
            InterestType.BREAKDOWN
        ];
    }
}
exports.InterestType = InterestType;
InterestType.STANDARD = 'standard';
InterestType.DIFFERENT = 'different';
InterestType.NO_INTEREST = 'no interest';
InterestType.BREAKDOWN = 'breakdown';
