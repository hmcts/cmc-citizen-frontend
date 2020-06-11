"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_claim_draft_1 = require("integration-test/tests/citizen/testingSupport/pages/create-claim-draft");
const update_response_deadline_1 = require("integration-test/tests/citizen/testingSupport/pages/update-response-deadline");
const I = actor();
const updateResponseDeadlinePage = new update_response_deadline_1.UpdateResponseDeadlinePage();
const createClaimDraftPage = new create_claim_draft_1.CreateClaimDraftPage();
class TestingSupportSteps {
    makeClaimAvailableForCCJ(claimRef) {
        I.click('Testing support');
        I.click('Update response deadline');
        updateResponseDeadlinePage.updateDeadline(claimRef, '2000-01-01');
    }
    createClaimDraft() {
        I.click('Testing support');
        I.click('Create Claim Draft');
        createClaimDraftPage.createClaimDraft();
    }
    deleteClaimDraft() {
        I.click('Testing support');
        I.click('Delete Drafts');
        I.click('Delete claim draft');
    }
}
exports.TestingSupportSteps = TestingSupportSteps;
