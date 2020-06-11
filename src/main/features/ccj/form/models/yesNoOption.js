"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaidAmountOption {
    constructor(value) {
        this.value = value;
    }
    static all() {
        return [
            PaidAmountOption.YES,
            PaidAmountOption.NO
        ];
    }
}
exports.PaidAmountOption = PaidAmountOption;
PaidAmountOption.YES = new PaidAmountOption('yes');
PaidAmountOption.NO = new PaidAmountOption('no');
