"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/claimant-response/routes/checks/authorization-check");
const not_claimant_in_case_check_1 = require("test/features/claimant-response/routes/checks/not-claimant-in-case-check");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const claimantResponseData_1 = require("test/data/entity/claimantResponseData");
const paths_1 = require("claimant-response/paths");
const app_1 = require("main/app");
const momentFactory_1 = require("shared/momentFactory");
const yesNoOption_1 = require("models/yesNoOption");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Claimant response: confirmation page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            context('when claimant response submitted', () => {
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    let claimantResponseData = Object.assign(Object.assign({}, claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj), { claimantResponse: claimantResponseData_1.rejectionClaimantResponseData });
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimantResponseData);
                    claimStoreServiceMock.mockNextWorkingDay(momentFactory_1.MomentFactory.parse('2019-07-01'));
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Your claim number:'));
                });
                it('should render page when claim is ended', async () => {
                    let claimantResponseData = Object.assign(Object.assign(Object.assign({}, claimStoreServiceMock.sampleFullDefenceRejectEntirely), { claimantRespondedAt: '2017-07-25T22:45:51.785' }), { claimantResponse: claimantResponseData_1.baseAcceptationClaimantResponseData });
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimantResponseData);
                    claimStoreServiceMock.mockNextWorkingDay(momentFactory_1.MomentFactory.parse('2019-07-01'));
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('You didn’t proceed with the claim'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('The claim is now ended.'));
                });
                it('should render page when claim is settled', async () => {
                    let claimantResponseData = Object.assign(Object.assign(Object.assign({}, claimStoreServiceMock.sampleFullDefenceWithStatesPaidGreaterThanClaimAmount), { claimantRespondedAt: '2017-07-25T22:45:51.785' }), { claimantResponse: Object.assign(Object.assign({}, claimantResponseData_1.baseDeterminationAcceptationClaimantResponseData), { settleForAmount: yesNoOption_1.YesNoOption.YES.option }) });
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimantResponseData);
                    claimStoreServiceMock.mockNextWorkingDay(momentFactory_1.MomentFactory.parse('2019-07-01'));
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('You’ve accepted their response'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('The claim is now settled.'));
                });
                it('should render page with hearing requirement', async () => {
                    let claimantResponseData = Object.assign(Object.assign(Object.assign({}, claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj), { claimantResponse: claimantResponseData_1.rejectionClaimantResponseWithDQ }), { features: ['admissions', 'directionsQuestionnaire'] });
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimantResponseData);
                    claimStoreServiceMock.mockNextWorkingDay(momentFactory_1.MomentFactory.parse('2019-07-01'));
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Download your hearing requirements'));
                });
            });
        });
    });
});
