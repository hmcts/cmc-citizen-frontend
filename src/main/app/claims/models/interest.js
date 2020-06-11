"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interestBreakdown_1 = require("claims/models/interestBreakdown");
const interestDate_1 = require("claims/models/interestDate");
class Interest {
    constructor(type, rate, reason, specificDailyAmount, interestBreakdown, interestDate) {
        this.type = type;
        this.rate = rate;
        this.reason = reason;
        this.specificDailyAmount = specificDailyAmount;
        this.interestBreakdown = interestBreakdown;
        this.interestDate = interestDate;
    }
    deserialize(input) {
        if (input) {
            this.type = input.type;
            if (input.rate) {
                this.rate = input.rate;
            }
            if (input.reason) {
                this.reason = input.reason;
            }
            if (input.specificDailyAmount) {
                this.specificDailyAmount = input.specificDailyAmount;
            }
            if (input.interestBreakdown) {
                this.interestBreakdown = new interestBreakdown_1.InterestBreakdown().deserialize(input.interestBreakdown);
            }
            if (input.interestDate) {
                this.interestDate = new interestDate_1.InterestDate().deserialize(input.interestDate);
            }
        }
        return this;
    }
}
exports.Interest = Interest;
