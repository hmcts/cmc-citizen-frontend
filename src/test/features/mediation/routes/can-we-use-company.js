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
const pagePath = paths_1.Paths.canWeUseCompanyPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Free mediation: can we use company page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        describe('as defendant', () => {
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('mediation', { canWeUseCompany: undefined });
                    draftStoreServiceMock.resolveFind('response:full-rejection', { defendantDetails: { partyDetails: Object.assign({}, draftStoreServiceMock.sampleOrganisationDetails) } });
                    claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj);
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Mary Richards the right person for the mediation service to call'));
                });
            });
        });
        describe('as claimant', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            it('should render page when everything is fine', async () => {
                draftStoreServiceMock.resolveFind('mediation', { canWeUseCompany: undefined });
                draftStoreServiceMock.resolveFind('claimantResponse');
                claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimIssueOrgVOrgObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj));
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Enter this person’s phone number, including extension if required'));
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
                it('should redirect to defendant task list when defendant says yes', async () => {
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response:full-rejection', { defendantDetails: { partyDetails: Object.assign({}, draftStoreServiceMock.sampleOrganisationDetails) } });
                    draftStoreServiceMock.resolveUpdate();
                    claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj);
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ option: freeMediation_1.FreeMediationOption.YES, mediationPhoneNumberConfirmation: '07777777777' })
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_2.Paths.taskListPage
                        .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
                it('should show validation error when defendant says yes with no phone number', async () => {
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response:full-rejection', { defendantDetails: { partyDetails: Object.assign({}, draftStoreServiceMock.sampleOrganisationDetails) } });
                    claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj);
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ option: freeMediation_1.FreeMediationOption.YES, mediationPhoneNumberConfirmation: undefined })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('div class="error-summary"'));
                });
                it('should redirect to response task list when no was chosen and a phone number and a contact is given', async () => {
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response:full-rejection', { defendantDetails: { partyDetails: Object.assign({}, draftStoreServiceMock.sampleOrganisationDetails) } });
                    draftStoreServiceMock.resolveUpdate();
                    claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj);
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({
                        option: freeMediation_1.FreeMediationOption.NO,
                        mediationPhoneNumber: '07777777777',
                        mediationContactPerson: 'Mary Richards'
                    })
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_2.Paths.taskListPage
                        .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
                it('should show validation error when defendant says no with no phone number', async () => {
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response:full-rejection', { defendantDetails: { partyDetails: Object.assign({}, draftStoreServiceMock.sampleOrganisationDetails) } });
                    claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj);
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ option: freeMediation_1.FreeMediationOption.NO, mediationPhoneNumber: undefined })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('div class="error-summary"'));
                });
                it('should show validation error when defendant says no with no contact name', async () => {
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response:full-rejection', { defendantDetails: { partyDetails: Object.assign({}, draftStoreServiceMock.sampleOrganisationDetails) } });
                    claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj);
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({
                        option: freeMediation_1.FreeMediationOption.NO,
                        mediationPhoneNumber: '07777777777',
                        mediationContactPerson: undefined
                    })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('div class="error-summary"'));
                });
            });
        });
        // TODO implement claimant response tests when response saving is done
    });
});
