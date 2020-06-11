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
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const authorization_check_1 = require("test/features/dashboard/routes/checks/authorization-check");
const momentFactory_1 = require("shared/momentFactory");
const cookieName = config.get('session.cookieName');
const testData = [
    {
        status: 'Claim issued',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            responseDeadline: momentFactory_1.MomentFactory.currentDate().add(1, 'days')
        },
        claimantAssertions: ['000MC050', 'Wait for the defendant to respond',
            'They can request an extra 14 days if they need it.'
        ],
        defendantAssertions: ['000MC050', 'You haven’t responded to this claim',
            'You need to respond before 4pm on ',
            'Respond to claim'
        ]
    },
    {
        status: 'Requested more time',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            moreTimeRequested: true,
            responseDeadline: '2099-08-08'
        },
        claimantAssertions: ['000MC050', 'The defendant has requested more time to respond',
            'John Doe has requested an extra 14 days to respond. They now have until 4pm on 8 August 2099 to respond.',
            'You can request a County Court Judgment against them if they don’t respond by the deadline.'
        ],
        defendantAssertions: ['000MC050', 'More time requested',
            'You need to respond before 4pm on 8 August 2099',
            'Respond to claim'
        ]
    }
];
const claimPagePath = paths_1.Paths.claimantPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimIssueObj.externalId });
const defendantPagePath = paths_1.Paths.defendantPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimIssueObj.externalId });
describe('Dashboard page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', claimPagePath);
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', defendantPagePath);
        context('when user authorised', () => {
            context('Claim Status', () => {
                context('as a claimant', () => {
                    beforeEach(() => {
                        idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
                    });
                    testData.forEach(data => {
                        it(`should render claim status: ${data.status}`, async () => {
                            claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride);
                            await request(app_1.app)
                                .get(claimPagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .expect(res => chai_1.expect(res).to.be.successful.withText(...data.claimantAssertions));
                        });
                    });
                });
                context('as a defendant', () => {
                    beforeEach(() => {
                        idamServiceMock.resolveRetrieveUserFor('123', 'citizen');
                    });
                    testData.forEach(data => {
                        it(`should render dashboard: ${data.status}`, async () => {
                            claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride);
                            await request(app_1.app)
                                .get(defendantPagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .expect(res => chai_1.expect(res).to.be.successful.withText(...data.defendantAssertions));
                        });
                    });
                });
            });
        });
    });
});
