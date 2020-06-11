"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/common/checks/authorization-check");
const paths_1 = require("orders/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const featureToggles_1 = require("utils/featureToggles");
const cookieName = config.get('session.cookieName');
const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc';
const pagePath = paths_1.Paths.disagreeReasonPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
const pageTitle = 'How and why do you want the order changed?';
if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
    describe('Orders: why do you disagree with the order page', () => {
        hooks_1.attachDefaultHooks(app_1.app);
        describe('on GET', () => {
            const method = 'get';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('orders');
                    claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId({ features: 'admissions,directionsQuestionnaire' });
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(pageTitle));
                });
            });
        });
        describe('on POST', () => {
            const method = 'post';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            context('when defendant authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
                context('when response not submitted', () => {
                    it('should return 500 and render error page when cannot retrieve claim', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                context('when form is valid', () => {
                    it('should return 500 and render error page when cannot save draft', async () => {
                        draftStoreServiceMock.resolveFind('orders');
                        draftStoreServiceMock.rejectSave();
                        claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId({ features: 'admissions,directionsQuestionnaire' });
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ reason: 'I want a judge to review' })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should redirect to the dashboard when nothing is entered', async () => {
                        draftStoreServiceMock.resolveFind('orders');
                        draftStoreServiceMock.resolveSave();
                        claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId({ features: 'admissions,directionsQuestionnaire' });
                        claimStoreServiceMock.resolveSaveOrder();
                        draftStoreServiceMock.resolveFind('orders');
                        draftStoreServiceMock.resolveDelete();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ reason: '' })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.confirmationPage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to the dashboard when everything is fine', async () => {
                        draftStoreServiceMock.resolveFind('orders');
                        draftStoreServiceMock.resolveSave();
                        claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId({ features: 'admissions,directionsQuestionnaire' });
                        claimStoreServiceMock.resolveSaveOrder();
                        draftStoreServiceMock.resolveFind('orders');
                        draftStoreServiceMock.resolveDelete();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ reason: 'I want a judge to review' })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.confirmationPage.evaluateUri({ externalId: externalId })));
                    });
                });
            });
        });
    });
}
