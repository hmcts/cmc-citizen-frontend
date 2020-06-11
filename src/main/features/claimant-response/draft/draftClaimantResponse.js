"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const settleAdmitted_1 = require("claimant-response/form/models/settleAdmitted");
const acceptPaymentMethod_1 = require("claimant-response/form/models/acceptPaymentMethod");
const formaliseRepaymentPlan_1 = require("claimant-response/form/models/formaliseRepaymentPlan");
const settlementAgreement_1 = require("claimant-response/form/models/settlementAgreement");
const paymentIntention_1 = require("shared/components/payment-intention/model/paymentIntention");
const freeMediation_1 = require("forms/models/freeMediation");
const paidAmount_1 = require("ccj/form/models/paidAmount");
const partPaymentReceived_1 = require("claimant-response/form/models/states-paid/partPaymentReceived");
const claimSettled_1 = require("claimant-response/form/models/states-paid/claimSettled");
const acceptCourtOffer_1 = require("claimant-response/form/models/acceptCourtOffer");
const courtDetermination_1 = require("claimant-response/draft/courtDetermination");
const rejectionReason_1 = require("claimant-response/form/models/rejectionReason");
const intentionToProceed_1 = require("claimant-response/form/models/intentionToProceed");
class DraftClaimantResponse extends cmc_draft_store_middleware_1.DraftDocument {
    constructor() {
        super();
    }
    deserialize(input) {
        if (input) {
            this.externalId = input.externalId;
            if (input.defendantResponseViewed) {
                this.defendantResponseViewed = input.defendantResponseViewed;
            }
            if (input.settleAdmitted) {
                this.settleAdmitted = new settleAdmitted_1.SettleAdmitted().deserialize(input.settleAdmitted);
            }
            if (input.acceptPaymentMethod) {
                this.acceptPaymentMethod = new acceptPaymentMethod_1.AcceptPaymentMethod().deserialize(input.acceptPaymentMethod);
            }
            if (input.formaliseRepaymentPlan) {
                this.formaliseRepaymentPlan = new formaliseRepaymentPlan_1.FormaliseRepaymentPlan().deserialize(input.formaliseRepaymentPlan);
            }
            if (input.settlementAgreement) {
                this.settlementAgreement = new settlementAgreement_1.SettlementAgreement().deserialize(input.settlementAgreement);
            }
            if (input.freeMediation) {
                this.freeMediation = new freeMediation_1.FreeMediation(input.freeMediation.option);
            }
            if (input.paidAmount) {
                this.paidAmount = new paidAmount_1.PaidAmount().deserialize(input.paidAmount);
            }
            if (input.partPaymentReceived) {
                this.partPaymentReceived = new partPaymentReceived_1.PartPaymentReceived().deserialize(input.partPaymentReceived);
            }
            if (input.accepted) {
                this.accepted = new claimSettled_1.ClaimSettled().deserialize(input.accepted);
            }
            if (input.acceptCourtOffer) {
                this.acceptCourtOffer = new acceptCourtOffer_1.AcceptCourtOffer().deserialize(input.acceptCourtOffer);
            }
            if (input.alternatePaymentMethod) {
                this.alternatePaymentMethod = paymentIntention_1.PaymentIntention.deserialize(input.alternatePaymentMethod);
            }
            if (input.courtOrderAmount) {
                this.courtOrderAmount = input.courtOrderAmount;
            }
            if (input.courtDetermination) {
                this.courtDetermination = new courtDetermination_1.CourtDetermination().deserialize(input.courtDetermination);
            }
            if (input.rejectionReason) {
                this.rejectionReason = new rejectionReason_1.RejectionReason().deserialize(input.rejectionReason);
            }
            if (input.intentionToProceed) {
                this.intentionToProceed = new intentionToProceed_1.IntentionToProceed().deserialize(input.intentionToProceed);
            }
        }
        return this;
    }
}
exports.DraftClaimantResponse = DraftClaimantResponse;
