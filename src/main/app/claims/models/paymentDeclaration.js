"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaymentDeclaration {
    constructor(paidDate, paidAmount, explanation) {
        this.paidDate = paidDate;
        this.paidAmount = paidAmount;
        this.explanation = explanation;
    }
    deserialize(input) {
        if (input) {
            this.paidDate = input.paidDate;
            this.paidAmount = input.paidAmount;
            this.explanation = input.explanation;
        }
        return this;
    }
}
exports.PaymentDeclaration = PaymentDeclaration;
