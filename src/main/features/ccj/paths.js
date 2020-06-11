"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
exports.ccjPath = '/case/:externalId/ccj';
class Paths {
}
exports.Paths = Paths;
Paths.dateOfBirthPage = new routablePath_1.RoutablePath(`${exports.ccjPath}/date-of-birth`);
Paths.paidAmountPage = new routablePath_1.RoutablePath(`${exports.ccjPath}/paid-amount`);
Paths.paidAmountSummaryPage = new routablePath_1.RoutablePath(`${exports.ccjPath}/paid-amount-summary`);
Paths.paymentOptionsPage = new routablePath_1.RoutablePath(`${exports.ccjPath}/payment-options`);
Paths.checkAndSendPage = new routablePath_1.RoutablePath(`${exports.ccjPath}/check-and-send`);
Paths.payBySetDatePage = new routablePath_1.RoutablePath(`${exports.ccjPath}/pay-by-set-date`);
Paths.repaymentPlanPage = new routablePath_1.RoutablePath(`${exports.ccjPath}/repayment-plan`);
Paths.repaymentPlanSummaryPage = new routablePath_1.RoutablePath(`${exports.ccjPath}/repayment-plan-summary/:madeBy`);
Paths.redeterminationPage = new routablePath_1.RoutablePath(`${exports.ccjPath}/redetermination/:madeBy`);
Paths.ccjConfirmationPage = new routablePath_1.RoutablePath(`${exports.ccjPath}/confirmation-ccj`);
Paths.redeterminationConfirmationPage = new routablePath_1.RoutablePath(`${exports.ccjPath}/confirmation-redetermination`);
