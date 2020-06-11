"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/common/checks/authorization-check");
const paths_1 = require("mediation/paths");
const paths_2 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const freeMediation_1 = require("forms/models/freeMediation");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.canWeUsePage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Free mediation: can we use phone number page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        context('when user authorised', () => {
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
            it('should render page when everything is fine and no defendant phone number is provided', async () => {
                draftStoreServiceMock.resolveFind('mediation');
                draftStoreServiceMock.resolveFind('response');
                claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId();
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Can the mediation service use'));
            });
            it('should render page when everything is fine and defendant phone number is not provided', async () => {
                draftStoreServiceMock.resolveFind('mediation');
                draftStoreServiceMock.resolveFind('response', { defendantDetails: { phone: { number: undefined } } });
                claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId();
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Enter a phone number'));
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
            alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
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
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.rejectUpdate();
                    claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ option: freeMediation_1.FreeMediationOption.YES, mediationPhoneNumber: undefined })
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should redirect to defendant task list when defendant says yes', async () => {
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveUpdate();
                    claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ option: freeMediation_1.FreeMediationOption.YES })
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_2.Paths.taskListPage
                        .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
                it('should redirect to response task list when No was chosen and a phone number is given', async () => {
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveUpdate();
                    claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({
                        option: freeMediation_1.FreeMediationOption.NO,
                        mediationPhoneNumber: '07777777777'
                    })
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_2.Paths.taskListPage
                        .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
            });
        });
        // TODO implement claimant response tests when response saving is done
    });
});
