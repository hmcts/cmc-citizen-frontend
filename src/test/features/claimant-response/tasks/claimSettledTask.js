"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const yesNoOption_1 = require("models/yesNoOption");
const claimSettledTask_1 = require("claimant-response/tasks/states-paid/claimSettledTask");
const draftClaimantResponse_1 = require("claimant-response/draft/draftClaimantResponse");
const claimSettled_1 = require("claimant-response/form/models/states-paid/claimSettled");
const rejectionReason_1 = require("claimant-response/form/models/rejectionReason");
describe('AcceptPaymentMethodTask', () => {
    it('should not be completed when accepted object is undefined', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({ accepted: undefined });
        chai_1.expect(claimSettledTask_1.ClaimSettledTask.isCompleted(draft)).to.be.false;
    });
    it('should not be completed when accepted option is not selected', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            accepted: new claimSettled_1.ClaimSettled(yesNoOption_1.YesNoOption.fromObject(undefined))
        });
        chai_1.expect(claimSettledTask_1.ClaimSettledTask.isCompleted(draft)).to.be.false;
    });
    it('should not be completed when accepted is set to no but reason is undefined', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            accepted: new claimSettled_1.ClaimSettled(yesNoOption_1.YesNoOption.NO),
            rejectionReason: undefined
        });
        chai_1.expect(claimSettledTask_1.ClaimSettledTask.isCompleted(draft)).to.be.false;
    });
    it('should be completed when accepted option is selected as yes', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            accepted: new claimSettled_1.ClaimSettled(yesNoOption_1.YesNoOption.YES)
        });
        chai_1.expect(claimSettledTask_1.ClaimSettledTask.isCompleted(draft)).to.be.true;
    });
    it('should be completed when accepted is set to no selected and reason is complete', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            accepted: new claimSettled_1.ClaimSettled(yesNoOption_1.YesNoOption.NO),
            rejectionReason: new rejectionReason_1.RejectionReason('reason')
        });
        chai_1.expect(claimSettledTask_1.ClaimSettledTask.isCompleted(draft)).to.be.true;
    });
});
