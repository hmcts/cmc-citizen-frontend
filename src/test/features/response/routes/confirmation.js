"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/common/checks/authorization-check");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
const fullDefenceWithStatesPaidLessThanClaimAmount = claimStoreServiceMock.sampleFullDefenceWithStatesPaidLessThanClaimAmount;
const fullDefenceWithStatesPaidLessThanClaimAmountWithMediation = claimStoreServiceMock.sampleFullDefenceWithStatesPaidLessThanClaimAmountWithMediation;
describe('Defendant response: confirmation page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            it('when part admit pay immediately should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.samplePartialAdmissionWithPayImmediatelyDataV2());
                await request(app_1.app)
                    .get(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('You’ve submitted your response', 'You’ve said you owe £3,000 and offered to pay John Smith immediately.', 'We’ll contact you when they respond.', 'You need to pay John Smith £3,000 immediately.', 'Make sure that:', 'they get the money by', ' - they can request a County Court Judgment against you if not', 'any cheques or bank transfers are clear in their account by the deadline', 'you get a receipt for any payments', 'if you need their payment details.', 'If John Smith accepts your offer of £3,000', 'The claim will be settled.', 'If John Smith rejects your offer', 'The court will review the case for the full amount of £200.'));
            });
            it('should render page when yes for mediation and no DQs', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse();
                await request(app_1.app)
                    .get(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('You’ve submitted your response', 'If John Smith rejects your response and agree to try mediation we’ll contact you to arrange a call with the mediator.', 'If they reject mediation the court will review the case. You might have to go to a hearing.'));
            });
            it('should render page when yes for mediation and DQs enabled', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse(claimStoreServiceMock.sampleDefendantResponseWithDQAndMediationObj);
                await request(app_1.app)
                    .get(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('You’ve submitted your response', 'We’ll contact you when John Smith responds, to tell you what to do next.', 'If John Smith accepts your response the claim will be ended.', 'If John Smith rejects your response and agree to try mediation we’ll contact you to arrange a call with the mediator.', 'If they reject mediation the court will review the case. You might have to go to a hearing.'));
            });
            it('should render page when no for mediation and DQs enabled', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse(claimStoreServiceMock.sampleDefendantResponseWithDQAndNoMediationObj);
                await request(app_1.app)
                    .get(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('You’ve submitted your response', 'We’ll contact you when John Smith responds, to tell you what to do next.', 'If John Smith accepts your response the claim will be ended.', 'If they reject your response the court will review the case. You might have to go to a hearing.'));
            });
            it('should render page when yes for mediation and DQs disabled', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse(claimStoreServiceMock.sampleDefendantResponseWithoutDQAndWithMediationObj);
                await request(app_1.app)
                    .get(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('You’ve submitted your response', 'We’ll contact you when John Smith responds, to tell you what to do next.', 'If John Smith accepts your response the claim will be ended.', 'If John Smith rejects your response and agree to try mediation we’ll contact you to arrange a call with the mediator.', 'If they reject mediation the court will review the case. You might have to go to a hearing.'));
            });
            it('should render page when no for mediation and DQs disabled', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse(claimStoreServiceMock.sampleDefendantResponseWithoutDQAndWithoutMediationObj);
                await request(app_1.app)
                    .get(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('You’ve submitted your response', 'We’ll contact you when John Smith responds, to tell you what to do next.', 'If John Smith accepts your response the claim will be ended.'));
            });
            it('when full defence already paid with mediation should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleDefendantResponseAlreadyPaidWithMediationObj);
                await request(app_1.app)
                    .get(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('You’ve submitted your response', 'If John Smith accepts your response the claim will be ended. We’ll contact you when they respond.', 'If John Smith rejects your response we’ll ask them to try mediation. If they agree, we’ll contact you to arrange a call with the mediator.', 'If they reject mediation the court will review the case. You might have to go to a hearing.', 'We’ll contact you to tell you what to do next.'));
            });
            it('when full defence already paid without mediation should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleDefendantResponseAlreadyPaidWithNoMediationObj);
                await request(app_1.app)
                    .get(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('You’ve submitted your response', 'If John Smith accepts your response the claim will be ended. We’ll contact you when they respond.', 'If they reject your response the court will review the case. You might have to go to a hearing.', 'We’ll contact you if we set a hearing date to tell you how to prepare.'));
            });
            it('should return 500 and render error page when cannot retrieve claim', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('internal service error when retrieving response');
                await request(app_1.app)
                    .get(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render states paid with less than claim amount with next step - NO MEDIATION', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullDefenceWithStatesPaidLessThanClaimAmount);
                await request(app_1.app)
                    .get(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('The court will review the case. You might have to go to a hearing.'));
            });
            it('should render states paid with less than claim amount with next step - WITH MEDIATION', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullDefenceWithStatesPaidLessThanClaimAmountWithMediation);
                await request(app_1.app)
                    .get(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('We’ll ask if they want to try mediation. If they agree, we’ll contact you to try to arrange an appointment.'));
            });
        });
    });
});
