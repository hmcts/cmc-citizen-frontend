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
const mediationOutcome_1 = require("claims/models/mediationOutcome");
const partAdmitData_1 = require("test/data/entity/partAdmitData");
const cookieName = config.get('session.cookieName');
function partAdmissionClaim() {
    return Object.assign(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { responseDeadline: momentFactory_1.MomentFactory.currentDate().add(1, 'days'), response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.basePartialAdmissionData), { amount: 30 }) }), fullDefenceData_1.respondedAt());
}
function mediationDQEnabledClaimDetails() {
    return [
        {
            status: 'Part admission - defendant part admits and rejects mediation DQs enabled - claimant rejects part admission',
            claim: partAdmissionClaim(),
            claimOverride: {
                features: ['admissions', 'directionsQuestionnaire'],
                response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.basePartialAdmissionData), { freeMediation: freeMediation_1.FreeMediationOption.NO }),
                claimantResponse: {
                    settleForAmount: 'no',
                    type: 'REJECTION',
                    freeMediation: freeMediation_1.FreeMediationOption.NO
                },
                claimantRespondedAt: momentFactory_1.MomentFactory.currentDate()
            },
            claimantAssertions: ['Wait for the court to review the case'],
            defendantAssertions: ['Wait for the court to review the case']
        },
        {
            status: 'Part admission - defendant part admits and accepts mediation DQs enabled - claimant rejects part admission with mediation',
            claim: partAdmissionClaim(),
            claimOverride: {
                features: ['admissions', 'directionsQuestionnaire'],
                response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.basePartialAdmissionData), { freeMediation: freeMediation_1.FreeMediationOption.YES }),
                claimantResponse: {
                    settleForAmount: 'no',
                    freeMediation: freeMediation_1.FreeMediationOption.YES,
                    type: 'REJECTION'
                },
                claimantRespondedAt: momentFactory_1.MomentFactory.currentDate()
            },
            claimantAssertions: ['We’ll contact you to try to arrange a mediation appointment'],
            defendantAssertions: ['We’ll contact you to try to arrange a mediation appointment']
        },
        {
            status: 'Part admission - defendant part admits and accepts mediation DQs enabled - claimant rejects part admission with mediation - mediation failed',
            claim: partAdmissionClaim(),
            claimOverride: {
                features: ['admissions', 'directionsQuestionnaire'],
                response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.basePartialAdmissionData), { freeMediation: freeMediation_1.FreeMediationOption.YES }),
                claimantResponse: {
                    settleForAmount: 'no',
                    freeMediation: freeMediation_1.FreeMediationOption.YES,
                    type: 'REJECTION'
                },
                claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(),
                mediationOutcome: mediationOutcome_1.MediationOutcome.FAILED
            },
            claimantAssertions: ['Mediation was unsuccessful'],
            defendantAssertions: ['Mediation was unsuccessful']
        },
        {
            status: 'Part admission - defendant part admits and accepts mediation DQs enabled - claimant rejects part admission with mediation - mediation success',
            claim: partAdmissionClaim(),
            claimOverride: {
                features: ['admissions', 'directionsQuestionnaire'],
                response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.basePartialAdmissionData), { freeMediation: freeMediation_1.FreeMediationOption.YES }),
                claimantResponse: {
                    settleForAmount: 'no',
                    freeMediation: freeMediation_1.FreeMediationOption.YES,
                    type: 'REJECTION'
                },
                claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(),
                mediationOutcome: mediationOutcome_1.MediationOutcome.SUCCEEDED
            },
            claimantAssertions: ['You both agreed a settlement through mediation'],
            defendantAssertions: ['You both agreed a settlement through mediation']
        }
    ];
}
function legacyClaimDetails() {
    return [
        {
            status: 'Partial admission - defendant responded pay immediately',
            claim: partAdmissionClaim(),
            claimOverride: {
                response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayImmediatelyData())
            },
            claimantAssertions: ['Respond to the defendant.'],
            defendantAssertions: ['You’ve admitted part of the claim.']
        },
        {
            status: 'Partial admission - defendant responded pay immediately - past payment deadline',
            claim: partAdmissionClaim(),
            claimOverride: {
                response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayImmediatelyData()),
                responseDeadline: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days')
            },
            claimantAssertions: ['Respond to the defendant.'],
            defendantAssertions: ['You’ve admitted part of the claim.']
        },
        {
            status: 'Partial admission - defendant responded pay by set date',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayBySetDateData) }, partAdmitData_1.settlementOfferBySetDate()),
            claimantAssertions: ['Respond to the defendant.'],
            defendantAssertions: ['You’ve admitted part of the claim.']
        },
        {
            status: 'Partial admission - defendant responded pay by set date - claimant rejects repayment plan and referred to judge',
            claim: partAdmissionClaim(),
            claimOverride: {
                response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayBySetDateData),
                claimantResponse: Object.assign({}, partAdmitData_1.claimantReferredToJudgeResponse())
            },
            claimantAssertions: ['Awaiting judge’s review.'],
            defendantAssertions: [partAdmissionClaim().claim.claimants[0].name + ' requested a County Court Judgment against you']
        },
        {
            status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayBySetDateData), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlan) }, partAdmitData_1.settlementOfferAcceptBySetDate()),
            claimantAssertions: ['You’ve signed a settlement agreement. The defendant can choose to sign it or not.'],
            defendantAssertions: [`${partAdmissionClaim().claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant past counter signature deadline',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlan) }, partAdmitData_1.settlementOfferAcceptBySetDate()),
            claimantAssertions: ['The defendant has not responded to your settlement agreement. You can request a County Court Judgment against them.'],
            defendantAssertions: [`${partAdmissionClaim().claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed agreement',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlan) }, partAdmitData_1.settledWithAgreementBySetDate()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed agreement - past payment deadline',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlan) }, partAdmitData_1.settledWithAgreementBySetDatePastPaymentDeadline()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant rejects settlement agreement',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlan) }, partAdmitData_1.defendantRejectedSettlementOfferAcceptBySetDate()),
            claimantAssertions: [`${partAdmissionClaim().claim.defendants[0].name} has rejected your settlement agreement. You can request a County Court Judgment against them.`],
            defendantAssertions: ['You rejected the settlement agreement.']
        },
        {
            status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayBySetDateData), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlanByDetermination()) }, partAdmitData_1.settlementOfferAcceptBySetDate()),
            claimantAssertions: ['You’ve signed a settlement agreement. The defendant can choose to sign it or not.'],
            defendantAssertions: [`${partAdmissionClaim().claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant past counter signature deadline',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlanByDetermination()) }, partAdmitData_1.settlementOfferAcceptBySetDate()),
            claimantAssertions: ['The defendant has not responded to your settlement agreement. You can request a County Court Judgment against them.'],
            defendantAssertions: [`${partAdmissionClaim().claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed agreement',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlanByDetermination()) }, partAdmitData_1.settledWithAgreementBySetDate()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed agreement - past payment deadline',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlanByDetermination()) }, partAdmitData_1.settledWithAgreementBySetDatePastPaymentDeadline()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant rejects settlement agreement',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlanByDetermination()) }, partAdmitData_1.defendantRejectedSettlementOfferAcceptBySetDate()),
            claimantAssertions: [`${partAdmissionClaim().claim.defendants[0].name} has rejected your settlement agreement. You can request a County Court Judgment against them.`],
            defendantAssertions: ['You rejected the settlement agreement.']
        },
        {
            status: 'Partial admission - defendant responded pay in instalments',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayByInstalmentsData) }, partAdmitData_1.settlementOfferByInstalments()),
            claimantAssertions: ['Respond to the defendant.'],
            defendantAssertions: ['You’ve admitted part of the claim.']
        },
        {
            status: 'Partial admission - defendant responded pay in instalments - claimant rejects court repayment plan and referred to judge',
            claim: partAdmissionClaim(),
            claimOverride: {
                response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayByInstalmentsData),
                claimantResponse: Object.assign({}, partAdmitData_1.claimantReferredToJudgeResponseForInstalments())
            },
            claimantAssertions: ['Awaiting judge’s review.'],
            defendantAssertions: [partAdmissionClaim().claim.claimants[0].name + ' requested a County Court Judgment against you']
        },
        {
            status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayByInstalmentsData), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlan) }, partAdmitData_1.settlementOfferAcceptInInstalment()),
            claimantAssertions: ['You’ve signed a settlement agreement. The defendant can choose to sign it or not.'],
            defendantAssertions: [`${partAdmissionClaim().claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant past counter signature deadline',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlan) }, partAdmitData_1.settlementOfferAcceptInInstalment()),
            claimantAssertions: ['The defendant has not responded to your settlement agreement. You can request a County Court Judgment against them.'],
            defendantAssertions: [`${partAdmissionClaim().claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlan) }, partAdmitData_1.settledWithAgreementInInstalments()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlan) }, partAdmitData_1.settledWithAgreementInInstalmentsPastPaymentDeadline()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant rejects settlement agreement',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlan) }, partAdmitData_1.defendantRejectedSettlementOfferAcceptInInstalments()),
            claimantAssertions: [`${partAdmissionClaim().claim.defendants[0].name} has rejected your settlement agreement. You can request a County Court Judgment against them.`],
            defendantAssertions: ['You rejected the settlement agreement.']
        },
        {
            status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayByInstalmentsData), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, partAdmitData_1.settlementOfferAcceptInInstalment()),
            claimantAssertions: ['You’ve signed a settlement agreement. The defendant can choose to sign it or not.'],
            defendantAssertions: [`${partAdmissionClaim().claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant past counter signature deadline',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, partAdmitData_1.settlementOfferAcceptInInstalment()),
            claimantAssertions: ['The defendant has not responded to your settlement agreement. You can request a County Court Judgment against them.'],
            defendantAssertions: [`${partAdmissionClaim().claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by determination  and offered a settlement agreement - defendant signed settlement agreement',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, partAdmitData_1.settledWithAgreementInInstalments()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, partAdmitData_1.settledWithAgreementInInstalmentsPastPaymentDeadline()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant rejects settlement agreement',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, partAdmissionClaim().response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, partAdmitData_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, partAdmitData_1.defendantRejectedSettlementOfferAcceptInInstalments()),
            claimantAssertions: [`${partAdmissionClaim().claim.defendants[0].name} has rejected your settlement agreement. You can request a County Court Judgment against them.`],
            defendantAssertions: ['You rejected the settlement agreement.']
        },
        {
            status: 'Partial admission - defendant states paid, less than claim amount accepted',
            claim: partAdmissionClaim(),
            claimOverride: {
                response: Object.assign({}, partAdmitData_1.partialAdmissionAlreadyPaidData),
                claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days')
            },
            claimantAssertions: ['Respond to the defendant.'],
            defendantAssertions: ['We’ve emailed John Smith telling them when and how you said you paid the claim.']
        },
        {
            status: 'Part admission - defendant part admits and rejects mediation DQs not enabled - claimant rejects part admission',
            claim: partAdmissionClaim(),
            claimOverride: Object.assign({ response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.basePartialAdmissionData), { freeMediation: freeMediation_1.FreeMediationOption.NO }), claimantResponse: {
                    settleForAmount: 'no',
                    type: 'REJECTION',
                    freeMediation: freeMediation_1.FreeMediationOption.NO
                }, claimantRespondedAt: momentFactory_1.MomentFactory.currentDate() }, fullDefenceData_1.directionsQuestionnaireDeadline()),
            claimantAssertions: ['You’ve rejected the defendant’s admission.'],
            defendantAssertions: [partAdmissionClaim().claim.claimants[0].name + ' rejected your admission of ']
        },
        {
            status: 'Part admission - defendant part admits and accepts mediation DQs not enabled - claimant rejects part admission with mediation',
            claim: partAdmissionClaim(),
            claimOverride: {
                features: ['admissions'],
                response: Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.basePartialAdmissionData), { freeMediation: freeMediation_1.FreeMediationOption.YES }),
                claimantResponse: {
                    settleForAmount: 'no',
                    freeMediation: freeMediation_1.FreeMediationOption.YES,
                    type: 'REJECTION'
                },
                claimantRespondedAt: momentFactory_1.MomentFactory.currentDate()
            },
            claimantAssertions: ['We’ll contact you to try to arrange a mediation appointment'],
            defendantAssertions: ['We’ll contact you to try to arrange a mediation appointment']
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
                    mediationDQEnabledClaimDetails().forEach(data => {
                        it(`should render dashboard: ${data.status}`, async () => {
                            draftStoreServiceMock.resolveFindNoDraftFound();
                            claimStoreServiceMock.resolveRetrieveByClaimantId(data.claim, data.claimOverride);
                            await request(app_1.app)
                                .get(paths_1.Paths.dashboardPage.uri)
                                .set('Cookie', `${cookieName}=ABC`)
                                .expect(res => chai_1.expect(res).to.be.successful.withText(...data.claimantAssertions));
                        });
                    });
                    legacyClaimDetails().forEach(data => {
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
                    mediationDQEnabledClaimDetails().forEach(data => {
                        it(`should render dashboard: ${data.status}`, async () => {
                            draftStoreServiceMock.resolveFindNoDraftFound();
                            claimStoreServiceMock.resolveRetrieveByDefendantId(data.claim.referenceNumber, '1', data.claim, data.claimOverride);
                            await request(app_1.app)
                                .get(paths_1.Paths.dashboardPage.uri)
                                .set('Cookie', `${cookieName}=ABC`)
                                .expect(res => chai_1.expect(res).to.be.successful.withText(...data.defendantAssertions));
                        });
                    });
                    legacyClaimDetails().forEach(data => {
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
