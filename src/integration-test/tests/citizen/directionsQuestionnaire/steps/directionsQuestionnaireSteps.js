"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const support_required_1 = require("integration-test/tests/citizen/directionsQuestionnaire/pages/support-required");
const hearing_dates_1 = require("integration-test/tests/citizen/directionsQuestionnaire/pages/hearing-dates");
const hearing_location_1 = require("integration-test/tests/citizen/directionsQuestionnaire/pages/hearing-location");
const using_expert_1 = require("integration-test/tests/citizen/directionsQuestionnaire/pages/using-expert");
const expert_reports_1 = require("integration-test/tests/citizen/directionsQuestionnaire/pages/expert-reports");
const self_witness_1 = require("integration-test/tests/citizen/directionsQuestionnaire/pages/self-witness");
const other_wtiness_1 = require("integration-test/tests/citizen/directionsQuestionnaire/pages/other-wtiness");
const hearing_exceptional_circumstances_1 = require("integration-test/tests/citizen/directionsQuestionnaire/pages/hearing-exceptional-circumstances");
const party_type_1 = require("integration-test/data/party-type");
const supportRequiredPage = new support_required_1.SupportRequiredPage();
const hearingLocationPage = new hearing_location_1.HearingLocationPage();
const hearingExceptionalCircumstancesPage = new hearing_exceptional_circumstances_1.HearingExceptionalCircumstancesPage();
const usingExpertPage = new using_expert_1.UsingExpertPage();
const expertReportsPage = new expert_reports_1.ExpertReportsPage();
const selfWitnessPage = new self_witness_1.SelfWitnessPage();
const otherWitnessPage = new other_wtiness_1.OtherWitnessPage();
const hearingDatesPage = new hearing_dates_1.HearingDatesPage();
class DirectionsQuestionnaireSteps {
    acceptDirectionsQuestionnaireYesJourney(defendantType = party_type_1.PartyType.INDIVIDUAL) {
        if (process.env.FEATURE_DIRECTIONS_QUESTIONNAIRE === 'true') {
            supportRequiredPage.selectAll();
            if (defendantType === party_type_1.PartyType.COMPANY || defendantType === party_type_1.PartyType.ORGANISATION) {
                hearingExceptionalCircumstancesPage.chooseYes();
            }
            hearingLocationPage.chooseYes();
            usingExpertPage.chooseExpertYes();
            expertReportsPage.chooseYes('I am an expert, trust me', '2019-01-01');
            selfWitnessPage.chooseYes();
            otherWitnessPage.chooseYes();
            hearingDatesPage.chooseYes();
        }
    }
    acceptDirectionsQuestionnaireNoJourney(defendantType = party_type_1.PartyType.INDIVIDUAL) {
        if (process.env.FEATURE_DIRECTIONS_QUESTIONNAIRE === 'true') {
            supportRequiredPage.selectAll();
            if (defendantType === party_type_1.PartyType.COMPANY || defendantType === party_type_1.PartyType.ORGANISATION) {
                hearingExceptionalCircumstancesPage.chooseNo();
            }
            hearingLocationPage.chooseNo();
            usingExpertPage.chooseExpertNo();
            selfWitnessPage.chooseNo();
            otherWitnessPage.chooseNo();
            hearingDatesPage.chooseNo();
        }
    }
    acceptDirectionsQuestionnaireNoJourneyAsClaimant(defendantType = party_type_1.PartyType.INDIVIDUAL) {
        if (process.env.FEATURE_DIRECTIONS_QUESTIONNAIRE === 'true') {
            supportRequiredPage.selectAll();
            if (defendantType === party_type_1.PartyType.COMPANY || defendantType === party_type_1.PartyType.ORGANISATION) {
                hearingExceptionalCircumstancesPage.chooseNo();
            }
            hearingLocationPage.chooseNoAsClaimant();
            usingExpertPage.chooseExpertNo();
            selfWitnessPage.chooseNo();
            otherWitnessPage.chooseNo();
            hearingDatesPage.chooseNo();
        }
    }
}
exports.DirectionsQuestionnaireSteps = DirectionsQuestionnaireSteps;
