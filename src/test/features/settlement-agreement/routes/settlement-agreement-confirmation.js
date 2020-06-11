"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/claimant-response/routes/checks/authorization-check");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const settlementAgreementServiceMock = require("test/http-mocks/settlement-agreement");
const paths_1 = require("settlement-agreement/paths");
const app_1 = require("main/app");
const alreadyPaidInFullGuard_1 = require("../../../app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.settlementAgreementConfirmation.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Claimant response: confirmation page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
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
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { settlement: Object.assign({}, settlementAgreementServiceMock.sampleSettlementAgreementRejection) }));
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res)
                        .to.be.successful.withText('You’ve rejected the settlement agreement'));
                });
                alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath, {
                    settlement: Object.assign({}, settlementAgreementServiceMock.sampleSettlementAgreementOffer),
                    claimantResponse: {
                        type: 'ACCEPTATION',
                        formaliseOption: 'SETTLEMENT'
                    }
                });
            });
        });
    });
});
