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
const mediationOutcome_1 = require("claims/models/mediationOutcome");
function statesPaidClaim() {
    return Object.assign(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { responseDeadline: momentFactory_1.MomentFactory.currentDate().add(1, 'days') }), fullDefenceData_1.respondedAt());
}
const cookieName = config.get('session.cookieName');
const claimPagePath = paths_1.Paths.claimantPage.evaluateUri({ externalId: statesPaidClaim().externalId });
const defendantPagePath = paths_1.Paths.defendantPage.evaluateUri({ externalId: statesPaidClaim().externalId });
function testData() {
    return [
        {
            status: 'States paid defence - defendant paid what he believed he owed - claimant rejects',
            claim: statesPaidClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign({}, responseData_1.partialAdmissionFromStatesPaidDefence) }, fullDefenceData_1.claimantRejectAlreadyPaid()), fullDefenceData_1.directionsQuestionnaireDeadline()),
            claimantAssertions: ['Wait for the court to review the case',
                'You’ve rejected John Doe’s response and said you want to take the case to court.',
                'The court will review the case. We’ll email you if we set a hearing date to tell you how to prepare.',
                'Download their response',
                'Tell us you’ve ended the claim'
            ],
            defendantAssertions: ['Wait for the court to review the case',
                'John Smith has rejected your admission of £100',
                'They said you didn’t pay them £100.',
                'You might have to go to a court hearing. We’ll contact you if we set a hearing date to tell you how to prepare.',
                'complete a directions questionnaire',
                'Download your response',
                'You must make sure we receive the form before 4pm on',
                'You also need to send a copy of the form to ' + statesPaidClaim().claim.claimants[0].name
            ]
        },
        {
            status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects',
            claim: statesPaidClaim(),
            claimOverride: Object.assign({ response: Object.assign({}, responseData_1.partialAdmissionFromStatesPaidWithMediationDefence) }, fullDefenceData_1.claimantRejectAlreadyPaidWithMediation()),
            claimantAssertions: ['We’ll contact you to try to arrange a mediation appointment',
                'You’ve rejected the defendant’s response.',
                'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
                'Find out how mediation works'
            ],
            defendantAssertions: ['We’ll contact you to try to arrange a mediation appointment',
                'John Smith has rejected your defence.',
                'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
                'Find out how mediation works'
            ]
        },
        {
            status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects - mediation failed',
            claim: statesPaidClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign(Object.assign({}, responseData_1.partialAdmissionFromStatesPaidWithMediationDefence), { directionsQuestionnaire: {
                        hearingLoop: 'NO',
                        selfWitness: 'NO',
                        disabledAccess: 'NO',
                        hearingLocation: 'Central London County Court',
                        hearingLocationOption: 'SUGGESTED_COURT'
                    } }) }, fullDefenceData_1.claimantRejectAlreadyPaidWithMediation()), { mediationOutcome: mediationOutcome_1.MediationOutcome.FAILED }),
            claimantAssertions: [
                'Mediation was unsuccessful',
                'You weren’t able to resolve your claim against ' + statesPaidClaim().claim.defendants[0].name + ' using mediation.'
            ],
            defendantAssertions: [
                'Mediation was unsuccessful',
                'You weren’t able to resolve ' + statesPaidClaim().claim.claimants[0].name + '’s claim against you using mediation.',
                'Download ' + statesPaidClaim().claim.claimants[0].name + '’s hearing requirements'
            ]
        },
        {
            status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects - DQs enabled',
            claim: statesPaidClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, responseData_1.partialAdmissionFromStatesPaidWithMediationDefence), { directionsQuestionnaire: {
                        hearingLoop: 'NO',
                        selfWitness: 'NO',
                        disabledAccess: 'NO',
                        hearingLocation: 'Central London County Court',
                        hearingLocationOption: 'SUGGESTED_COURT'
                    } }) }, fullDefenceData_1.claimantRejectAlreadyPaidWithMediation()),
            claimantAssertions: [
                'You’ve rejected the defendant’s response.',
                'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
                'Find out how mediation works'
            ],
            defendantAssertions: [
                statesPaidClaim().claim.claimants[0].name + ' has rejected your defence.',
                'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
                'Find out how mediation works',
                'They’ve also sent us their hearing requirements.',
                'Download their hearing requirements'
            ]
        },
        {
            status: 'States paid defence with mediation - defendant paid what he believed he owed without mediation - claimant rejects - DQEnabled',
            claim: statesPaidClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData), { directionsQuestionnaire: {
                        hearingLoop: 'NO',
                        selfWitness: 'NO',
                        disabledAccess: 'NO',
                        hearingLocation: 'Central London County Court',
                        hearingLocationOption: 'SUGGESTED_COURT'
                    } }) }, fullDefenceData_1.claimantRejectAlreadyPaid()),
            claimantAssertions: [
                'You’ve rejected ' + statesPaidClaim().claim.defendants[0].name + '’s response and said you want to take the case to court.',
                'The court will review the case. We’ll email you if we set a hearing date to tell you how to prepare.'
            ],
            defendantAssertions: [
                'They said you didn’t pay them',
                'You might have to go to a court hearing.',
                'We’ll contact you if we set a hearing date to tell you how to prepare.',
                'Download your response',
                'They’ve also sent us their hearing requirements',
                'Download their hearing requirements'
            ]
        },
        {
            status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects - mediation success',
            claim: statesPaidClaim(),
            claimOverride: Object.assign(Object.assign(Object.assign({ response: Object.assign({}, responseData_1.partialAdmissionFromStatesPaidWithMediationDefence) }, fullDefenceData_1.claimantRejectAlreadyPaidWithMediation()), fullDefenceData_1.directionsQuestionnaireDeadline()), { mediationOutcome: mediationOutcome_1.MediationOutcome.SUCCEEDED }),
            claimantAssertions: [
                'You settled the claim through mediation',
                'You made an agreement which means the claim is now ended and sets out the terms of how ' + statesPaidClaim().claim.defendants[0].name + ' must repay you.',
                'Download the agreement',
                '(PDF)'
            ],
            defendantAssertions: [
                'You settled the claim through mediation',
                'You made an agreement which means the claim is now ended and sets out the terms of how you must repay ' + statesPaidClaim().claim.claimants[0].name + '.',
                'Download the agreement',
                '(PDF)',
                'Contact ' + statesPaidClaim().claim.claimants[0].name,
                'if you need their payment details. Make sure you get receipts for any payments.'
            ]
        }
    ];
}
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
                    testData().forEach(data => {
                        it(`should render claim status: ${data.status}`, async () => {
                            claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride);
                            claimStoreServiceMock.mockNextWorkingDay(momentFactory_1.MomentFactory.parse('2019-07-01'));
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
                    testData().forEach(data => {
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
