"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toBoolean = require("to-boolean");
const claimant_1 = require("drafts/models/claimant");
const claimAmountBreakdown_1 = require("claim/form/models/claimAmountBreakdown");
const interestRate_1 = require("claim/form/models/interestRate");
const interestDate_1 = require("claim/form/models/interestDate");
const reason_1 = require("claim/form/models/reason");
const uuid = require("uuid");
const defendant_1 = require("drafts/models/defendant");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const qualifiedStatementOfTruth_1 = require("forms/models/qualifiedStatementOfTruth");
const eligibility_1 = require("eligibility/model/eligibility");
const claimantTimeline_1 = require("claim/form/models/claimantTimeline");
const evidence_1 = require("forms/models/evidence");
const interest_1 = require("claim/form/models/interest");
const interestType_1 = require("claim/form/models/interestType");
const interestStartDate_1 = require("claim/form/models/interestStartDate");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
const interestTotal_1 = require("claim/form/models/interestTotal");
const interestContinueClaiming_1 = require("claim/form/models/interestContinueClaiming");
const interestHowMuch_1 = require("claim/form/models/interestHowMuch");
class DraftClaim extends cmc_draft_store_middleware_1.DraftDocument {
    constructor() {
        super(...arguments);
        this.externalId = uuid();
        this.claimant = new claimant_1.Claimant();
        this.defendant = new defendant_1.Defendant();
        this.amount = new claimAmountBreakdown_1.ClaimAmountBreakdown();
        this.interest = new interest_1.Interest();
        this.interestType = new interestType_1.InterestType();
        this.interestRate = new interestRate_1.InterestRate();
        this.interestDate = new interestDate_1.InterestDate();
        this.interestStartDate = new interestStartDate_1.InterestStartDate();
        this.interestEndDate = new interestEndDate_1.InterestEndDate();
        this.interestTotal = new interestTotal_1.InterestTotal();
        this.interestContinueClaiming = new interestContinueClaiming_1.InterestContinueClaiming();
        this.interestHowMuch = new interestHowMuch_1.InterestHowMuch();
        this.reason = new reason_1.Reason();
        this.readResolveDispute = false;
        this.readCompletingClaim = false;
        this.timeline = new claimantTimeline_1.ClaimantTimeline();
        this.evidence = new evidence_1.Evidence();
    }
    deserialize(input) {
        if (input) {
            this.externalId = input.externalId;
            this.claimant = new claimant_1.Claimant().deserialize(input.claimant);
            this.defendant = new defendant_1.Defendant().deserialize(input.defendant);
            this.interest = new interest_1.Interest().deserialize(input.interest);
            this.interestType = new interestType_1.InterestType().deserialize(input.interestType);
            this.interestRate = new interestRate_1.InterestRate().deserialize(input.interestRate);
            this.interestDate = new interestDate_1.InterestDate().deserialize(input.interestDate);
            this.interestStartDate = new interestStartDate_1.InterestStartDate().deserialize(input.interestStartDate);
            this.interestEndDate = new interestEndDate_1.InterestEndDate().deserialize(input.interestEndDate);
            this.interestTotal = new interestTotal_1.InterestTotal().deserialize(input.interestTotal);
            this.interestContinueClaiming = new interestContinueClaiming_1.InterestContinueClaiming().deserialize(input.interestContinueClaiming);
            this.interestHowMuch = new interestHowMuch_1.InterestHowMuch().deserialize(input.interestHowMuch);
            this.amount = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize(input.amount);
            this.reason = new reason_1.Reason().deserialize(input.reason);
            this.readResolveDispute = input.readResolveDispute;
            this.readCompletingClaim = input.readCompletingClaim;
            if (input.qualifiedStatementOfTruth) {
                this.qualifiedStatementOfTruth = new qualifiedStatementOfTruth_1.QualifiedStatementOfTruth().deserialize(input.qualifiedStatementOfTruth);
            }
            switch (typeof input.eligibility) {
                case 'boolean':
                    this.eligibility = toBoolean(input.eligibility);
                    break;
                case 'object':
                    this.eligibility = new eligibility_1.Eligibility().deserialize(input.eligibility).eligible;
                    break;
            }
            this.timeline = new claimantTimeline_1.ClaimantTimeline().deserialize(input.timeline);
            this.evidence = new evidence_1.Evidence().deserialize(input.evidence);
        }
        return this;
    }
}
exports.DraftClaim = DraftClaim;
