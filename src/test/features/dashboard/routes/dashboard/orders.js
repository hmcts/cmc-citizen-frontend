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
const madeBy_1 = require("claims/models/madeBy");
const cookieName = config.get('session.cookieName');
function ordersClaim() {
    return Object.assign(Object.assign(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { responseDeadline: momentFactory_1.MomentFactory.currentDate().add(1, 'days'), features: ['admissions', 'directionsQuestionnaire'], response: Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.defenceWithDisputeData), claimantResponse: {
            type: 'REJECTION'
        }, claimantRespondedAt: momentFactory_1.MomentFactory.currentDate() }), fullDefenceData_1.respondedAt()), { directionOrder: {
            directions: [
                {
                    id: 'd2832981-a23a-4a4c-8b6a-a013c2c8a637',
                    directionParty: 'BOTH',
                    directionType: 'DOCUMENTS',
                    directionActionedDate: '2019-09-20'
                },
                {
                    id: '8e3a20c2-10a4-49fd-b1a7-da66b088f978',
                    directionParty: 'BOTH',
                    directionType: 'EYEWITNESS',
                    directionActionedDate: '2019-08-20'
                }
            ],
            paperDetermination: 'no',
            preferredDQCourt: 'Central London County Court',
            hearingCourt: 'CLERKENWELL',
            hearingCourtName: 'Clerkenwell and Shoreditch County Court and Family Court',
            hearingCourtAddress: {
                line1: 'The Gee Street Courthouse',
                line2: '29-41 Gee Street',
                city: 'London',
                postcode: 'EC1V 3RE'
            },
            estimatedHearingDuration: 'HALF_HOUR',
            createdOn: '2019-08-09T09:27:42.04'
        } });
}
function testData() {
    return [
        {
            status: 'Orders - defendant fully defended - claimant rejected defence - orders drawn',
            claim: ordersClaim(),
            claimOverride: {},
            claimantAssertions: ['Send us more details before the hearing'],
            defendantAssertions: ['Send us more details before the hearing']
        },
        {
            status: 'Orders - defendant fully defended - claimant rejected defence - orders drawn - review requested by claimant',
            claim: ordersClaim(),
            claimOverride: {
                reviewOrder: {
                    reason: 'some reason',
                    requestedBy: madeBy_1.MadeBy.CLAIMANT.value,
                    requestedAt: momentFactory_1.MomentFactory.parse('2019-01-01')
                }
            },
            claimantAssertions: ['You’ve asked the court to review the order'],
            defendantAssertions: ['Read the claimant’s request for a judge to review the order.']
        },
        {
            status: 'Orders - defendant fully defended - claimant rejected defence - orders drawn - review requested by defendant',
            claim: ordersClaim(),
            claimOverride: {
                reviewOrder: {
                    reason: 'some reason',
                    requestedBy: madeBy_1.MadeBy.DEFENDANT.value,
                    requestedAt: momentFactory_1.MomentFactory.parse('2019-01-01')
                }
            },
            claimantAssertions: ['Read the defendant’s request for a judge to review the order.'],
            defendantAssertions: ['You’ve asked the court to review the order']
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
