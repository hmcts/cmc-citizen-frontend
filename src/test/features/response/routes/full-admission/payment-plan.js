"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const validationErrors_1 = require("forms/validation/validationErrors");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/common/checks/authorization-check");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const responseType_1 = require("response/form/models/responseType");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.FullAdmissionPaths.paymentPlanPage.evaluateUri({ externalId: externalId });
const taskListPage = paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId });
describe('Defendant: payment page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'claimant');
            });
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            context('when user authorised', () => {
                it('should return 500 and render error page when cannot retrieve claims', async () => {
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
                it('should render page when everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Your repayment plan'));
                });
            });
        });
    });
    describe('on POST', () => {
        const validFormData = {
            totalAmount: 160,
            instalmentAmount: 30,
            firstPaymentDate: {
                day: 12,
                month: 3,
                year: 2050
            },
            paymentSchedule: 'EVERY_MONTH'
        };
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
            it('should return 500 and render error page when cannot retrieve claim', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send(validFormData)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 when cannot retrieve response draft', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                draftStoreServiceMock.rejectFind('Error');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send(validFormData)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            context('when form is valid', async () => {
                it('should redirect to task list page after form submit', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission', {
                        response: {
                            type: responseType_1.ResponseType.FULL_ADMISSION
                        }
                    });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(taskListPage));
                });
            });
            context('when form is invalid with no regular payments', async () => {
                it('should render page with error messages', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ instalmentAmount: undefined })
                        .expect(res => chai_1.expect(res).to.be.successful.withText(validationErrors_1.ValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND));
                });
            });
        });
    });
});
