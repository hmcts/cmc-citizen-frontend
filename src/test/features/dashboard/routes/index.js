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
const claimantResponseData_1 = require("test/data/entity/claimantResponseData");
const cookieName = config.get('session.cookieName');
const partAdmissionClaim = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { responseDeadline: momentFactory_1.MomentFactory.currentDate().add(1, 'days'), response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.basePartialAdmissionData), { amount: 30 }) });
const fullDefenceClaim = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { responseDeadline: momentFactory_1.MomentFactory.currentDate().add(1, 'days'), response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData), { amount: 30 }) });
function testData() {
    return [
        {
            status: 'claim issued',
            claim: claimStoreServiceMock.sampleClaimIssueObj,
            claimOverride: {
                responseDeadline: momentFactory_1.MomentFactory.currentDate().add(1, 'days')
            },
            claimantAssertions: ['000MC050', 'Wait for the defendant to respond'],
            defendantAssertions: ['000MC050', 'Respond to claim.', '(1 day remaining)']
        },
        {
            status: 'requested more time',
            claim: claimStoreServiceMock.sampleClaimIssueObj,
            claimOverride: {
                moreTimeRequested: true,
                responseDeadline: '2099-08-08'
            },
            claimantAssertions: ['000MC050', 'John Doe has requested more time to respond.'],
            defendantAssertions: ['000MC050', 'You need to respond before 4pm on 8 August 2099.']
        },
        {
            status: 'partial admission, pay immediately',
            claim: partAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, partAdmissionClaim.response), responseData_1.basePayImmediatelyData())
            },
            claimantAssertions: ['000MC000', 'Respond to the defendant.'],
            defendantAssertions: ['000MC000', 'You’ve admitted part of the claim.']
        },
        {
            status: 'partial admission, pay immediately, offer accepted',
            claim: partAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, partAdmissionClaim.response), responseData_1.basePayImmediatelyData()),
                claimantResponse: claimantResponseData_1.baseAcceptationClaimantResponseData
            },
            claimantAssertions: ['000MC000', 'You’ve accepted the defendant’s part admission. They said they’d pay immediately.'],
            defendantAssertions: ['000MC000', 'John Smith accepted your admission of £30']
        },
        {
            status: 'partial admission, pay immediately, offer accepted, payment past deadline',
            claim: partAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, partAdmissionClaim.response), responseData_1.basePayImmediatelyData()),
                claimantResponse: claimantResponseData_1.baseAcceptationClaimantResponseData
            },
            claimantAssertions: ['000MC000', 'You’ve accepted the defendant’s part admission. They said they’d pay immediately.'],
            defendantAssertions: ['000MC000', 'John Smith accepted your admission of £30']
        },
        {
            status: 'partial admission, pay by set date',
            claim: partAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, partAdmissionClaim.response), responseData_1.basePayBySetDateData)
            },
            claimantAssertions: ['000MC000', 'Respond to the defendant.'],
            defendantAssertions: ['000MC000', 'You’ve admitted part of the claim.']
        },
        {
            status: 'partial admission, pay by repayment plan',
            claim: partAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, partAdmissionClaim.response), responseData_1.basePayByInstalmentsData)
            },
            claimantAssertions: ['000MC000', 'Respond to the defendant.'],
            defendantAssertions: ['000MC000', 'You’ve admitted part of the claim.']
        },
        {
            status: 'partial admission, states paid accepted',
            claim: partAdmissionClaim,
            claimOverride: {
                response: Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData),
                claimantResponse: { type: 'ACCEPTATION' }
            },
            claimantAssertions: ['000MC000', 'This claim is settled.'],
            defendantAssertions: ['000MC000', 'This claim is settled.']
        },
        {
            status: 'partial admission, states paid rejected',
            claim: partAdmissionClaim,
            claimOverride: {
                response: Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData),
                claimantResponse: { type: 'REJECTION' }
            },
            claimantAssertions: ['000MC000', 'Wait for the court to review the case'],
            defendantAssertions: ['000MC000', 'Wait for the court to review the case']
        },
        {
            status: 'full defence, states paid accepted',
            claim: fullDefenceClaim,
            claimOverride: {
                response: Object.assign({}, responseData_1.defenceWithAmountClaimedAlreadyPaidData),
                claimantResponse: { type: 'ACCEPTATION' }
            },
            claimantAssertions: ['000MC000', 'This claim is settled.'],
            defendantAssertions: ['000MC000', 'This claim is settled.']
        },
        {
            status: 'full defence, states paid rejected',
            claim: fullDefenceClaim,
            claimOverride: {
                response: Object.assign({}, responseData_1.defenceWithAmountClaimedAlreadyPaidData),
                claimantResponse: { type: 'REJECTION' }
            },
            claimantAssertions: ['000MC000', 'Wait for the court to review the case'],
            defendantAssertions: ['000MC000', 'Wait for the court to review the case']
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
            it('should return 500 and render error page when cannot retrieve claims', async () => {
                draftStoreServiceMock.resolveFind('claim');
                claimStoreServiceMock.rejectRetrieveByClaimantId('HTTP error');
                await request(app_1.app)
                    .get(paths_1.Paths.dashboardPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            context('when no claims issued', () => {
                beforeEach(() => {
                    claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList();
                    claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList();
                });
                it('should render page with start claim button when everything is fine', async () => {
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    await request(app_1.app)
                        .get(paths_1.Paths.dashboardPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Your money claims account', 'Make a new money claim'));
                });
                it('should render page with continue claim button when everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .get(paths_1.Paths.dashboardPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Your money claims account', 'Continue with claim'));
                });
            });
            context('Dashboard Status', () => {
                context('as a claimant', () => {
                    beforeEach(() => {
                        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList();
                    });
                    it('should render page with start claim button when everything is fine', async () => {
                        draftStoreServiceMock.resolveFindNoDraftFound();
                        claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList();
                        await request(app_1.app)
                            .get(paths_1.Paths.dashboardPage.uri)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Your money claims account', 'Make a new money claim'));
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
                    it('should render page with start claim button when everything is fine', async () => {
                        draftStoreServiceMock.resolveFindNoDraftFound();
                        claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList();
                        await request(app_1.app)
                            .get(paths_1.Paths.dashboardPage.uri)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Your money claims account', 'Make a new money claim'));
                    });
                    it('should render page with claim number and status', async () => {
                        draftStoreServiceMock.resolveFindNoDraftFound();
                        claimStoreServiceMock.resolveRetrieveByDefendantId(claimStoreServiceMock.sampleClaimIssueObj.referenceNumber, '1', claimStoreServiceMock.sampleClaimIssueObj);
                        await request(app_1.app)
                            .get(paths_1.Paths.dashboardPage.uri)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('000MC050', 'Respond to claim'));
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
