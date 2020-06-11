"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
exports.directionsQuestionnairePath = '/case/:externalId/directions-questionnaire';
class Paths {
}
exports.Paths = Paths;
Paths.hearingLocationPage = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/hearing-location`);
Paths.selfWitnessPage = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/self-witness`);
Paths.otherWitnessesPage = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/other-witnesses`);
Paths.supportPage = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/support-required`);
Paths.hearingExceptionalCircumstancesPage = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/hearing-exceptional-circumstances`);
Paths.expertPage = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/expert`);
Paths.expertEvidencePage = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/expert-evidence`);
Paths.whyExpertIsNeededPage = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/why-expert-is-needed`);
Paths.hearingDatesPage = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/hearing-dates`);
Paths.expertReportsPage = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/expert-reports`);
Paths.expertGuidancePage = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/expert-guidance`);
Paths.permissionForExpertPage = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/permission-for-expert`);
Paths.claimantHearingRequirementsReceiver = new routablePath_1.RoutablePath(`${exports.directionsQuestionnairePath}/claimant-hearing-requirements-receiver`);
Paths.hearingDatesReplaceReceiver = new routablePath_1.RoutablePath(`${Paths.hearingDatesPage.uri}/date-picker/replace`);
// :index should actually be of the form 'date-N' where N is the numeric index,
// because RoutablePath will not accept purely numeric values for parameters
Paths.hearingDatesDeleteReceiver = new routablePath_1.RoutablePath(`${Paths.hearingDatesPage.uri}/date-picker/delete/:index`);
