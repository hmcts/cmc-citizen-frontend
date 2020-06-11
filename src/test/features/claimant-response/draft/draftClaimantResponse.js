"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const draftClaimantResponse_1 = require("claimant-response/draft/draftClaimantResponse");
const acceptPaymentMethod_1 = require("claimant-response/form/models/acceptPaymentMethod");
const settleAdmitted_1 = require("claimant-response/form/models/settleAdmitted");
const yesNoOption_1 = require("models/yesNoOption");
const settlementAgreement_1 = require("claimant-response/form/models/settlementAgreement");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
const formaliseRepaymentPlan_1 = require("claimant-response/form/models/formaliseRepaymentPlan");
const yesNoOption_2 = require("ccj/form/models/yesNoOption");
const decisionType_1 = require("common/court-calculations/decisionType");
const paymentIntentionDraft_1 = require("test/data/draft/paymentIntentionDraft");
const courtDetermination_1 = require("claimant-response/draft/courtDetermination");
describe('DraftClaimantResponse', () => {
    describe('deserialization', () => {
        it('should return a DraftClaimantResponse instance initialised with defaults for undefined', () => {
            chai_1.expect(new draftClaimantResponse_1.DraftClaimantResponse().deserialize(undefined)).to.eql(new draftClaimantResponse_1.DraftClaimantResponse());
        });
        it('should return a DraftClaimantResponse instance initialised with defaults for null', () => {
            chai_1.expect(new draftClaimantResponse_1.DraftClaimantResponse().deserialize(null)).to.eql(new draftClaimantResponse_1.DraftClaimantResponse());
        });
        it('should return a DraftClaimantResponse instance initialised with valid data', () => {
            const myExternalId = 'b17af4d2-273f-4999-9895-bce382fa24c8';
            const draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
                externalId: myExternalId,
                settleAdmitted: {
                    admitted: {
                        option: 'yes'
                    }
                },
                acceptPaymentMethod: {
                    accept: {
                        option: 'no'
                    }
                },
                settlementAgreement: {
                    signed: true
                },
                formaliseRepaymentPlan: {
                    option: formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT
                },
                paidAmount: {
                    option: yesNoOption_2.PaidAmountOption.YES,
                    amount: 999,
                    claimedAmount: 1000
                },
                partPaymentReceived: {
                    received: yesNoOption_1.YesNoOption.YES
                },
                accepted: {
                    accepted: yesNoOption_1.YesNoOption.NO
                },
                courtDetermination: new courtDetermination_1.CourtDetermination(paymentIntentionDraft_1.intentionOfImmediatePayment, paymentIntentionDraft_1.intentionOfPaymentByInstalments, undefined, 1000, decisionType_1.DecisionType.COURT)
            });
            chai_1.expect(draft.externalId).to.eql(myExternalId);
            chai_1.expect(draft).to.be.instanceof(draftClaimantResponse_1.DraftClaimantResponse);
            chai_1.expect(draft.acceptPaymentMethod).to.be.instanceOf(acceptPaymentMethod_1.AcceptPaymentMethod);
            chai_1.expect(draft.acceptPaymentMethod.accept).to.be.instanceOf(yesNoOption_1.YesNoOption);
            chai_1.expect(draft.acceptPaymentMethod.accept.option).to.be.equals(yesNoOption_1.YesNoOption.NO.option);
            chai_1.expect(draft.settleAdmitted).to.be.instanceOf(settleAdmitted_1.SettleAdmitted);
            chai_1.expect(draft.settleAdmitted.admitted).to.be.instanceOf(yesNoOption_1.YesNoOption);
            chai_1.expect(draft.settleAdmitted.admitted.option).to.be.equals(yesNoOption_1.YesNoOption.YES.option);
            chai_1.expect(draft.settlementAgreement).to.be.instanceOf(settlementAgreement_1.SettlementAgreement);
            chai_1.expect(draft.settlementAgreement.signed).to.be.eqls(true);
            chai_1.expect(draft.formaliseRepaymentPlan).to.be.instanceOf(formaliseRepaymentPlan_1.FormaliseRepaymentPlan);
            chai_1.expect(draft.formaliseRepaymentPlan.option).to.be.eqls(formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT);
            chai_1.expect(draft.paidAmount.option).to.be.equal(yesNoOption_2.PaidAmountOption.YES);
            chai_1.expect(draft.paidAmount.amount).to.be.equal(999);
            chai_1.expect(draft.paidAmount.claimedAmount).to.be.equal(1000);
            chai_1.expect(draft.partPaymentReceived.received.option).to.be.equal(yesNoOption_1.YesNoOption.YES.option);
            chai_1.expect(draft.accepted.accepted.option).to.be.equal(yesNoOption_1.YesNoOption.NO.option);
            chai_1.expect(draft.courtDetermination).to.be.instanceOf(courtDetermination_1.CourtDetermination);
        });
        it('should return a DraftClaimantResponse instance initialised with partial valid data', () => {
            const myExternalId = 'b17af4d2-273f-4999-9895-bce382fa24c8';
            const draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
                externalId: myExternalId,
                courtDetermination: new courtDetermination_1.CourtDetermination(paymentIntentionDraft_1.intentionOfImmediatePayment, paymentIntentionDraft_1.intentionOfPaymentByInstalments, undefined, 1000, decisionType_1.DecisionType.COURT)
            });
            chai_1.expect(draft.courtDetermination).to.be.instanceOf(courtDetermination_1.CourtDetermination);
        });
    });
});
