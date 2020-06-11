"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const yesNoOption_1 = require("models/yesNoOption");
const draftClaimantResponse_1 = require("claimant-response/draft/draftClaimantResponse");
const rejectionReason_1 = require("claimant-response/form/models/rejectionReason");
const partPaymentReceivedTask_1 = require("claimant-response/tasks/states-paid/partPaymentReceivedTask");
const partPaymentReceived_1 = require("claimant-response/form/models/states-paid/partPaymentReceived");
describe('AcceptPaymentMethodTask', () => {
    it('should not be completed when partPaymentReceived object is undefined', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({ partPaymentReceived: undefined });
        chai_1.expect(partPaymentReceivedTask_1.PartPaymentReceivedTask.isCompleted(draft)).to.be.false;
    });
    it('should not be completed when partPaymentReceived option is not selected', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            partPaymentReceived: new partPaymentReceived_1.PartPaymentReceived(yesNoOption_1.YesNoOption.fromObject(undefined))
        });
        chai_1.expect(partPaymentReceivedTask_1.PartPaymentReceivedTask.isCompleted(draft)).to.be.false;
    });
    it('should be completed when partPaymentReceived is set to no but reason is undefined', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            partPaymentReceived: new partPaymentReceived_1.PartPaymentReceived(yesNoOption_1.YesNoOption.NO)
        });
        chai_1.expect(partPaymentReceivedTask_1.PartPaymentReceivedTask.isCompleted(draft)).to.be.true;
    });
    it('should be completed when partPaymentReceived option is selected as yes', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            partPaymentReceived: new partPaymentReceived_1.PartPaymentReceived(yesNoOption_1.YesNoOption.YES)
        });
        chai_1.expect(partPaymentReceivedTask_1.PartPaymentReceivedTask.isCompleted(draft)).to.be.true;
    });
    it('should be completed when partPaymentReceived is set to no selected and reason is complete', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            partPaymentReceived: new partPaymentReceived_1.PartPaymentReceived(yesNoOption_1.YesNoOption.NO),
            rejectionReason: new rejectionReason_1.RejectionReason('reason')
        });
        chai_1.expect(partPaymentReceivedTask_1.PartPaymentReceivedTask.isCompleted(draft)).to.be.true;
    });
});
