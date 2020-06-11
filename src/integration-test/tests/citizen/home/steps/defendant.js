"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defendant_task_list_1 = require("integration-test/tests/citizen/defence/pages/defendant-task-list");
const mediation_1 = require("integration-test/tests/citizen/mediation/steps/mediation");
const party_type_1 = require("integration-test/data/party-type");
const directionsQuestionnaireSteps_1 = require("integration-test/tests/citizen/directionsQuestionnaire/steps/directionsQuestionnaireSteps");
const defendantTaskListPage = new defendant_task_list_1.DefendantTaskListPage();
const mediationSteps = new mediation_1.MediationSteps();
const directionsQuestionnaireSteps = new directionsQuestionnaireSteps_1.DirectionsQuestionnaireSteps();
class DefendantSteps {
    selectTaskConfirmYourDetails() {
        defendantTaskListPage.selectTaskConfirmYourDetails();
    }
    selectTaskMoreTimeNeededToRespond() {
        defendantTaskListPage.selectTaskMoreTimeNeededToRespond();
    }
    selectTaskChooseAResponse() {
        defendantTaskListPage.selectChooseAResponse();
    }
    selectTaskHowMuchMoneyBelieveYouOwe() {
        defendantTaskListPage.selectTaskHowMuchMoneyBelieveYouOwe();
    }
    selectTaskDecideHowWillYouPay() {
        defendantTaskListPage.selectTaskDecideHowWillYouPay();
    }
    selectTaskWhenDidYouPay() {
        defendantTaskListPage.selectTaskWhenDidYouPay();
    }
    selectTaskHowMuchPaidToClaiment() {
        defendantTaskListPage.selectTaskHowMuchPaidToClaiment();
    }
    selectTaskHowMuchHaveYouPaid() {
        defendantTaskListPage.selectTaskHowMuchHaveYouPaid();
    }
    selectTaskTellUsHowMuchYouHavePaid() {
        defendantTaskListPage.selectTaskTellUsHowMuchYouHavePaid();
    }
    selectTaskWhyDoYouDisagreeWithTheClaim() {
        defendantTaskListPage.selectTaskWhyDoYouDisagreeWithTheClaim();
    }
    selectTaskWhyDoYouDisagreeWithTheAmountClaimed() {
        defendantTaskListPage.selectTaskWhyDoYouDisagreeWithTheAmountClaimed();
    }
    selectCheckAndSubmitYourDefence() {
        defendantTaskListPage.selectTaskCheckAndSendYourResponse();
    }
    selectTaskFreeMediation(defendantType) {
        defendantTaskListPage.selectTaskFreeMediation();
        if (defendantType === party_type_1.PartyType.COMPANY || defendantType === party_type_1.PartyType.ORGANISATION) {
            mediationSteps.acceptMediationAsCompanyPhoneNumberProvided();
        }
        else {
            mediationSteps.acceptMediationAsIndividualPhoneNumberProvidedIsUsed();
        }
    }
    selectTaskHearingRequirements(defendantType) {
        defendantTaskListPage.selectTaskHearingRequirements();
        directionsQuestionnaireSteps.acceptDirectionsQuestionnaireYesJourney(defendantType);
    }
    selectTaskWhenYouWillPay() {
        defendantTaskListPage.selectTaskWhenWillYouPay();
    }
}
exports.DefendantSteps = DefendantSteps;
