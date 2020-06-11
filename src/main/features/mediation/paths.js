"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
exports.mediationPath = '/case/:externalId/mediation';
class Paths {
}
exports.Paths = Paths;
Paths.howMediationWorksPage = new routablePath_1.RoutablePath(`${exports.mediationPath}/how-mediation-works`);
Paths.mediationAgreementPage = new routablePath_1.RoutablePath(`${exports.mediationPath}/mediation-agreement`);
Paths.willYouTryMediation = new routablePath_1.RoutablePath(`${exports.mediationPath}/will-you-try-mediation`);
Paths.canWeUsePage = new routablePath_1.RoutablePath(`${exports.mediationPath}/can-we-use`);
Paths.canWeUseCompanyPage = new routablePath_1.RoutablePath(`${exports.mediationPath}/can-we-use-company`);
Paths.freeMediationPage = new routablePath_1.RoutablePath(`${exports.mediationPath}/free-mediation`);
Paths.continueWithoutMediationPage = new routablePath_1.RoutablePath(`${exports.mediationPath}/continue-without-mediation`);
Paths.mediationDisagreementPage = new routablePath_1.RoutablePath(`${exports.mediationPath}/mediation-disagreement`);
Paths.tryFreeMediationPage = new routablePath_1.RoutablePath(`${exports.mediationPath}/try-free-mediation`);
Paths.mediationAgreementDocument = new routablePath_1.RoutablePath(`${exports.mediationPath}/agreement`);
