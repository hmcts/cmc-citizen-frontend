"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
const settlementAgreementPath = '/case/:externalId/settlement-agreement';
class Paths {
}
exports.Paths = Paths;
Paths.signSettlementAgreement = new routablePath_1.RoutablePath(`${settlementAgreementPath}/sign-settlement-agreement`);
Paths.settlementAgreementConfirmation = new routablePath_1.RoutablePath(`${settlementAgreementPath}/settlement-agreement-confirmation`);
Paths.repaymentPlanSummary = new routablePath_1.RoutablePath(`${settlementAgreementPath}/repayment-plan-summary`);
