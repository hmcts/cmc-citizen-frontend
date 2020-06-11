"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/common/checks/authorization-check");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const disability_1 = require("response/form/models/statement-of-means/disability");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const disabilityPage = paths_1.StatementOfMeansPaths.disabilityPage.evaluateUri({
    externalId: claimStoreServiceMock.sampleClaimObj.externalId
});
describe('Statement of means', () => {
    describe('Disability page', () => {
        hooks_1.attachDefaultHooks(app_1.app);
        describe('on GET', () => {
            authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', disabilityPage);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(disabilityPage);
                it('should return error page when unable to retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('Error');
                    await request(app_1.app)
                        .get(disabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return error page when unable to retrieve draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind();
                    await request(app_1.app)
                        .get(disabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return successful response when claim is retrieved', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(disabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Are you disabled?'));
                });
            });
        });
        describe('on POST', () => {
            const validFormData = (choice) => {
                return {
                    option: choice ? disability_1.DisabilityOption.YES : disability_1.DisabilityOption.NO
                };
            };
            authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', disabilityPage);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(disabilityPage);
                it('should return error page when unable to retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('Error');
                    await request(app_1.app)
                        .post(disabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return error page when unable to retrieve draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind();
                    await request(app_1.app)
                        .post(disabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return error page when unable to save draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.rejectUpdate();
                    await request(app_1.app)
                        .post(disabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData(true))
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                context('when all is fine and form is valid', () => {
                    it('should redirect to severe disability page when Yes is selected and defendant is severely disabled', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response:full-admission');
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(disabilityPage)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData(true))
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.StatementOfMeansPaths.severeDisabilityPage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                    it('should redirect to residence page with No', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response:full-admission');
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(disabilityPage)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData(false))
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.StatementOfMeansPaths.residencePage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                });
                it('should trigger validation when all is fine and form is invalid', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(disabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({})
                        .expect(res => chai_1.expect(res).to.be.successful.withText(disability_1.ValidationErrors.OPTION_REQUIRED));
                });
            });
        });
    });
});
