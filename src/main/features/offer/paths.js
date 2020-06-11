"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
const offerPath = '/case/:externalId/offer';
class Paths {
}
exports.Paths = Paths;
Paths.offerPage = new routablePath_1.RoutablePath(`${offerPath}/your-offer`);
Paths.offerConfirmationPage = new routablePath_1.RoutablePath(`${offerPath}/offer-confirmation`);
Paths.settleOutOfCourtPage = new routablePath_1.RoutablePath(`${offerPath}/settle-out-of-court`);
Paths.responsePage = new routablePath_1.RoutablePath(`${offerPath}/response`);
Paths.makeAgreementPage = new routablePath_1.RoutablePath(`${offerPath}/make-agreement`);
Paths.countersignAgreementPage = new routablePath_1.RoutablePath(`${offerPath}/countersign-agreement`);
Paths.declarationPage = new routablePath_1.RoutablePath(`${offerPath}/declaration`);
Paths.settledPage = new routablePath_1.RoutablePath(`${offerPath}/settled`);
Paths.acceptedPage = new routablePath_1.RoutablePath(`${offerPath}/accepted`);
Paths.rejectedPage = new routablePath_1.RoutablePath(`${offerPath}/rejected`);
Paths.agreementReceiver = new routablePath_1.RoutablePath(`${offerPath}/agreement`);
