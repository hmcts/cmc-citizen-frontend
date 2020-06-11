"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/ccj/routes/checks/authorization-check");
const paths_1 = require("ccj/paths");
const app_1 = require("main/app");
const paths_2 = require("dashboard/paths");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const signatureType_1 = require("common/signatureType");
const declaration_1 = require("ccj/form/models/declaration");
const qualifiedDeclaration_1 = require("ccj/form/models/qualifiedDeclaration");
const not_claimant_in_case_check_1 = require("test/features/ccj/routes/checks/not-claimant-in-case-check");
const momentFactory_1 = require("shared/momentFactory");
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.checkAndSendPage.evaluateUri({ externalId: externalId });
const dashboardUri = paths_2.Paths.dashboardPage.uri;
const confirmationPage = paths_1.Paths.ccjConfirmationPage.evaluateUri({ externalId: externalId });
describe('CCJ: check and send page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            context('when user authorised', () => {
                it('should return 500 and render error page when cannot retrieve claims', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('ccj');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers'));
                });
                it('should render page when everything is fine when settlement is broken with instalments - cannot change DOB and Payment options', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithFullAdmissionAndSettlement(claimStoreServiceMock.settlementAndSettlementReachedAt);
                    draftStoreServiceMock.resolveFind('ccj');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers', 'Date of birth', 'By instalments'))
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('/ccj/payment-options', '/ccj/date-of-birth'));
                });
                it('should render page with admitted amount when part admission response has been accepted', async () => {
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
                it('should redirect to dashboard when claim is not eligible for CCJ', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithFullAdmissionAndSettlement();
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.redirect.toLocation(dashboardUri));
                });
            });
        });
    });
    describe('on POST', () => {
        const validBasicFormData = { signed: 'true', type: signatureType_1.SignatureType.BASIC };
        const validQualifiedFormData = {
            signed: 'true',
            type: signatureType_1.SignatureType.QUALIFIED,
            signerName: 'Jonny',
            signerRole: 'Director'
        };
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve claim', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send(validBasicFormData)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 when cannot retrieve CCJ draft', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                draftStoreServiceMock.rejectFind('Error');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send(validBasicFormData)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            context('when form is valid', async () => {
                it('should redirect to confirmation page when signature is basic', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('ccj');
                    claimStoreServiceMock.resolveSaveCcjForExternalId();
                    draftStoreServiceMock.resolveDelete();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validBasicFormData)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(confirmationPage));
                });
                it('should redirect to confirmation page when signature is qualified', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('ccj');
                    draftStoreServiceMock.resolveUpdate();
                    claimStoreServiceMock.resolveSaveCcjForExternalId();
                    draftStoreServiceMock.resolveDelete();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validQualifiedFormData)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(confirmationPage));
                });
                it('should return 500 when cannot save CCJ', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('ccj');
                    claimStoreServiceMock.rejectSaveCcjForExternalId();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validBasicFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when form is invalid', async () => {
                it('should render page with error messages when signature is basic', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('ccj');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ signed: undefined, type: signatureType_1.SignatureType.BASIC })
                        .expect(res => chai_1.expect(res).to.be.successful.withText(declaration_1.ValidationErrors.DECLARATION_REQUIRED, 'div class="error-summary"'));
                });
                it('should render page with error messages when signature is qualified', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('ccj');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ signed: 'true', type: signatureType_1.SignatureType.QUALIFIED, signerName: '', signerRole: '' })
                        .expect(res => chai_1.expect(res).to.be.successful.withText(qualifiedDeclaration_1.ValidationErrors.SIGNER_NAME_REQUIRED, 'div class="error-summary"'));
                });
            });
        });
    });
});
