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
const pagePath = paths_1.Paths.repaymentPlanSummary.evaluateUri({ externalId: externalId });
describe('Settlement agreement: repayment plan summary page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            context('when response not submitted', () => {
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render the claimants repayment plan when offer is not by court determination', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { settlement: Object.assign({}, settlementAgreementServiceMock.sampleSettlementAgreementOffer), claimantResponse: {
                            type: 'ACCEPTATION',
                            formaliseOption: 'SETTLEMENT',
                            courtDetermination: {}
                        } }));
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('The claimant’s repayment plan'));
                });
                it('should render court repayment plan when offer from court determination has been accepted', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { settlement: Object.assign({}, settlementAgreementServiceMock.sampleSettlementAgreementOfferMadeByCourt), claimantResponse: {
                            type: 'ACCEPTATION',
                            formaliseOption: 'SETTLEMENT',
                            courtDetermination: {}
                        } }));
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('The court’s repayment plan'));
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
