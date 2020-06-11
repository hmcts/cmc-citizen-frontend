"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/claim/routes/checks/authorization-check");
const eligibility_check_1 = require("test/features/claim/routes/checks/eligibility-check");
const paths_1 = require("claim/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const feesServiceMock = require("test/http-mocks/fees");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const cookieName = config.get('session.cookieName');
const pageContent = 'Total amount you’re claiming';
const pagePath = paths_1.Paths.totalPage.uri;
describe('Claim issue: total page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', pagePath);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'get', pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should return 500 and render error page when cannot calculate issue fee', async () => {
                draftStoreServiceMock.resolveFind('claim');
                feesServiceMock.rejectCalculateIssueFee();
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when cannot calculate hearing fee', async () => {
                draftStoreServiceMock.resolveFind('claim');
                feesServiceMock.resolveCalculateIssueFee();
                feesServiceMock.rejectCalculateHearingFee();
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when retrieving issue fee range group failed', async () => {
                draftStoreServiceMock.resolveFind('claim');
                feesServiceMock.resolveCalculateIssueFee();
                feesServiceMock.resolveCalculateHearingFee();
                feesServiceMock.rejectGetIssueFeeRangeGroup();
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when retrieving hearing fee range group failed', async () => {
                draftStoreServiceMock.resolveFind('claim');
                feesServiceMock.resolveCalculateIssueFee();
                feesServiceMock.resolveCalculateHearingFee();
                feesServiceMock.resolveGetIssueFeeRangeGroup();
                feesServiceMock.rejectGetHearingFeeRangeGroup();
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page when everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                feesServiceMock.resolveCalculateIssueFee();
                feesServiceMock.resolveCalculateHearingFee();
                feesServiceMock.resolveGetIssueFeeRangeGroup();
                feesServiceMock.resolveGetHearingFeeRangeGroup();
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText(pageContent, 'Total claim amount'));
            });
            it('should throw error when claim value is above £10000 including interest', async () => {
                draftStoreServiceMock.resolveFind('claim', draftStoreServiceMock.aboveAllowedAmountWithInterest);
                claimStoreServiceMock.mockCalculateInterestRate(0);
                claimStoreServiceMock.mockCalculateInterestRate(500);
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.ErrorPaths.amountExceededPage.uri));
            });
        });
    });
    describe('on POST', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', pagePath);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'post', pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should redirect to task list everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.taskListPage.uri));
            });
        });
    });
});
