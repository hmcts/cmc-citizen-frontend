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
const freeMediation_1 = require("forms/models/freeMediation");
const responseData_1 = require("test/data/entity/responseData");
const fullDefenceData_1 = require("test/data/entity/fullDefenceData");
const defenceType_1 = require("claims/models/response/defenceType");
const mediationOutcome_1 = require("claims/models/mediationOutcome");
const yesNoOption_1 = require("models/yesNoOption");
const cookieName = config.get('session.cookieName');
function fullDefenceClaim() {
    return Object.assign(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { responseDeadline: momentFactory_1.MomentFactory.currentDate().add(1, 'days'), response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData), { amount: 30 }) }), fullDefenceData_1.respondedAt());
}
function testData() {
    return [
        {
            status: 'Full defence - defendant paid what he believe',
            claim: fullDefenceClaim(),
            claimOverride: {
                response: Object.assign({}, responseData_1.defenceWithAmountClaimedAlreadyPaidData)
            },
            claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' believes that they’ve paid the claim in full.'],
            defendantAssertions: ['We’ve emailed ' + fullDefenceClaim().claim.claimants[0].name + ' telling them when and how you said you paid the claim.']
        },
        {
            status: 'Full defence - defendant paid what he believe - claimant does not proceed in time',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign({ response: Object.assign({}, responseData_1.defenceWithAmountClaimedAlreadyPaidData) }, fullDefenceData_1.intentionToProceedDeadline()),
            claimantAssertions: ['This claim has ended'],
            defendantAssertions: ['This claim has ended']
        },
        {
            status: 'Full defence - defendant paid what he believe - claimant rejected defendant response',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign({}, responseData_1.defenceWithAmountClaimedAlreadyPaidData) }, fullDefenceData_1.claimantRejectAlreadyPaid()), fullDefenceData_1.directionsQuestionnaireDeadline()),
            claimantAssertions: ['You’ve rejected the defendant’s admission.'],
            defendantAssertions: [fullDefenceClaim().claim.claimants[0].name + ' rejected your admission of £100']
        },
        {
            status: 'Full defence - defendant dispute all of the claim and accepts mediation',
            claim: fullDefenceClaim(),
            claimOverride: {
                response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData), { freeMediation: freeMediation_1.FreeMediationOption.YES })
            },
            claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected the claim. They’ve suggested a mediation session to help resolve this dispute.'],
            defendantAssertions: ['You’ve rejected the claim and suggested mediation. We’ll ask the claimant if they agree to take part in mediation.']
        },
        {
            status: 'Full defence - defendant sent paper response',
            claim: fullDefenceClaim(),
            claimOverride: {
                response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData), { freeMediation: freeMediation_1.FreeMediationOption.YES }),
                paperResponse: yesNoOption_1.YesNoOption.YES.option
            },
            claimantAssertions: ['The claim will continue by post'],
            defendantAssertions: ['The claim will continue by post']
        },
        {
            status: 'Full defence - defendant dispute all of the claim and reject mediation',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData) }, fullDefenceData_1.directionsQuestionnaireDeadline()),
            claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected your claim.'],
            defendantAssertions: ['You’ve rejected the claim.']
        },
        {
            status: 'Full defence - defendant dispute all of the claim and rejects mediation - claimant does not do intention to proceed',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign({}, responseData_1.defenceWithDisputeData) }, fullDefenceData_1.directionsQuestionnaireDeadline()), fullDefenceData_1.intentionToProceedDeadline()),
            claimantAssertions: ['This claim has ended'],
            defendantAssertions: ['This claim has ended']
        },
        {
            status: 'Full defence - defendant dispute all of the claim and accepts mediation - defendant offers settlement to settle out of court',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData), { freeMediation: freeMediation_1.FreeMediationOption.YES }) }, fullDefenceData_1.directionsQuestionnaireDeadline()), fullDefenceData_1.settlementOffer()),
            claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected the claim. They’ve suggested a mediation session to help resolve this dispute.'],
            defendantAssertions: ['You’ve rejected the claim and suggested mediation. We’ll ask the claimant if they agree to take part in mediation.']
        },
        {
            status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData) }, fullDefenceData_1.directionsQuestionnaireDeadline()), fullDefenceData_1.settlementOffer()),
            claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected your claim.'],
            defendantAssertions: ['You’ve rejected the claim.']
        },
        {
            status: 'Full defence - defendant dispute all of the claim and accepts mediation - defendant offers settlement to settle out of court - claimant accepted offer',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData), { freeMediation: freeMediation_1.FreeMediationOption.YES }) }, fullDefenceData_1.directionsQuestionnaireDeadline()), fullDefenceData_1.settlementOfferAccept()),
            claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected the claim. They’ve suggested a mediation session to help resolve this dispute.'],
            defendantAssertions: ['You’ve rejected the claim and suggested mediation. We’ll ask the claimant if they agree to take part in mediation.']
        },
        {
            status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court - claimant accepted offer',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData) }, fullDefenceData_1.directionsQuestionnaireDeadline()), fullDefenceData_1.settlementOfferAccept()),
            claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected your claim.'],
            defendantAssertions: ['You’ve rejected the claim.']
        },
        {
            status: 'Full defence - defendant dispute all of the claim and accepts mediation - defendant offers settlement to settle out of court - claimant rejected offer',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData), { freeMediation: freeMediation_1.FreeMediationOption.YES }) }, fullDefenceData_1.directionsQuestionnaireDeadline()), fullDefenceData_1.settlementOfferReject()),
            claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected the claim. They’ve suggested a mediation session to help resolve this dispute.'],
            defendantAssertions: ['You’ve rejected the claim and suggested mediation. We’ll ask the claimant if they agree to take part in mediation.']
        },
        {
            status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court - claimant rejected offer',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData) }, fullDefenceData_1.directionsQuestionnaireDeadline()), fullDefenceData_1.settlementOfferReject()),
            claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected your claim.'],
            defendantAssertions: ['You’ve rejected the claim.']
        },
        {
            status: 'Full defence - defendant dispute all of the claim - defendant offers settlement to settle out of court - claim settled with agreement',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData) }, fullDefenceData_1.directionsQuestionnaireDeadline()), fullDefenceData_1.settledWithAgreement()),
            claimantAssertions: ['You’ve both signed a legal agreement. The claim is now settled.'],
            defendantAssertions: ['You’ve both signed a legal agreement. The claim is now settled.']
        },
        {
            status: 'Full defence - defendant disputes the claim - claimant rejected defendant response with mediation - no online DQ',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData), { freeMediation: freeMediation_1.FreeMediationOption.YES, defenceType: defenceType_1.DefenceType.DISPUTE }), claimantResponse: {
                    freeMediation: 'yes',
                    settleForAmount: 'no',
                    type: 'REJECTION'
                }, claimantRespondedAt: momentFactory_1.MomentFactory.currentDate() }, fullDefenceData_1.directionsQuestionnaireDeadline()),
            claimantAssertions: ['We will contact you to try to arrange a mediation appointment'],
            defendantAssertions: ['We will contact you to try to arrange a mediation appointment']
        },
        {
            status: 'Full defence - defendant disputes the claim - claimant rejected defendant response with mediation - mediation failed',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData), { freeMediation: freeMediation_1.FreeMediationOption.YES, defenceType: defenceType_1.DefenceType.DISPUTE }), claimantResponse: {
                    freeMediation: 'yes',
                    settleForAmount: 'no',
                    type: 'REJECTION'
                }, claimantRespondedAt: momentFactory_1.MomentFactory.currentDate() }, fullDefenceData_1.directionsQuestionnaireDeadline()), { mediationOutcome: mediationOutcome_1.MediationOutcome.FAILED }),
            claimantAssertions: ['Mediation was unsuccessful'],
            defendantAssertions: ['Mediation was unsuccessful']
        },
        {
            status: 'Full defence - defendant disputes the claim - claimant rejected defendant response with mediation - mediation success',
            claim: fullDefenceClaim(),
            claimOverride: Object.assign(Object.assign({ response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseDefenceData), { freeMediation: freeMediation_1.FreeMediationOption.YES, defenceType: defenceType_1.DefenceType.DISPUTE }), claimantResponse: {
                    freeMediation: 'yes',
                    settleForAmount: 'no',
                    type: 'REJECTION'
                }, claimantRespondedAt: momentFactory_1.MomentFactory.currentDate() }, fullDefenceData_1.directionsQuestionnaireDeadline()), { mediationOutcome: mediationOutcome_1.MediationOutcome.SUCCEEDED }),
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
