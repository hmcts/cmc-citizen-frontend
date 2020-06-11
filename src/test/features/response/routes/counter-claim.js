"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/common/checks/authorization-check");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const feesServiceMock = require("test/http-mocks/fees");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.counterClaimPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Defendant response: counter claim page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            it('should return 500 and render error page when cannot retrieve claim', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page when everything is fine', async () => {
                draftStoreServiceMock.resolveFind('response');
                draftStoreServiceMock.resolveFind('mediation');
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                feesServiceMock.resolveGetIssueFeeRangeGroup();
                feesServiceMock.resolveGetHearingFeeRangeGroup();
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.successful.withText('Complete and email the defence and counterclaim form by'));
            });
        });
    });
});
