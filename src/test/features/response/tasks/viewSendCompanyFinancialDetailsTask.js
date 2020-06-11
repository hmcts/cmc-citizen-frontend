"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const viewSendCompanyFinancialDetailsTask_1 = require("response/tasks/viewSendCompanyFinancialDetailsTask");
const responseDraft_1 = require("response/draft/responseDraft");
describe('ViewSendCompanyFinancialDetailsTask', () => {
    describe('isCompleted', () => {
        const draft = new responseDraft_1.ResponseDraft();
        it('should return true when send company details financial details has been viewed by defendant', () => {
            draft.companyDefendantResponseViewed = true;
            chai_1.expect(viewSendCompanyFinancialDetailsTask_1.ViewSendCompanyFinancialDetailsTask.isCompleted(draft)).to.equal(true);
        });
        it('should return false when send company details financial details has not been viewed by defendant (false)', () => {
            draft.companyDefendantResponseViewed = false;
            chai_1.expect(viewSendCompanyFinancialDetailsTask_1.ViewSendCompanyFinancialDetailsTask.isCompleted(draft)).to.equal(false);
        });
        it('should return false when send company details financial details has not been viewed by defendant (undefined)', () => {
            draft.companyDefendantResponseViewed = undefined;
            chai_1.expect(viewSendCompanyFinancialDetailsTask_1.ViewSendCompanyFinancialDetailsTask.isCompleted(undefined)).to.equal(false);
        });
    });
});
