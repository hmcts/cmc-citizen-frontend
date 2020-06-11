"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
const paths_1 = require("shared/components/payment-intention/paths");
const Paths_1 = require("shared/components/ccj/Paths");
exports.claimantResponsePath = '/case/:externalId/claimant-response';
class Paths {
}
exports.Paths = Paths;
Paths.taskListPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/task-list`);
Paths.defendantsResponsePage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/defendants-response`);
Paths.settleAdmittedPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/settle-admitted`);
Paths.acceptPaymentMethodPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/accept-payment-method`);
Paths.checkAndSendPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/check-and-send`);
Paths.incompleteSubmissionPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/incomplete-submission`);
Paths.notImplementedYetPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/not-implemented-yet`);
Paths.chooseHowToProceedPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/choose-how-to-proceed`);
Paths.signSettlementAgreementPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/sign-settlement-agreement`);
Paths.alternateRepaymentPlanPage = new routablePath_1.RoutablePath(exports.claimantResponsePath + paths_1.Paths.paymentOptionPage.uri);
Paths.paymentDatePage = new routablePath_1.RoutablePath(exports.claimantResponsePath + paths_1.Paths.paymentDatePage.uri);
Paths.paymentPlanPage = new routablePath_1.RoutablePath(exports.claimantResponsePath + paths_1.Paths.paymentPlanPage.uri);
Paths.confirmationPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/confirmation`);
Paths.rejectionReasonPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/rejection-reason`);
Paths.courtOfferedInstalmentsPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/court-offered-instalments`);
Paths.counterOfferAcceptedPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/counter-offer-accepted`);
Paths.receiptReceiver = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/receipt`);
Paths.partPaymentReceivedPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/part-payment-received`);
Paths.settleClaimPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/settle-claim`);
Paths.payBySetDateAcceptedPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/pay-by-set-date-accepted`);
Paths.courtOfferedSetDatePage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/court-offered-set-date`);
Paths.intentionToProceedPage = new routablePath_1.RoutablePath(`${exports.claimantResponsePath}/intention-to-proceed`);
exports.claimantResponseCCJPath = '/case/:externalId/claimant-response/county-court-judgment';
class CCJPaths {
}
exports.CCJPaths = CCJPaths;
CCJPaths.paidAmountPage = new routablePath_1.RoutablePath(exports.claimantResponseCCJPath + Paths_1.Paths.paidAmountPage.uri);
CCJPaths.paidAmountSummaryPage = new routablePath_1.RoutablePath(exports.claimantResponseCCJPath + Paths_1.Paths.paidAmountSummaryPage.uri);
