"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ViewSendCompanyFinancialDetailsTask {
    static isCompleted(responseDraft) {
        if (!responseDraft || !responseDraft.companyDefendantResponseViewed) {
            return false;
        }
        return responseDraft.companyDefendantResponseViewed === true;
    }
}
exports.ViewSendCompanyFinancialDetailsTask = ViewSendCompanyFinancialDetailsTask;
