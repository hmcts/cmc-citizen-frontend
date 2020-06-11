"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("ccj/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const authorization_check_1 = require("test/features/ccj/routes/checks/authorization-check");
const not_claimant_in_case_check_1 = require("test/features/ccj/routes/checks/not-claimant-in-case-check");
const momentFactory_1 = require("shared/momentFactory");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.paidAmountSummaryPage.evaluateUri({ externalId: externalId });
describe('CCJ - paid amount summary page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve claims', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
                draftStoreServiceMock.rejectFind('Error');
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page when everything is fine', async () => {
                draftStoreServiceMock.resolveFind('ccj');
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Judgment amount'));
            });
            it('should render page when everything is fine when settlement is broken', async () => {
                draftStoreServiceMock.resolveFind('ccj');
                claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithFullAdmissionAndSettlement(claimStoreServiceMock.settlementAndSettlementReachedAt);
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Judgment amount'));
            });
            it('should render page using admitted amount when defendant response is part admission', async () => {
                let claimWithAdmission = Object.assign(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.samplePartialAdmissionWithPayImmediatelyData()), {
                    countyCourtJudgment: undefined,
                    settlement: undefined,
                    claimantResponse: {
                        type: 'ACCEPTATION'
                    }
                });
                claimWithAdmission.response.paymentIntention.paymentDate = momentFactory_1.MomentFactory.currentDate().subtract(1, 'days');
                claimWithAdmission.response.amount = 10;
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithAdmission);
                draftStoreServiceMock.resolveFind('ccj');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('£10'));
            });
        });
    });
});
