"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimant_1 = require("integration-test/tests/citizen/dashboard/pages/claimant");
const dashboard_1 = require("integration-test/tests/citizen/dashboard/pages/dashboard");
const I = actor();
const dashboardPage = new dashboard_1.DashboardPage();
const claimantPage = new claimant_1.ClaimantDashboardPage();
class DashboardSteps {
    startCCJ(claimRef) {
        I.click('My account');
        dashboardPage.selectClaim(claimRef);
        claimantPage.clickRequestCCJ();
    }
}
exports.DashboardSteps = DashboardSteps;
