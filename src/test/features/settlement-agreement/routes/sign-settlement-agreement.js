"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
require("test/routes/expectations");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/features/claimant-response/routes/checks/authorization-check");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const settlementAgreementServiceMock = require("test/http-mocks/settlement-agreement");
const paths_1 = require("settlement-agreement/paths");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.signSettlementAgreement.evaluateUri({ externalId: externalId });
const claim = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { settlement: Object.assign({}, settlementAgreementServiceMock.sampleSettlementAgreementOffer), claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'SETTLEMENT'
    } });
describe('Settlement agreement: sign settlement agreement page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            context('when settlement not countersigned', () => {
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Respond to the settlement agreement'));
                });
                alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath, claim);
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            context('when response not submitted', () => {
                context('when form is invalid', () => {
                    it('should return 500 and render error page when cannot retrieve claim', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should render page when everything is fine', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Respond to the settlement agreement', 'div class="error-summary"'));
                    });
                });
                context('when form is valid', () => {
                    it('should return 500 and render error page when cannot post to claim store', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                        settlementAgreementServiceMock.rejectRejectSettlementAgreement();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: 'no' })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should redirect to confirmation page when everything is fine and settlement agreement is rejected', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                        settlementAgreementServiceMock.resolveRejectSettlementAgreement();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: 'no' })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.settlementAgreementConfirmation
                            .evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to confirmation page when everything is fine and settlement agreement is accepted', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                        settlementAgreementServiceMock.resolveCountersignSettlementAgreement();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: 'yes' })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.settlementAgreementConfirmation
                            .evaluateUri({ externalId: externalId })));
                    });
                    alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath, claim, { option: 'yes' });
                });
            });
        });
    });
});
