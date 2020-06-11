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
const partnerSevereDisability_1 = require("response/form/models/statement-of-means/partnerSevereDisability");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const partnerSevereDisabilityPage = paths_1.StatementOfMeansPaths.partnerSevereDisabilityPage.evaluateUri({
    externalId: claimStoreServiceMock.sampleClaimObj.externalId
});
describe('Statement of means', () => {
    describe('Partner Severe Disability page', () => {
        hooks_1.attachDefaultHooks(app_1.app);
        describe('on GET', () => {
            authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', partnerSevereDisabilityPage);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(partnerSevereDisabilityPage);
                it('should return error page when unable to retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('Error');
                    await request(app_1.app)
                        .get(partnerSevereDisabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return error page when unable to retrieve draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind();
                    await request(app_1.app)
                        .get(partnerSevereDisabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return successful response when claim is retrieved', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(partnerSevereDisabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Is your partner severely disabled?'));
                });
            });
        });
        describe('on POST', () => {
            const validFormData = {
                option: partnerSevereDisability_1.PartnerSevereDisabilityOption.YES
            };
            authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', partnerSevereDisabilityPage);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(partnerSevereDisabilityPage);
                it('should return error page when unable to retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('Error');
                    await request(app_1.app)
                        .post(partnerSevereDisabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return error page when unable to retrieve draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind();
                    await request(app_1.app)
                        .post(partnerSevereDisabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return error page when unable to save draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.rejectUpdate();
                    await request(app_1.app)
                        .post(partnerSevereDisabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should redirect to dependants page when all is fine and form is valid', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(partnerSevereDisabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.StatementOfMeansPaths.dependantsPage
                        .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
                it('should trigger validation when all is fine and form is invalid', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(partnerSevereDisabilityPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({})
                        .expect(res => chai_1.expect(res).to.be.successful.withText(partnerSevereDisability_1.ValidationErrors.OPTION_REQUIRED));
                });
            });
        });
    });
});
