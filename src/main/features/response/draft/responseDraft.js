"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("response/form/models/response");
const freeMediation_1 = require("forms/models/freeMediation");
const alreadyPaid_1 = require("response/form/models/alreadyPaid");
const rejectAllOfClaim_1 = require("response/form/models/rejectAllOfClaim");
const defence_1 = require("response/form/models/defence");
const moreTimeNeeded_1 = require("response/form/models/moreTimeNeeded");
const responseType_1 = require("response/form/models/responseType");
const defendant_1 = require("drafts/models/defendant");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const qualifiedStatementOfTruth_1 = require("forms/models/qualifiedStatementOfTruth");
const howMuchOwed_1 = require("response/form/models/howMuchOwed");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const paidAmount_1 = require("ccj/form/models/paidAmount");
const impactOfDispute_1 = require("response/form/models/impactOfDispute");
const statementOfMeans_1 = require("response/draft/statementOfMeans");
const whenDidYouPay_1 = require("response/form/models/whenDidYouPay");
const defendantTimeline_1 = require("response/form/models/defendantTimeline");
const defendantEvidence_1 = require("response/form/models/defendantEvidence");
const howMuchHaveYouPaid_1 = require("response/form/models/howMuchHaveYouPaid");
const whyDoYouDisagree_1 = require("response/form/models/whyDoYouDisagree");
const yesNoOption_1 = require("models/yesNoOption");
const howMuchDoYouOwe_1 = require("response/form/models/howMuchDoYouOwe");
const paymentIntention_1 = require("shared/components/payment-intention/model/paymentIntention");
class FullAdmission {
    deserialize(input) {
        if (input) {
            this.paymentIntention = paymentIntention_1.PaymentIntention.deserialize(input.paymentIntention);
            return this;
        }
    }
}
exports.FullAdmission = FullAdmission;
class PartialAdmission {
    deserialize(input) {
        if (input) {
            this.alreadyPaid = new alreadyPaid_1.AlreadyPaid().deserialize(input.alreadyPaid && input.alreadyPaid.option);
            this.howMuchHaveYouPaid = new howMuchHaveYouPaid_1.HowMuchHaveYouPaid().deserialize(input.howMuchHaveYouPaid);
            this.howMuchDoYouOwe = new howMuchDoYouOwe_1.HowMuchDoYouOwe().deserialize(input.howMuchDoYouOwe);
            this.whyDoYouDisagree = new whyDoYouDisagree_1.WhyDoYouDisagree().deserialize(input.whyDoYouDisagree);
            this.timeline = new defendantTimeline_1.DefendantTimeline().deserialize(input.timeline);
            this.evidence = new defendantEvidence_1.DefendantEvidence().deserialize(input.evidence);
            if (input.paymentIntention) {
                this.paymentIntention = paymentIntention_1.PaymentIntention.deserialize(input.paymentIntention);
            }
        }
        return this;
    }
}
exports.PartialAdmission = PartialAdmission;
class ResponseDraft extends cmc_draft_store_middleware_1.DraftDocument {
    constructor() {
        super(...arguments);
        this.defendantDetails = new defendant_1.Defendant();
    }
    deserialize(input) {
        if (input) {
            this.externalId = input.externalId;
            this.response = response_1.Response.fromObject(input.response);
            this.defence = new defence_1.Defence().deserialize(input.defence);
            this.freeMediation = new freeMediation_1.FreeMediation(input.freeMediation && input.freeMediation.option);
            this.moreTimeNeeded = new moreTimeNeeded_1.MoreTimeNeeded(input.moreTimeNeeded && input.moreTimeNeeded.option);
            this.defendantDetails = new defendant_1.Defendant().deserialize(input.defendantDetails);
            this.howMuchOwed = new howMuchOwed_1.HowMuchOwed().deserialize(input.howMuchOwed);
            this.evidence = new defendantEvidence_1.DefendantEvidence().deserialize(input.evidence);
            this.timeline = new defendantTimeline_1.DefendantTimeline().deserialize(input.timeline);
            if (input.qualifiedStatementOfTruth) {
                this.qualifiedStatementOfTruth = new qualifiedStatementOfTruth_1.QualifiedStatementOfTruth().deserialize(input.qualifiedStatementOfTruth);
            }
            this.paidAmount = new paidAmount_1.PaidAmount().deserialize(input.paidAmount);
            this.impactOfDispute = new impactOfDispute_1.ImpactOfDispute().deserialize(input.impactOfDispute);
            this.whenDidYouPay = new whenDidYouPay_1.WhenDidYouPay().deserialize(input.whenDidYouPay);
            if (input.fullAdmission) {
                this.fullAdmission = new FullAdmission().deserialize(input.fullAdmission);
            }
            if (input.partialAdmission) {
                this.partialAdmission = new PartialAdmission().deserialize(input.partialAdmission);
            }
            if (input.rejectAllOfClaim) {
                this.rejectAllOfClaim = new rejectAllOfClaim_1.RejectAllOfClaim().deserialize(input.rejectAllOfClaim);
            }
            if (input.statementOfMeans) {
                this.statementOfMeans = new statementOfMeans_1.StatementOfMeans().deserialize(input.statementOfMeans);
            }
            if (input.companyDefendantResponseViewed) {
                this.companyDefendantResponseViewed = input.companyDefendantResponseViewed;
            }
        }
        if (this.isImmediatePaymentOptionSelected(this.fullAdmission) || this.isImmediatePaymentOptionSelected(this.partialAdmission)) {
            delete this.statementOfMeans;
        }
        return this;
    }
    isImmediatePaymentOptionSelected(data) {
        const isPaymentOptionPopulated = () => {
            return data !== undefined
                && data.paymentIntention !== undefined
                && data.paymentIntention.paymentOption !== undefined;
        };
        return isPaymentOptionPopulated() && data.paymentIntention.paymentOption.isOfType(paymentOption_1.PaymentType.IMMEDIATELY);
    }
    isMoreTimeRequested() {
        return this.moreTimeNeeded !== undefined && this.moreTimeNeeded.option === moreTimeNeeded_1.MoreTimeNeededOption.YES;
    }
    isResponseFullyAdmitted() {
        return this.isResponsePopulated() && this.response.type === responseType_1.ResponseType.FULL_ADMISSION;
    }
    // TODO: Because of an overlap between two stories (ROC-3657, ROC-3658), the logic of this function
    // is incomplete. ROC-3658 should revisit once 'statement of means' flow is complete.
    isResponseFullyAdmittedWithInstalments() {
        return this.isResponseFullyAdmitted()
            && this.fullAdmission !== undefined
            && this.fullAdmission.paymentIntention !== undefined
            && this.fullAdmission.paymentIntention.paymentOption !== undefined
            && this.fullAdmission.paymentIntention.paymentOption.option === paymentOption_1.PaymentType.INSTALMENTS;
    }
    isResponsePartiallyAdmittedWithInstalments() {
        return this.isResponsePartiallyAdmitted()
            && this.partialAdmission !== undefined
            && this.partialAdmission.paymentIntention !== undefined
            && this.partialAdmission.paymentIntention.paymentOption !== undefined
            && this.partialAdmission.paymentIntention.paymentOption.option === paymentOption_1.PaymentType.INSTALMENTS;
    }
    isResponsePartiallyAdmitted() {
        return this.isResponsePopulated()
            && this.response.type === responseType_1.ResponseType.PART_ADMISSION
            && this.partialAdmission !== undefined;
    }
    isResponsePartiallyAdmittedAndAlreadyPaid() {
        return this.isResponsePartiallyAdmitted() && this.partialAdmission.alreadyPaid.option === yesNoOption_1.YesNoOption.YES;
    }
    isResponseRejectedFullyWithDispute() {
        if (!this.isResponsePopulated()) {
            return false;
        }
        return this.response.type === responseType_1.ResponseType.DEFENCE
            && this.rejectAllOfClaim !== undefined && this.rejectAllOfClaim.option === rejectAllOfClaim_1.RejectAllOfClaimOption.DISPUTE;
    }
    isResponseRejected() {
        if (!this.isResponsePopulated()) {
            return false;
        }
        return this.response.type === responseType_1.ResponseType.DEFENCE;
    }
    isResponseRejectedFullyBecausePaidWhatOwed() {
        return this.isResponseRejected()
            && this.rejectAllOfClaim !== undefined
            && this.rejectAllOfClaim.option === rejectAllOfClaim_1.RejectAllOfClaimOption.ALREADY_PAID;
    }
    isResponsePopulated() {
        return !!this.response && !!this.response.type;
    }
    isResponseFullyAdmittedWithPayBySetDate() {
        return this.fullAdmission !== undefined
            && this.fullAdmission.paymentIntention !== undefined
            && this.fullAdmission.paymentIntention.paymentOption !== undefined
            && this.fullAdmission.paymentIntention.paymentOption.option === paymentOption_1.PaymentType.BY_SET_DATE;
    }
    isResponsePartiallyAdmittedWithPayBySetDate() {
        return this.partialAdmission !== undefined
            && this.partialAdmission.paymentIntention !== undefined
            && this.partialAdmission.paymentIntention.paymentOption !== undefined
            && this.partialAdmission.paymentIntention.paymentOption.option === paymentOption_1.PaymentType.BY_SET_DATE;
    }
}
exports.ResponseDraft = ResponseDraft;
