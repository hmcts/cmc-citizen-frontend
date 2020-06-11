"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const interestDateType_1 = require("common/interestDateType");
const momentFactory_1 = require("shared/momentFactory");
const interestRateOption_1 = require("claim/form/models/interestRateOption");
const dateUtils_1 = require("shared/dateUtils");
const interestType_1 = require("claims/models/interestType");
const yesNoOption_1 = require("models/yesNoOption");
const interestType_2 = require("claim/form/models/interestType");
const calculateInterest_1 = require("common/calculate-interest/calculateInterest");
async function getInterestDetails(claim) {
    if (claim.claimData.interest.type === interestType_1.InterestType.NO_INTEREST || claim.claimData.interest.type === undefined) {
        return undefined;
    }
    const interestFromDate = getInterestDateOrIssueDate(claim);
    const interestToDate = moment.max(momentFactory_1.MomentFactory.currentDate(), claim.issuedOn);
    const numberOfDays = interestToDate.diff(interestFromDate, 'days');
    const rate = claim.claimData.interest.rate;
    let interest = claim.totalInterest;
    const specificDailyAmount = claim.claimData.interest.specificDailyAmount;
    return { interestFromDate, interestToDate, numberOfDays, interest, rate, specificDailyAmount };
}
exports.getInterestDetails = getInterestDetails;
function getInterestDateOrIssueDate(claim) {
    if (claim.claimData.interest.interestDate.type === interestDateType_1.InterestDateType.CUSTOM) {
        return claim.claimData.interest.interestDate.date;
    }
    else {
        return claim.issuedOn;
    }
}
async function draftInterestAmount(claimDraft) {
    if (claimDraft.interest.option === yesNoOption_1.YesNoOption.NO) {
        return 0.00;
    }
    if (claimDraft.interestType.option === interestType_2.InterestTypeOption.BREAKDOWN) {
        return claimDraft.interestTotal.amount;
    }
    const interest = getInterestRate(claimDraft);
    const breakdown = claimDraft.amount;
    const issuedDate = dateUtils_1.isAfter4pm() ? momentFactory_1.MomentFactory.currentDate().add(1, 'day') : momentFactory_1.MomentFactory.currentDate();
    const interestStartDate = claimDraft.interestDate.type === interestDateType_1.InterestDateType.SUBMISSION ? issuedDate :
        claimDraft.interestStartDate.date.toMoment();
    const claimAmount = breakdown.totalAmount();
    return calculateInterest_1.calculateInterest(claimAmount, interest, interestStartDate);
}
exports.draftInterestAmount = draftInterestAmount;
async function draftClaimAmountWithInterest(claimDraft) {
    const interest = await draftInterestAmount(claimDraft);
    const claimAmount = claimDraft.amount.totalAmount();
    return claimAmount + interest;
}
exports.draftClaimAmountWithInterest = draftClaimAmountWithInterest;
function getInterestRate(claimDraft) {
    if (claimDraft.interest.option === yesNoOption_1.YesNoOption.NO) {
        return 0.00;
    }
    if (claimDraft.interestRate.type === interestRateOption_1.InterestRateOption.STANDARD) {
        return getStandardInterestRate();
    }
    else {
        return claimDraft.interestRate.rate;
    }
}
function getStandardInterestRate() {
    return 8.0;
}
exports.getStandardInterestRate = getStandardInterestRate;
