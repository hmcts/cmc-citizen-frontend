"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("dashboard/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const authorization_check_1 = require("test/features/dashboard/routes/checks/authorization-check");
const momentFactory_1 = require("shared/momentFactory");
const responseData_1 = require("test/data/entity/responseData");
const fullDefenceData_1 = require("test/data/entity/fullDefenceData");
const mediationOutcome_1 = require("claims/models/mediationOutcome");
function statesPaidClaim() {
    return Object.assign(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { responseDeadline: momentFactory_1.MomentFactory.currentDate().add(1, 'days') }), fullDefenceData_1.respondedAt());
}
const cookieName = config.get('session.cookieName');
function testData() {
    return [
        {
            status: 'States paid defence - defendant paid what he believed he owed - claimant rejects',
            claim: statesPaidClaim(),
            claimOverride: Object.assign({ response: Object.assign({}, responseData_1.partialAdmissionFromStatesPaidDefence) }, fullDefenceData_1.claimantRejectAlreadyPaid()),
            claimantAssertions: ['Wait for the court to review the case'],
            defendantAssertions: ['Wait for the court to review the case']
        },
        {
            status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects',
            claim: statesPaidClaim(),
            claimOverride: Object.assign({ response: Object.assign({}, responseData_1.partialAdmissionFromStatesPaidWithMediationDefence) }, fullDefenceData_1.claimantRejectAlreadyPaidWithMediation()),
            claimantAssertions: ['We’ll contact you to try to arrange a mediation appointment'],
            defendantAssertions: ['We’ll contact you to try to arrange a mediation appointment']
        },
        {
            status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects - mediation failed',
            claim: statesPaidClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign({}, responseData_1.partialAdmissionFromStatesPaidWithMediationDefence) }, fullDefenceData_1.claimantRejectAlreadyPaidWithMediation()), { mediationOutcome: mediationOutcome_1.MediationOutcome.FAILED }),
            claimantAssertions: ['Mediation was unsuccessful'],
            defendantAssertions: ['Mediation was unsuccessful']
        },
        {
            status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects - mediation success',
            claim: statesPaidClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign({}, responseData_1.partialAdmissionFromStatesPaidWithMediationDefence) }, fullDefenceData_1.claimantRejectAlreadyPaidWithMediation()), { mediationOutcome: mediationOutcome_1.MediationOutcome.SUCCEEDED }),
            claimantAssertions: ['You both agreed a settlement through mediation'],
            defendantAssertions: ['You both agreed a settlement through mediation']
        }
    ];
}
describe('Dashboard page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', paths_1.Paths.dashboardPage.uri);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            context('Dashboard Status', () => {
                context('as a claimant', () => {
                    beforeEach(() => {
                        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList();
                    });
                    testData().forEach(data => {
                        it(`should render dashboard: ${data.status}`, async () => {
                            draftStoreServiceMock.resolveFindNoDraftFound();
                            claimStoreServiceMock.resolveRetrieveByClaimantId(data.claim, data.claimOverride);
                            await request(app_1.app)
                                .get(paths_1.Paths.dashboardPage.uri)
                                .set('Cookie', `${cookieName}=ABC`)
                                .expect(res => chai_1.expect(res).to.be.successful.withText(...data.claimantAssertions));
                        });
                    });
                });
                context('as a defendant', () => {
                    beforeEach(() => {
                        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList();
                    });
                    testData().forEach(data => {
                        it(`should render dashboard: ${data.status}`, async () => {
                            draftStoreServiceMock.resolveFindNoDraftFound();
                            claimStoreServiceMock.resolveRetrieveByDefendantId(data.claim.referenceNumber, '1', data.claim, data.claimOverride);
                            await request(app_1.app)
                                .get(paths_1.Paths.dashboardPage.uri)
                                .set('Cookie', `${cookieName}=ABC`)
                                .expect(res => chai_1.expect(res).to.be.successful.withText(...data.defendantAssertions));
                        });
                    });
                });
            });
        });
    });
});
