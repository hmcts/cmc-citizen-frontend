"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
const interestRateClient_1 = require("claims/interestRateClient");
async function calculateInterest(amount, interestRate, interestFromDate, interestToDate = momentFactory_1.MomentFactory.currentDateTime()) {
    if (interestToDate.diff(interestFromDate, 'days') > 0) {
        return interestRateClient_1.InterestRateClient.calculateInterestRate(amount, interestRate, interestFromDate, interestToDate);
    }
    return 0;
}
exports.calculateInterest = calculateInterest;
