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
const authorization_check_1 = require("test/features/claimant-response/routes/checks/authorization-check");
const not_claimant_in_case_check_1 = require("test/features/claimant-response/routes/checks/not-claimant-in-case-check");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.defendantsResponsePage.evaluateUri({ externalId: externalId });
const taskListPagePath = paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId });
const fullAdmissionResponseWithPaymentBySetDate = claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj;
const fullAdmissionResponseWithPaymentByInstalments = claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj;
const partialAdmissionWithPaymentBySetDate = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj;
const fullDefenceWithStatesPaid = claimStoreServiceMock.sampleFullDefenceWithStatesPaidGreaterThanClaimAmount;
const fullDefenceData = claimStoreServiceMock.sampleFullDefenceRejectEntirely;
describe('Claimant response: view defendant response page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
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
            it('should return 500 and render error page when cannot retrieve claimantResponse draft', async () => {
                draftStoreServiceMock.rejectFind('Error');
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionResponseWithPaymentByInstalments);
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render full admission with instalments page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionResponseWithPaymentByInstalments);
                draftStoreServiceMock.resolveFind('claimantResponse');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('The defendant’s response'));
            });
            it('should render full admission with set date page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionResponseWithPaymentBySetDate);
                draftStoreServiceMock.resolveFind('claimantResponse');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('The defendant’s response'));
            });
            it('should render part admission with SoM page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(partialAdmissionWithPaymentBySetDate);
                draftStoreServiceMock.resolveFind('claimantResponse');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('The defendant’s response'));
            });
            it('should render paid in full with stated amount when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullDefenceWithStatesPaid);
                draftStoreServiceMock.resolveFind('claimantResponse');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText(`£20,000`));
            });
            it('should render full defence with hearing requirements', async () => {
                const fullDefenceWithDQsEnabledData = Object.assign(Object.assign({}, fullDefenceData), { features: ['admissions', 'directionsQuestionnaire'] });
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullDefenceWithDQsEnabledData);
                draftStoreServiceMock.resolveFind('claimantResponse');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText(`has rejected the claim.`, `Download their full response and hearing requirements`));
            });
            it('should render part admission with hearing requirements', async () => {
                const partAdmissionWithDQsEnabledData = Object.assign(Object.assign({}, partialAdmissionWithPaymentBySetDate), { features: ['admissions', 'directionsQuestionnaire'] });
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(partAdmissionWithDQsEnabledData);
                draftStoreServiceMock.resolveFind('claimantResponse');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText(`They don’t believe they owe the full amount claimed.`));
            });
        });
        describe('on POST', () => {
            const method = 'post';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
                });
                context('when middleware failure', () => {
                    it('should return 500 when cannot retrieve claim by external id', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ viewedDefendantResponse: true })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 when cannot retrieve claimantResponse draft', async () => {
                        draftStoreServiceMock.rejectFind('Error');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionResponseWithPaymentByInstalments);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ viewedDefendantResponse: true })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 and render error page when cannot save claimantResponse draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionResponseWithPaymentByInstalments);
                        draftStoreServiceMock.resolveFind('claimantResponse');
                        draftStoreServiceMock.rejectUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ viewedDefendantResponse: true })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                it('should render second part admission page when pagination was requested and everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(partialAdmissionWithPaymentBySetDate);
                    draftStoreServiceMock.resolveFind('claimantResponse');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ action: { showPage: 1 } })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('How they want to pay'));
                });
                it('should redirect to task list page when pagination was not requested and everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionResponseWithPaymentByInstalments);
                    draftStoreServiceMock.resolveFind('claimantResponse');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ viewedDefendantResponse: true })
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(taskListPagePath));
                });
            });
        });
    });
});
