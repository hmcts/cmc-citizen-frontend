"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
const paths_1 = require("paid-in-full/paths");
class Paths {
}
exports.Paths = Paths;
Paths.dashboardPage = new routablePath_1.RoutablePath('/dashboard/index');
Paths.howFreeMediationWorksPage = new routablePath_1.RoutablePath(`/dashboard/how-free-mediation-works`);
Paths.claimantPage = new routablePath_1.RoutablePath('/dashboard/:externalId/claimant');
Paths.defendantPage = new routablePath_1.RoutablePath('/dashboard/:externalId/defendant');
Paths.directionsQuestionnairePage = new routablePath_1.RoutablePath('/dashboard/:externalId/directions-questionnaire');
Paths.contactThemPage = new routablePath_1.RoutablePath('/dashboard/:externalId/contact-them');
Paths.datePaidPage = new routablePath_1.RoutablePath(`${paths_1.paidInFullPath}/date-paid`);
