"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
class Paths {
}
exports.Paths = Paths;
Paths.homePage = new routablePath_1.RoutablePath('/', false);
Paths.resolveBeforeClaimPage = new routablePath_1.RoutablePath('/resolve-before-claim', false);
Paths.receiver = new routablePath_1.RoutablePath('/receiver', false);
Paths.linkDefendantReceiver = new routablePath_1.RoutablePath('/receiver/link-defendant', false);
Paths.logoutReceiver = new routablePath_1.RoutablePath('/logout', false);
Paths.privacyPolicyPage = new routablePath_1.RoutablePath('/privacy-policy', false);
Paths.cookiesPage = new routablePath_1.RoutablePath('/cookies', false);
Paths.termsAndConditionsPage = new routablePath_1.RoutablePath('/terms-and-conditions', false);
Paths.contactUsPage = new routablePath_1.RoutablePath('/contact-us', false);
Paths.accessibilityPage = new routablePath_1.RoutablePath('/accessibility-statement', false);
// Ajax endpoints
Paths.postcodeLookupProxy = new routablePath_1.RoutablePath('/postcode-lookup', false);
Paths.paymentPlanCalculation = new routablePath_1.RoutablePath('/payment-plan-calculation', false);
Paths.totalIncomeOrExpensesCalculation = new routablePath_1.RoutablePath('/total-income-expense-calculation', false);
// gov.uk entrypoints - these can't change without updating gov.uk content as well
Paths.makeClaimReceiver = new routablePath_1.RoutablePath('/make-claim', false);
Paths.respondToClaimReceiver = new routablePath_1.RoutablePath('/respond-to-claim', false);
Paths.returnToClaimReceiver = new routablePath_1.RoutablePath('/return-to-claim', false);
Paths.enterClaimNumberPage = new routablePath_1.RoutablePath('/enter-claim-number', false);
Paths.noClaimNumberPage = new routablePath_1.RoutablePath('/no-claim-number', false);
