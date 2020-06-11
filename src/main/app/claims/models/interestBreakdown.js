"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InterestBreakdown {
    constructor(totalAmount, explanation) {
        this.totalAmount = totalAmount;
        this.explanation = explanation;
    }
    deserialize(input) {
        if (input) {
            this.totalAmount = input.totalAmount;
            this.explanation = input.explanation;
        }
        return this;
    }
}
exports.InterestBreakdown = InterestBreakdown;
