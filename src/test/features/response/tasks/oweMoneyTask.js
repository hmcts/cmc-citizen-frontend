"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const oweMoneyTask_1 = require("response/tasks/oweMoneyTask");
const responseDraft_1 = require("response/draft/responseDraft");
const response_1 = require("response/form/models/response");
const responseType_1 = require("response/form/models/responseType");
const rejectAllOfClaim_1 = require("response/form/models/rejectAllOfClaim");
const alreadyPaid_1 = require("response/form/models/alreadyPaid");
const yesNoOption_1 = require("models/yesNoOption");
describe('OweMoneyTask', () => {
    describe('when no response', () => {
        it('should be not completed', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = undefined;
            chai_1.expect(oweMoneyTask_1.OweMoneyTask.isCompleted(draft)).to.equal(false);
        });
    });
    describe('when full admission', () => {
        it('should be completed when response is selected', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = new response_1.Response(responseType_1.ResponseType.FULL_ADMISSION);
            chai_1.expect(oweMoneyTask_1.OweMoneyTask.isCompleted(draft)).to.equal(true);
        });
    });
    describe('when part admission', () => {
        context('should be not completed when', () => {
            it('alreadyPaid is undefined', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType_1.ResponseType.PART_ADMISSION);
                draft.partialAdmission = new responseDraft_1.PartialAdmission();
                draft.partialAdmission.alreadyPaid = undefined;
                chai_1.expect(oweMoneyTask_1.OweMoneyTask.isCompleted(draft)).to.equal(false);
            });
            it('alreadyPaid is not populated', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType_1.ResponseType.PART_ADMISSION);
                draft.partialAdmission = new responseDraft_1.PartialAdmission();
                draft.partialAdmission.alreadyPaid = new alreadyPaid_1.AlreadyPaid();
                chai_1.expect(oweMoneyTask_1.OweMoneyTask.isCompleted(draft)).to.equal(false);
            });
            it('alreadyPaid is invalid', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType_1.ResponseType.PART_ADMISSION);
                draft.partialAdmission = new responseDraft_1.PartialAdmission();
                draft.partialAdmission.alreadyPaid = new alreadyPaid_1.AlreadyPaid().deserialize({ option: 'invalid!' });
                chai_1.expect(oweMoneyTask_1.OweMoneyTask.isCompleted(draft)).to.equal(false);
            });
        });
        it('should be completed when alreadyPaid is valid', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = new response_1.Response(responseType_1.ResponseType.PART_ADMISSION);
            draft.partialAdmission = new responseDraft_1.PartialAdmission();
            draft.partialAdmission.alreadyPaid = new alreadyPaid_1.AlreadyPaid(yesNoOption_1.YesNoOption.YES);
            chai_1.expect(oweMoneyTask_1.OweMoneyTask.isCompleted(draft)).to.equal(true);
        });
    });
    describe('when full rejection', () => {
        it('should be not completed when type of full admission is not selected', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = new response_1.Response(responseType_1.ResponseType.DEFENCE);
            draft.rejectAllOfClaim = new rejectAllOfClaim_1.RejectAllOfClaim(undefined);
            chai_1.expect(oweMoneyTask_1.OweMoneyTask.isCompleted(draft)).to.equal(false);
        });
        it('should be completed when type of part admission is selected', () => {
            rejectAllOfClaim_1.RejectAllOfClaimOption.all().forEach(option => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType_1.ResponseType.DEFENCE);
                draft.rejectAllOfClaim = new rejectAllOfClaim_1.RejectAllOfClaim(option);
                chai_1.expect(oweMoneyTask_1.OweMoneyTask.isCompleted(draft)).to.equal(true);
            });
        });
    });
});
