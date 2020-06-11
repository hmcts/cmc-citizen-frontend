"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
/* tslint:disable:no-console */
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const supertest = require("supertest");
const pa11y = require("pa11y");
const chai_1 = require("chai");
const paths_1 = require("eligibility/paths");
const paths_2 = require("claim/paths");
const paths_3 = require("first-contact/paths");
const paths_4 = require("response/paths");
const paths_5 = require("claimant-response/paths");
const paths_6 = require("ccj/paths");
const paths_7 = require("offer/paths");
const paths_8 = require("paid-in-full/paths");
const paths_9 = require("mediation/paths");
const paths_10 = require("directions-questionnaire/paths");
const paths_11 = require("orders/paths");
require("test/a11y/mocks");
const app_1 = require("main/app");
const madeBy_1 = require("claims/models/madeBy");
app_1.app.locals.csrf = 'dummy-token';
const cookieName = config.get('session.cookieName');
const agent = supertest(app_1.app);
async function runPa11y(url) {
    const result = await pa11y(url, {
        headers: {
            Cookie: `${cookieName}=ABC`
        },
        chromeLaunchConfig: {
            args: ['--no-sandbox']
        }
    });
    return result.issues
        .filter((issue) => issue.code !== 'WCAG2AA.Principle2.Guideline2_4.2_4_1.H64.1')
        .filter((issue) => issue.code !== 'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.NoContent');
}
function check(uri) {
    describe(`Page ${uri}`, () => {
        it('should have no accessibility errors', async () => {
            const text = await extractPageText(uri);
            ensureHeadingIsIncludedInPageTitle(text);
            const issues = await runPa11y(agent.get(uri).url);
            ensureNoAccessibilityErrors(issues);
        });
    });
}
async function extractPageText(url) {
    const res = await agent.get(url)
        .set('Cookie', `${cookieName}=ABC;state=000MC000`);
    if (res.redirect) {
        throw new Error(`Call to ${url} resulted in a redirect to ${res.get('Location')}`);
    }
    if (!res.ok) {
        throw new Error(`Call to ${url} resulted in ${res.status}`);
    }
    return res.text;
}
function ensureHeadingIsIncludedInPageTitle(text) {
    const title = text.match(/<title>(.*)<\/title>/)[1];
    const heading = text.match(/<h1 class="heading-large">\s*(.*)\s*<\/h1>/);
    if (heading) { // Some pages does not have heading section e.g. confirmation pages
        chai_1.expect(title).to.be.equal(`${heading[1]} - Money Claims`);
    }
    else {
        chai_1.expect(title).to.be.not.equal(' - Money Claims');
        console.log(`NOTE: No heading found on page titled '${title}' exists`);
    }
}
function ensureNoAccessibilityErrors(issues) {
    const errors = issues.filter((issue) => issue.type === 'error');
    chai_1.expect(errors, `\n${JSON.stringify(errors, null, 2)}\n`).to.be.empty;
}
const excludedPaths = [
    paths_2.Paths.finishPaymentController,
    paths_2.Paths.documentPage,
    paths_2.Paths.startPaymentReceiver,
    paths_2.Paths.finishPaymentReceiver,
    paths_2.Paths.initiatePaymentController,
    paths_2.Paths.receiptReceiver,
    paths_2.Paths.sealedClaimPdfReceiver,
    paths_4.Paths.receiptReceiver,
    paths_4.Paths.legacyDashboardRedirect,
    paths_7.Paths.agreementReceiver,
    paths_3.Paths.receiptReceiver,
    paths_5.Paths.receiptReceiver,
    paths_10.Paths.claimantHearingRequirementsReceiver,
    paths_5.Paths.courtOfferedSetDatePage,
    paths_10.Paths.hearingDatesDeleteReceiver,
    paths_10.Paths.hearingDatesReplaceReceiver,
    paths_10.Paths.hearingDatesPage,
    paths_11.Paths.reviewOrderReceiver,
    paths_11.Paths.directionsOrderDocument,
    paths_9.Paths.mediationAgreementDocument
];
describe('Accessibility', () => {
    function checkPaths(pathsRegistry) {
        Object.values(pathsRegistry).forEach((path) => {
            const excluded = excludedPaths.some(_ => _ === path);
            if (!excluded) {
                if (path.uri.includes(':madeBy')) {
                    check(path.evaluateUri({ externalId: '91e1c70f-7d2c-4c1e-a88f-cbb02c0e64d6', madeBy: madeBy_1.MadeBy.CLAIMANT.value }));
                }
                else if (path.uri.includes(':externalId')) {
                    check(path.evaluateUri({ externalId: '91e1c70f-7d2c-4c1e-a88f-cbb02c0e64d6' }));
                }
                else {
                    check(path.uri);
                }
            }
        });
    }
    checkPaths(paths_1.Paths);
    checkPaths(paths_2.Paths);
    checkPaths(paths_2.ErrorPaths);
    checkPaths(paths_3.Paths);
    checkPaths(paths_3.ErrorPaths);
    checkPaths(paths_4.Paths);
    checkPaths(paths_6.Paths);
    checkPaths(paths_7.Paths);
    checkPaths(paths_4.StatementOfMeansPaths);
    checkPaths(paths_4.FullAdmissionPaths);
    checkPaths(paths_5.Paths);
    checkPaths(paths_8.Paths);
    checkPaths(paths_9.Paths);
    checkPaths(paths_10.Paths);
    checkPaths(paths_11.Paths);
});
