"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InterestRateOption {
    static all() {
        return [
            InterestRateOption.STANDARD,
            InterestRateOption.DIFFERENT
        ];
    }
}
exports.InterestRateOption = InterestRateOption;
InterestRateOption.STANDARD = 'standard';
InterestRateOption.DIFFERENT = 'different';
