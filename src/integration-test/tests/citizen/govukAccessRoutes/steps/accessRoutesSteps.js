"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("integration-test/tests/citizen/home/pages/login");
const test_data_1 = require("integration-test/data/test-data");
const I = actor();
const returnToClaimPage = '/return-to-claim';
const respondToClaimPage = '/respond-to-claim';
const selectors = {
    reference: 'input[id=reference]',
    noClaimNumberLink: 'Don’t have a claim number?',
    submit: 'input[type=submit]',
    mcolRadio: 'input[id="service-mcol"]',
    moneyclaimsRadio: 'input[id="service-moneyclaims"]'
};
const ccbcReference = 'A1QZ1234';
const mcolText = 'Money Claim Online';
const dashboardHeading = 'Your money claims account';
const loginPage = new login_1.LoginPage();
class AccessRoutesSteps {
    returnToClaimMcol() {
        I.amOnPage(returnToClaimPage);
        I.fillField(selectors.reference, ccbcReference);
        I.click(selectors.submit);
        I.see(mcolText);
    }
    returnToClaimMoneyClaims(reference, username) {
        I.amOnPage(returnToClaimPage);
        I.fillField(selectors.reference, reference);
        I.click(selectors.submit);
        loginPage.login(username, test_data_1.DEFAULT_PASSWORD);
        I.see(dashboardHeading);
    }
    dontHaveAReferenceMcol() {
        I.amOnPage(returnToClaimPage);
        I.click(selectors.noClaimNumberLink);
        I.checkOption(selectors.mcolRadio);
        I.click(selectors.submit);
        I.see(mcolText);
    }
    dontHaveAReferenceMoneyClaims(username) {
        I.amOnPage(returnToClaimPage);
        I.click(selectors.noClaimNumberLink);
        I.checkOption(selectors.moneyclaimsRadio);
        I.click(selectors.submit);
        loginPage.login(username, test_data_1.DEFAULT_PASSWORD);
        I.see(dashboardHeading);
    }
    respondToClaimMcol() {
        I.amOnPage(respondToClaimPage);
        I.fillField(selectors.reference, ccbcReference);
        I.click(selectors.submit);
        I.see(mcolText);
    }
    respondToClaimMoneyClaims(reference) {
        I.amOnPage(respondToClaimPage);
        I.fillField(selectors.reference, reference);
        I.click(selectors.submit);
        I.see('Security code');
    }
}
exports.AccessRoutesSteps = AccessRoutesSteps;
