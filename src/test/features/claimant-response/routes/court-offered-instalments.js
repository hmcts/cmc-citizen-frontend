"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("claimant-response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const authorization_check_1 = require("test/common/checks/authorization-check");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const momentFactory_1 = require("shared/momentFactory");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId });
const taskListPagePath = paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId });
const defendantFullAdmissionResponse = claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj;
const rejectionReasonPagePath = paths_1.Paths.rejectionReasonPage.evaluateUri({ externalId: externalId });
const draftOverrideForClaimantReponse = {
    alternatePaymentMethod: {
        paymentOption: {
            option: {
                value: 'INSTALMENTS',
                displayValue: 'By instalments'
            }
        },
        paymentPlan: {
            totalAmount: 3326.59,
            instalmentAmount: 3000,
            firstPaymentDate: {
                year: 2019,
                month: 1,
                day: 1
            },
            paymentSchedule: {
                value: 'EACH_WEEK',
                displayValue: 'Each week'
            }
        }
    }
};
describe('Claimant Response - Court offer', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        describe('when user authorised', () => {
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
            it('should render page with courts proposed repayment plan', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponse);
                draftStoreServiceMock.resolveFind('claimantResponse', {
                    courtOfferedPaymentIntention: {
                        paymentOption: {
                            value: 'INSTALMENTS'
                        },
                        repaymentPlan: {
                            instalmentAmount: 4.3333335,
                            firstPaymentDate: '2019-01-01T00:00:00.000',
                            paymentSchedule: 'EVERY_MONTH',
                            completionDate: momentFactory_1.MomentFactory.parse('2039-05-08T00:00:00.000'),
                            paymentLength: '20 years 5 months'
                        }
                    }
                });
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('The defendant can’t afford your plan'));
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        describe('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should redirect to task list page when court offer is accepted', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponse);
                draftStoreServiceMock.resolveFind('claimantResponse', draftOverrideForClaimantReponse);
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ accept: 'yes' })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(taskListPagePath));
            });
            it('should redirect to rejection reason page when court offer is rejected', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponse);
                draftStoreServiceMock.resolveFind('claimantResponse', draftOverrideForClaimantReponse);
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ accept: 'no' })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(rejectionReasonPagePath));
            });
        });
    });
});
