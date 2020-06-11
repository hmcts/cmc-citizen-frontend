"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TotalAmount {
    constructor(claimAmount, interestAmount, feeAmount) {
        this.claimAmount = claimAmount;
        this.interestAmount = interestAmount;
        this.feeAmount = feeAmount;
        this.totalAmountTillToday = this.claimAmount + this.interestAmount + this.feeAmount;
    }
}
exports.TotalAmount = TotalAmount;
