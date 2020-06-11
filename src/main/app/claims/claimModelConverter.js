"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moneyConverter_1 = require("fees/moneyConverter");
const partyType_1 = require("common/partyType");
const claimData_1 = require("claims/models/claimData");
const individual_1 = require("claims/models/details/yours/individual");
const company_1 = require("claims/models/details/yours/company");
const soleTrader_1 = require("claims/models/details/yours/soleTrader");
const organisation_1 = require("claims/models/details/yours/organisation");
const individual_2 = require("claims/models/details/theirs/individual");
const company_2 = require("claims/models/details/theirs/company");
const soleTrader_2 = require("claims/models/details/theirs/soleTrader");
const organisation_2 = require("claims/models/details/theirs/organisation");
const address_1 = require("claims/models/address");
const claimAmountBreakdown_1 = require("claim/form/models/claimAmountBreakdown");
const statementOfTruth_1 = require("claims/models/statementOfTruth");
const stringUtils_1 = require("utils/stringUtils");
const evidenceConverter_1 = require("claims/converters/evidenceConverter");
const interestDate_1 = require("claims/models/interestDate");
const interest_1 = require("claims/models/interest");
const interestRateOption_1 = require("claim/form/models/interestRateOption");
const interestDateType_1 = require("common/interestDateType");
const interestType_1 = require("claims/models/interestType");
const yesNoOption_1 = require("models/yesNoOption");
const interestUtils_1 = require("shared/interestUtils");
const interestBreakdown_1 = require("claims/models/interestBreakdown");
const interestType_2 = require("claim/form/models/interestType");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
const config = require("config");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
exports.paymentReturnUrlBase = `${config.get('pay.return-url')}`;
const logger = nodejs_logging_1.Logger.getLogger('claims/ClaimModelConverter');
class ClaimModelConverter {
    static convert(draftClaim) {
        const claimData = new claimData_1.ClaimData();
        claimData.externalId = draftClaim.externalId;
        claimData.interest = this.convertInterest(draftClaim);
        claimData.amount = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize(draftClaim.amount);
        claimData.claimants = [this.convertClaimantDetails(draftClaim)];
        claimData.defendants = [this.convertDefendantDetails(draftClaim)];
        claimData.payment = this.makeShallowCopy(draftClaim.claimant.payment, draftClaim.externalId);
        claimData.reason = draftClaim.reason.reason;
        claimData.timeline = { rows: draftClaim.timeline.getPopulatedRowsOnly() };
        claimData.evidence = { rows: evidenceConverter_1.convertEvidence(draftClaim.evidence) };
        if (draftClaim.claimant.payment) {
            claimData.feeAmountInPennies = moneyConverter_1.MoneyConverter.convertPoundsToPennies(draftClaim.claimant.payment.amount);
        }
        if (draftClaim.qualifiedStatementOfTruth && draftClaim.qualifiedStatementOfTruth.signerName) {
            claimData.statementOfTruth = new statementOfTruth_1.StatementOfTruth(draftClaim.qualifiedStatementOfTruth.signerName, draftClaim.qualifiedStatementOfTruth.signerRole);
        }
        return claimData;
    }
    static convertClaimantDetails(draftClaim) {
        switch (draftClaim.claimant.partyDetails.type) {
            case partyType_1.PartyType.INDIVIDUAL.value:
                const individualDetails = draftClaim.claimant.partyDetails;
                return new individual_1.Individual(individualDetails.name, this.convertAddress(individualDetails.address), individualDetails.hasCorrespondenceAddress ? this.convertAddress(individualDetails.correspondenceAddress) : undefined, draftClaim.claimant.phone.number, undefined, individualDetails.dateOfBirth.date.asString());
            case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
                const soleTraderDetails = draftClaim.claimant.partyDetails;
                return new soleTrader_1.SoleTrader(soleTraderDetails.name, this.convertAddress(soleTraderDetails.address), soleTraderDetails.hasCorrespondenceAddress ? this.convertAddress(soleTraderDetails.correspondenceAddress) : undefined, draftClaim.claimant.phone.number, undefined, soleTraderDetails.businessName);
            case partyType_1.PartyType.COMPANY.value:
                const companyDetails = draftClaim.claimant.partyDetails;
                return new company_1.Company(companyDetails.name, this.convertAddress(companyDetails.address), companyDetails.hasCorrespondenceAddress ? this.convertAddress(companyDetails.correspondenceAddress) : undefined, draftClaim.claimant.phone.number, undefined, companyDetails.contactPerson);
            case partyType_1.PartyType.ORGANISATION.value:
                const organisationDetails = draftClaim.claimant.partyDetails;
                return new organisation_1.Organisation(organisationDetails.name, this.convertAddress(organisationDetails.address), organisationDetails.hasCorrespondenceAddress ? this.convertAddress(organisationDetails.correspondenceAddress) : undefined, draftClaim.claimant.phone.number, undefined, organisationDetails.contactPerson);
            default:
                throw Error('Something went wrong, No claimant type is set');
        }
    }
    static convertDefendantDetails(draftClaim) {
        const defendantDetails = draftClaim.defendant.partyDetails;
        switch (defendantDetails.type) {
            case partyType_1.PartyType.INDIVIDUAL.value:
                const individualDetails = defendantDetails;
                return new individual_2.Individual(stringUtils_1.StringUtils.trimToUndefined(individualDetails.title), individualDetails.firstName, individualDetails.lastName, this.convertAddress(individualDetails.address), stringUtils_1.StringUtils.trimToUndefined(draftClaim.defendant.email.address), this.convertPhoneNumber(draftClaim.defendant.phone));
            case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
                const soleTraderDetails = defendantDetails;
                return new soleTrader_2.SoleTrader(stringUtils_1.StringUtils.trimToUndefined(soleTraderDetails.title), soleTraderDetails.firstName, soleTraderDetails.lastName, this.convertAddress(soleTraderDetails.address), stringUtils_1.StringUtils.trimToUndefined(draftClaim.defendant.email.address), soleTraderDetails.businessName, this.convertPhoneNumber(draftClaim.defendant.phone));
            case partyType_1.PartyType.COMPANY.value:
                const companyDetails = defendantDetails;
                return new company_2.Company(companyDetails.name, this.convertAddress(companyDetails.address), stringUtils_1.StringUtils.trimToUndefined(draftClaim.defendant.email.address), companyDetails.contactPerson, this.convertPhoneNumber(draftClaim.defendant.phone));
            case partyType_1.PartyType.ORGANISATION.value:
                const organisationDetails = defendantDetails;
                return new organisation_2.Organisation(organisationDetails.name, this.convertAddress(organisationDetails.address), stringUtils_1.StringUtils.trimToUndefined(draftClaim.defendant.email.address), organisationDetails.contactPerson, this.convertPhoneNumber(draftClaim.defendant.phone));
            default:
                throw Error('Something went wrong, No defendant type is set');
        }
    }
    static convertAddress(addressForm) {
        const address = new address_1.Address();
        address.line1 = addressForm.line1;
        if (addressForm.line2) {
            address.line2 = addressForm.line2;
        }
        if (addressForm.line3) {
            address.line3 = addressForm.line3;
        }
        address.city = addressForm.city;
        address.postcode = addressForm.postcode;
        return address;
    }
    static convertInterest(draftClaim) {
        const interest = new interest_1.Interest();
        if (draftClaim.interest.option === yesNoOption_1.YesNoOption.NO) {
            interest.type = interestType_1.InterestType.NO_INTEREST;
        }
        else {
            if (draftClaim.interestType.option === interestType_2.InterestTypeOption.SAME_RATE) {
                interest.type = draftClaim.interestRate.type;
                interest.rate = draftClaim.interestRate.rate;
                if (draftClaim.interestRate.type === interestRateOption_1.InterestRateOption.DIFFERENT) {
                    interest.reason = draftClaim.interestRate.reason;
                }
            }
            else {
                const interestBreakdown = new interestBreakdown_1.InterestBreakdown();
                interestBreakdown.totalAmount = draftClaim.interestTotal.amount;
                interestBreakdown.explanation = draftClaim.interestTotal.reason;
                interest.interestBreakdown = interestBreakdown;
                interest.type = interestType_1.InterestType.BREAKDOWN;
                if (draftClaim.interestContinueClaiming.option === yesNoOption_1.YesNoOption.YES) {
                    if (draftClaim.interestHowMuch.type === interestRateOption_1.InterestRateOption.STANDARD) {
                        interest.rate = interestUtils_1.getStandardInterestRate();
                    }
                    else {
                        interest.specificDailyAmount = draftClaim.interestHowMuch.dailyAmount;
                    }
                }
            }
            interest.interestDate = this.convertInterestDate(draftClaim);
        }
        return interest;
    }
    static convertInterestDate(draftClaim) {
        const interestDate = new interestDate_1.InterestDate();
        if (draftClaim.interestType.option === interestType_2.InterestTypeOption.SAME_RATE) {
            interestDate.type = draftClaim.interestDate.type;
            if (draftClaim.interestDate.type === interestDateType_1.InterestDateType.CUSTOM) {
                interestDate.date = draftClaim.interestStartDate.date.toMoment();
                interestDate.reason = draftClaim.interestStartDate.reason;
                interestDate.endDateType = draftClaim.interestEndDate.option;
            }
        }
        if (draftClaim.interestType.option === interestType_2.InterestTypeOption.BREAKDOWN &&
            draftClaim.interestContinueClaiming.option === yesNoOption_1.YesNoOption.NO) {
            interestDate.endDateType = interestEndDate_1.InterestEndDateOption.SUBMISSION;
        }
        return interestDate;
    }
    /**
     * Makes shallow copy to payment object to format that is supported by the backend API.
     *
     * Note: It is workaround to remove all unnecessary properties from {@link PaymentRetrieveResponse}. In
     * long term the intention is to send only payment reference and creation date to backend API.
     *
     * @param {Payment} payment - payment object retrieved from Payment HUB using {@link PayClient#retrieve}
     * @returns {Payment} - simplified payment object required by the backend API
     */
    static makeShallowCopy(payment, externalId) {
        if (!payment || Object.keys(payment).length === 0) {
            const paymentReturnUrl = exports.paymentReturnUrlBase + `/claim/${externalId}/finish-payment`;
            logger.info('RETURN URL PAYMENT: ', paymentReturnUrl);
            return {
                return_url: paymentReturnUrl
            };
        }
        return {
            reference: payment.reference,
            amount: payment.amount,
            status: payment.status,
            date_created: payment.date_created
        };
    }
    static convertPhoneNumber(phone) {
        return phone ? stringUtils_1.StringUtils.trimToUndefined(phone.number) : undefined;
    }
}
exports.ClaimModelConverter = ClaimModelConverter;
