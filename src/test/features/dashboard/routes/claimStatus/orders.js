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
                    directionActionedDate: '2019-09-20'
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
            createdOn: momentFactory_1.MomentFactory.currentDate().subtract(1, 'day')
        } });
}
function testData() {
    return [
        {
            status: 'Orders - defendant fully defended - claimant rejected defence - orders drawn',
            claim: ordersClaim(),
            claimOverride: {},
            claimantAssertions: [
                'Send us more details before the hearing',
                'The court has ordered you to send us more details.',
                'to find out the details you need to send.',
                'Make sure you include the claim number',
                'Deadline for posting the details',
                'You must make sure the court and the defendant receive a letter with the details before',
                'Where to post the details',
                'The defendant’s address is:',
                'If you don’t send us more details',
                'The court may cancel your claim.',
                'If you have a problem with the order',
                'ask the court to review it',
                'A judge will consider your request. You should give details of how you want the order changed and the reasons for your request.'
            ],
            defendantAssertions: [
                'Send us more details before the hearing',
                'The court has ordered you to send us more details.',
                'to find out the details you need to send.',
                'Make sure you include the claim number',
                'Deadline for posting the details',
                'You must make sure the court and the claimant receive a letter with the details before',
                'Where to post the details',
                'The claimant’s address is:',
                'If you don’t send us more details',
                'The court may cancel your defence and the claimant can request a County Court Judgment (CCJ) against you.',
                'If you have a problem with the order',
                'ask the court to review it',
                'A judge will consider your request. You should give details of how you want the order changed and the reasons for your request.'
            ]
        }
    ];
}
function testDatWithExtraWorkingDayCall() {
    return [
        {
            status: 'Orders - defendant fully defended - claimant rejected defence - orders drawn - claimant requests review',
            claim: ordersClaim(),
            claimOverride: {
                reviewOrder: {
                    reason: 'some reason',
                    requestedBy: madeBy_1.MadeBy.CLAIMANT.value,
                    requestedAt: momentFactory_1.MomentFactory.parse('2019-01-01')
                }
            },
            claimantAssertions: [
                'You’ve asked the court to review the order',
                'We’ll tell John Doe. They can comment until',
                'A judge will then review the order and any comments. We’ll contact you by post to tell you what to do next.',
                'Continue doing everything the current order tells you to do unless we tell you a judge has made a new one.',
                'Send us more details before the hearing',
                'The court has ordered you to send us more details.',
                'to find out the details you need to send.',
                'Make sure you include the claim number',
                'Deadline for posting the details',
                'You must make sure the court and the defendant receive a letter with the details before',
                'Where to post the details',
                'The defendant’s address is:',
                'If you don’t send us more details',
                'The court may cancel your claim.'
            ],
            defendantAssertions: [
                'Read John Smith’s request',
                'John Smith has asked the court to change the order.',
                'A judge will review their request and any comments you’ve sent. We’ll contact you by post if the judge makes a new order.',
                'Continue doing everything the current order tells you to do unless we tell you a judge has made a new one.',
                'Comment on John Smith’s request',
                'If you want to comment on the request, email your comments to the court and to John Smith before 4pm on',
                'Include the claim number (000MC000) in the emails.',
                'The court’s email address is:',
                'John Smith’s email address is:',
                'Send us more details before the hearing',
                'The court has ordered you to send us more details.',
                'to find out the details you need to send.',
                'Make sure you include the claim number',
                'Deadline for posting the details',
                'You must make sure the court and the claimant receive a letter with the details before',
                'Where to post the details',
                'The claimant’s address is:',
                'If you don’t send us more details',
                'The court may cancel your defence and the claimant can request a County Court Judgment (CCJ) against you.'
            ]
        },
        {
            status: 'Orders - defendant fully defended - claimant rejected defence - orders drawn - defendant requests review',
            claim: ordersClaim(),
            claimOverride: {
                reviewOrder: {
                    reason: 'some reason',
                    requestedBy: madeBy_1.MadeBy.DEFENDANT.value,
                    requestedAt: momentFactory_1.MomentFactory.parse('2019-01-01')
                }
            },
            claimantAssertions: [
                'Read John Doe’s request',
                'John Doe has asked the court to change the order.',
                'A judge will review their request and any comments you’ve sent. We’ll contact you by post if the judge makes a new order.',
                'Continue doing everything the current order tells you to do unless we tell you a judge has made a new one.',
                'Comment on John Doe’s request',
                'If you want to comment on the request, email your comments to the court and to John Doe before 4pm on',
                'Include the claim number (000MC000) in the emails.',
                'The court’s email address is:',
                'John Doe’s email address is:',
                'Send us more details before the hearing',
                'The court has ordered you to send us more details.',
                'to find out the details you need to send.',
                'Make sure you include the claim number',
                'Deadline for posting the details',
                'You must make sure the court and the defendant receive a letter with the details before',
                'Where to post the details',
                'The defendant’s address is:',
                'If you don’t send us more details',
                'The court may cancel your claim.'
            ],
            defendantAssertions: [
                'You’ve asked the court to review the order',
                'We’ll tell John Smith. They can comment until',
                'A judge will then review the order and any comments. We’ll contact you by post to tell you what to do next.',
                'Continue doing everything the current order tells you to do unless we tell you a judge has made a new one.',
                'Send us more details before the hearing',
                'The court has ordered you to send us more details.',
                'to find out the details you need to send.',
                'Make sure you include the claim number',
                'Deadline for posting the details',
                'You must make sure the court and the claimant receive a letter with the details before',
                'Where to post the details',
                'The claimant’s address is:',
                'If you don’t send us more details',
                'The court may cancel your defence and the claimant can request a County Court Judgment (CCJ) against you.'
            ]
        }
    ];
}
const claimPagePath = paths_1.Paths.claimantPage.evaluateUri({ externalId: ordersClaim().externalId });
const defendantPagePath = paths_1.Paths.defendantPage.evaluateUri({ externalId: ordersClaim().externalId });
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
                        claimStoreServiceMock.mockNextWorkingDay(momentFactory_1.MomentFactory.currentDate().add(11, 'days'));
                    });
                    testData().forEach(data => {
                        it(`should render claim status: ${data.status}`, async () => {
                            claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride);
                            claimStoreServiceMock.mockNextWorkingDay(momentFactory_1.MomentFactory.currentDate().add(11, 'days'));
                            await request(app_1.app)
                                .get(claimPagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .expect(res => chai_1.expect(res).to.be.successful.withText(...data.claimantAssertions));
                        });
                    });
                    testDatWithExtraWorkingDayCall().forEach(data => {
                        it(`should render claim status: ${data.status}`, async () => {
                            claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride);
                            claimStoreServiceMock.mockNextWorkingDay(momentFactory_1.MomentFactory.currentDate().add(11, 'days'));
                            claimStoreServiceMock.mockNextWorkingDay(momentFactory_1.MomentFactory.currentDate().add(11, 'days'));
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
                        claimStoreServiceMock.mockNextWorkingDay(momentFactory_1.MomentFactory.currentDate().add(11, 'days'));
                    });
                    testData().forEach(data => {
                        it(`should render dashboard: ${data.status}`, async () => {
                            claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride);
                            await request(app_1.app)
                                .get(defendantPagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .expect(res => chai_1.expect(res).to.be.successful.withText(...data.defendantAssertions));
                        });
                    });
                    testDatWithExtraWorkingDayCall().forEach(data => {
                        it(`should render dashboard: ${data.status}`, async () => {
                            claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride);
                            claimStoreServiceMock.mockNextWorkingDay(momentFactory_1.MomentFactory.currentDate().add(11, 'days'));
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
