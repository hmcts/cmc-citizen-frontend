"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const authorization_check_1 = require("test/common/checks/authorization-check");
const responseType_1 = require("response/form/models/responseType");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const yesNoOption_1 = require("models/yesNoOption");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.PartAdmissionPaths.alreadyPaidPage.evaluateUri({ externalId: externalId });
const validFormData = { option: yesNoOption_1.YesNoOption.YES.option };
describe('Defendant: partial admission - already paid?', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            context('when service is unhealthy', () => {
                it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve response draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when service is healthy', () => {
                const header = 'Have you paid the claimant the amount you admit you owe?';
                it(`should render page asking '${header}' when partial admission was selected`, async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:partial-admission', {
                        response: {
                            type: responseType_1.ResponseType.PART_ADMISSION
                        }
                    });
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(header));
                });
            });
        });
        describe('on POST', () => {
            const method = 'post';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
                context('when service is unhealthy', () => {
                    it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: 'yes' })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 and render error page when cannot retrieve response draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.rejectFind('Error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 and render error page when cannot save response draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response:partial-admission');
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.rejectUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                context('when service is healthy', () => {
                    beforeEach(() => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response:partial-admission', {
                            response: {
                                type: responseType_1.ResponseType.PART_ADMISSION
                            }
                        });
                    });
                    it('when form is valid should render page', async () => {
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId })));
                    });
                    it('when form is invalid should render page', async () => {
                        draftStoreServiceMock.resolveFind('mediation');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: 'invalid' })
                            .expect(res => chai_1.expect(res).to.be.successful
                            .withText('Have you paid', 'div class="error-summary"'));
                    });
                });
            });
        });
    });
});
