"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const defence_1 = require("integration-test/tests/citizen/defence/steps/defence");
const defendant_1 = require("integration-test/tests/citizen/home/steps/defendant");
const test_data_1 = require("integration-test/data/test-data");
const defendant_timeline_events_1 = require("integration-test/tests/citizen/defence/pages/defendant-timeline-events");
const defendant_evidence_1 = require("integration-test/tests/citizen/defence/pages/defendant-evidence");
const defendant_how_much_have_you_paid_1 = require("integration-test/tests/citizen/defence/pages/defendant-how-much-have-you-paid");
const defendant_you_have_paid_less_1 = require("integration-test/tests/citizen/defence/pages/defendant-you-have-paid-less");
const defendant_why_do_you_disagree_1 = require("integration-test/tests/citizen/defence/pages/defendant-why-do-you-disagree");
const mediation_1 = require("integration-test/tests/citizen/mediation/steps/mediation");
const defendant_task_list_1 = require("integration-test/tests/citizen/defence/pages/defendant-task-list");
const directionsQuestionnaireSteps_1 = require("integration-test/tests/citizen/directionsQuestionnaire/steps/directionsQuestionnaireSteps");
const I = actor();
const defendantSteps = new defendant_1.DefendantSteps();
const defenceSteps = new defence_1.DefenceSteps();
const timelineEventsPage = new defendant_timeline_events_1.DefendantTimelineEventsPage();
const evidencePage = new defendant_evidence_1.DefendantEvidencePage();
const howMuchHaveYouPaidPage = new defendant_how_much_have_you_paid_1.DefendantHowMuchHaveYouPaidPage();
const youHavePaidLessPage = new defendant_you_have_paid_less_1.DefendantYouHavePaidLessPage();
const whyYouDisagreePage = new defendant_why_do_you_disagree_1.DefendantWhyDoYouDisagreePage();
const mediationSteps = new mediation_1.MediationSteps();
const directionsQuestionnaireSteps = new directionsQuestionnaireSteps_1.DirectionsQuestionnaireSteps();
const defendantTaskListPage = new defendant_task_list_1.DefendantTaskListPage();
class DefendantResponseSteps {
    disputeAllClaim(testData, claimantResponseTestData) {
        defenceSteps.loginAsDefendant(testData.defendantEmail);
        I.click(testData.claimRef);
        I.click('Respond to claim');
        defenceSteps.confirmYourDetails(test_data_1.createDefendant(testData.defendantPartyType, false));
        defenceSteps.requestNoExtraTimeToRespond();
        defenceSteps.rejectAllOfClaimAsDisputeClaim();
        defendantSteps.selectTaskWhyDoYouDisagreeWithTheClaim();
        whyYouDisagreePage.enterReason(claimantResponseTestData.pageSpecificValues.whyYouDisagreePageEnterReason);
        timelineEventsPage.enterTimelineEvent(claimantResponseTestData.pageSpecificValues.timelineEventsPageEnterTimelineEvent.eventNum, claimantResponseTestData.pageSpecificValues.timelineEventsPageEnterTimelineEvent.date, claimantResponseTestData.pageSpecificValues.timelineEventsPageEnterTimelineEvent.description);
        timelineEventsPage.submitForm();
        evidencePage.enterEvidenceRow(claimantResponseTestData.pageSpecificValues.evidencePageEnterEvidenceRow.type, claimantResponseTestData.pageSpecificValues.evidencePageEnterEvidenceRow.description, claimantResponseTestData.pageSpecificValues.evidencePageEnterEvidenceRow.comment);
        defendantTaskListPage.selectTaskFreeMediation();
        mediationSteps.rejectMediation();
        defendantTaskListPage.selectTaskHearingRequirements();
        directionsQuestionnaireSteps.acceptDirectionsQuestionnaireYesJourney();
        defendantSteps.selectCheckAndSubmitYourDefence();
        defenceSteps.checkAndSendAndSubmit(testData.defendantPartyType, testData.defenceType);
        I.see('You’ve submitted your response');
        I.see(`We’ve emailed ${test_data_1.createClaimant(party_type_1.PartyType.INDIVIDUAL).name} your response, explaining why you reject the claim.`);
    }
    disputeClaimAsAlreadyPaid(testData, claimantResponseTestData, isClaimTotalPaid) {
        defenceSteps.loginAsDefendant(testData.defendantEmail);
        I.click(testData.claimRef);
        I.click('Respond to claim');
        defenceSteps.confirmYourDetails(test_data_1.createDefendant(testData.defendantPartyType, false));
        defenceSteps.requestNoExtraTimeToRespond();
        defenceSteps.rejectAllOfClaimAsAlreadyPaid();
        defendantSteps.selectTaskTellUsHowMuchYouHavePaid();
        howMuchHaveYouPaidPage.enterAmountPaidWithDateAndExplanation(claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation.paidAmount, claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation.date, claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation.explanation);
        if (!isClaimTotalPaid) {
            youHavePaidLessPage.continue();
            defendantSteps.selectTaskWhyDoYouDisagreeWithTheAmountClaimed();
            whyYouDisagreePage.enterReason(claimantResponseTestData.pageSpecificValues.whyYouDisagreePageEnterReason);
            timelineEventsPage.enterTimelineEvent(claimantResponseTestData.pageSpecificValues.timelineEventsPageEnterTimelineEvent.eventNum, claimantResponseTestData.pageSpecificValues.timelineEventsPageEnterTimelineEvent.date, claimantResponseTestData.pageSpecificValues.timelineEventsPageEnterTimelineEvent.description);
            timelineEventsPage.submitForm();
            evidencePage.enterEvidenceRow(claimantResponseTestData.pageSpecificValues.evidencePageEnterEvidenceRow.type, claimantResponseTestData.pageSpecificValues.evidencePageEnterEvidenceRow.description, claimantResponseTestData.pageSpecificValues.evidencePageEnterEvidenceRow.comment);
        }
        defendantTaskListPage.selectTaskFreeMediation();
        mediationSteps.rejectMediationByDisagreeing();
        defendantTaskListPage.selectTaskHearingRequirements();
        directionsQuestionnaireSteps.acceptDirectionsQuestionnaireYesJourney();
        defendantSteps.selectCheckAndSubmitYourDefence();
        defenceSteps.checkAndSendAndSubmit(testData.defendantPartyType, testData.defenceType);
        I.see('You’ve submitted your response');
    }
}
exports.DefendantResponseSteps = DefendantResponseSteps;
