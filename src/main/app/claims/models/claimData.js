"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimAmountBreakdown_1 = require("features/claim/form/models/claimAmountBreakdown");
const individual_1 = require("claims/models/details/yours/individual");
const company_1 = require("claims/models/details/yours/company");
const soleTrader_1 = require("claims/models/details/yours/soleTrader");
const organisation_1 = require("claims/models/details/yours/organisation");
const partyType_1 = require("common/partyType");
const individual_2 = require("claims/models/details/theirs/individual");
const company_2 = require("claims/models/details/theirs/company");
const soleTrader_2 = require("claims/models/details/theirs/soleTrader");
const organisation_2 = require("claims/models/details/theirs/organisation");
const payment_1 = require("payment-hub-client/payment");
const statementOfTruth_1 = require("claims/models/statementOfTruth");
const claimantTimeline_1 = require("claim/form/models/claimantTimeline");
const evidence_1 = require("forms/models/evidence");
const interestDate_1 = require("claims/models/interestDate");
const interest_1 = require("claims/models/interest");
class ClaimData {
    constructor() {
        this.amount = new claimAmountBreakdown_1.ClaimAmountBreakdown();
        this.payment = new payment_1.Payment();
    }
    get claimant() {
        if (this.claimants.length === 1) {
            return this.claimants[0];
        }
        else {
            throw new Error('This claim has multiple claimants');
        }
    }
    get defendant() {
        if (this.defendants.length === 1) {
            return this.defendants[0];
        }
        else {
            throw new Error('This claim has multiple defendants');
        }
    }
    deserialize(input) {
        if (input) {
            this.claimants = this.deserializeClaimants(input.claimants);
            this.defendants = this.deserializeDefendants(input.defendants);
            if (input.payment) {
                this.payment = payment_1.Payment.deserialize(input.payment);
            }
            this.feeAmountInPennies = input.feeAmountInPennies;
            this.amount = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize(input.amount);
            this.reason = input.reason;
            this.amount = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize(input.amount);
            this.reason = input.reason;
            this.timeline = claimantTimeline_1.ClaimantTimeline.fromObject(input.timeline);
            this.evidence = evidence_1.Evidence.fromObject(input.evidence);
            this.externalId = input.externalId;
            this.interest = new interest_1.Interest().deserialize(input.interest);
            //
            // NOTE: To be removed once data model migration is completed.
            //
            // `interestDate` prior migration completion can be provided in `claimData`
            // in which case we still handle it for backward compatibility reasons.
            //
            if (input.interestDate) {
                this.interest.interestDate = new interestDate_1.InterestDate().deserialize(input.interestDate);
            }
            if (input.statementOfTruth) {
                this.statementOfTruth = new statementOfTruth_1.StatementOfTruth().deserialize(input.statementOfTruth);
            }
        }
        return this;
    }
    deserializeClaimants(claimants) {
        if (claimants) {
            return claimants.map((claimant) => {
                switch (claimant.type) {
                    case partyType_1.PartyType.INDIVIDUAL.value:
                        return new individual_1.Individual().deserialize(claimant);
                    case partyType_1.PartyType.COMPANY.value:
                        return new company_1.Company().deserialize(claimant);
                    case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
                        return new soleTrader_1.SoleTrader().deserialize(claimant);
                    case partyType_1.PartyType.ORGANISATION.value:
                        return new organisation_1.Organisation().deserialize(claimant);
                    default:
                        throw Error('Something went wrong, No claimant type is set');
                }
            });
        }
    }
    deserializeDefendants(defendants) {
        if (defendants) {
            return defendants.map((defendant) => {
                switch (defendant.type) {
                    case partyType_1.PartyType.INDIVIDUAL.value:
                        return new individual_2.Individual().deserialize(defendant);
                    case partyType_1.PartyType.COMPANY.value:
                        return new company_2.Company().deserialize(defendant);
                    case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
                        return new soleTrader_2.SoleTrader().deserialize(defendant);
                    case partyType_1.PartyType.ORGANISATION.value:
                        return new organisation_2.Organisation().deserialize(defendant);
                    default:
                        throw Error('Something went wrong, No defendant type is set');
                }
            });
        }
    }
}
exports.ClaimData = ClaimData;
