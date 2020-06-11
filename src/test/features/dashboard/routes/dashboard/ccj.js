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
const paymentOption_1 = require("claims/models/paymentOption");
const courtDeterminationData_1 = require("test/data/entity/courtDeterminationData");
const ccjData_1 = require("test/data/entity/ccjData");
const cookieName = config.get('session.cookieName');
const fullAdmissionClaim = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { responseDeadline: momentFactory_1.MomentFactory.currentDate().add(1, 'days'), response: Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseFullAdmissionData) });
const testData = [
    {
        status: 'CCJ - claim submitted and defendant has not responded and is past deadline',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            responseDeadline: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days')
        },
        claimantAssertions: ['000MC050',
            'The defendant has not responded to your claim. You can request a County Court Judgment against them.'],
        defendantAssertions: ['000MC050',
            'You haven’t responded to the claim.',
            'John Smith can now ask for a County Court Judgment (CCJ) against you.',
            'You can still respond to this claim before they ask for a CCJ.']
    },
    {
        status: 'CCJ - full admission, pay immediately, past deadline - claimant requests CCJ',
        claim: fullAdmissionClaim,
        claimOverride: {
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), { paymentIntention: {
                    paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY,
                    paymentDate: momentFactory_1.MomentFactory.currentDate().subtract(5, 'days')
                } }),
            countyCourtJudgment: { 'ccjType': 'DEFAULT', 'paidAmount': 10, 'payBySetDate': '2022-01-01', 'paymentOption': 'BY_SPECIFIED_DATE', 'defendantDateOfBirth': '2000-01-01' },
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            responseDeadline: momentFactory_1.MomentFactory.currentDate().subtract(16, 'days')
        },
        claimantAssertions: ['000MC000', 'Wait for the judgment to be confirmed'],
        defendantAssertions: ['000MC000', 'The claimant has requested a County Court Judgment (CCJ) against you on']
    },
    {
        status: 'CCJ - full admission, pay by set date, claimant accepts the repayment plan and request a CCJ',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'CCJ' },
            countyCourtJudgment: { 'ccjType': 'DETERMINATION', 'paidAmount': 10, 'payBySetDate': '2022-01-01', 'paymentOption': 'BY_SPECIFIED_DATE', 'defendantDateOfBirth': '2000-01-01' },
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
    },
    {
        status: 'CCJ - part admission, pay by set date, claimant accepts the repayment plan and request a CCJ',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            claimantResponse: { type: 'ACCEPTATION', formaliseOption: 'CCJ' },
            countyCourtJudgment: { ccjType: 'DETERMINATION', paidAmount: 10, payBySetDate: '2022-01-01', paymentOption: 'BY_SPECIFIED_DATE', defendantDateOfBirth: '2000-01-01' },
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign({}, responseData_1.partialAdmissionWithSoMPaymentBySetDateData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
    },
    {
        status: 'CCJ - full admission, pay by set date, claimant accept the repayment plan with settlement agreement, defendant rejects the settlement agreement',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            settlement: claimStoreServiceMock.partySettlementWithSetDateAndRejection,
            claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'SETTLEMENT' },
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData)
        },
        claimantAssertions: ['000MC050', 'John Doe has rejected your settlement agreement. You can request a County Court Judgment against them'],
        defendantAssertions: ['000MC050', 'You rejected the settlement agreement']
    },
    {
        status: 'CCJ - part admission, pay by set date, claimant accept the repayment plan with settlement agreement, defendant rejects the settlement agreement',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            settlement: claimStoreServiceMock.partySettlementWithSetDateAndRejection,
            claimantResponse: { type: 'ACCEPTATION', formaliseOption: 'SETTLEMENT' },
            response: Object.assign({}, responseData_1.partialAdmissionWithSoMPaymentBySetDateData)
        },
        claimantAssertions: ['000MC050', 'John Doe has rejected your settlement agreement. You can request a County Court Judgment against them'],
        defendantAssertions: ['000MC050', 'You rejected the settlement agreement']
    },
    {
        status: 'CCJ - full admission, pay by set date, rejected the defendants repayment plan and accepted alternative plan suggested by the court then requests a CCJ.',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'CCJ',
                courtDetermination: Object.assign({}, courtDeterminationData_1.courtDeterminationChoseDefendantData)
            },
            countyCourtJudgment: Object.assign({}, ccjData_1.ccjDeterminationByInstalment),
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
    },
    {
        status: 'CCJ - part admission, pay by set date, rejected the defendants repayment plan and accepted alternative plan suggested by the court then requests a CCJ.',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'CCJ',
                courtDetermination: Object.assign({}, courtDeterminationData_1.courtDeterminationChoseDefendantData)
            },
            countyCourtJudgment: Object.assign({}, ccjData_1.ccjDeterminationByInstalment),
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign({}, responseData_1.partialAdmissionWithSoMPaymentBySetDateData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
    },
    {
        status: 'CCJ - full admission, pay by set date, rejected the defendants repayment plan and claimants suggested repayment plan accepted by the court then requests a CCJ.',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'CCJ',
                courtDetermination: Object.assign({}, courtDeterminationData_1.courtDeterminationChoseClaimantData),
                claimantPaymentIntention: {
                    paymentDate: '2020-01-01',
                    paymentOption: 'BY_SPECIFIED_DATE'
                }
            },
            countyCourtJudgment: Object.assign({}, ccjData_1.ccjDeterminationBySpecifiedDate()),
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
    },
    {
        status: 'CCJ - part admission, pay by set date, rejected the defendants repayment plan and claimants suggested repayment plan accepted by the court then requests a CCJ.',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'CCJ',
                courtDetermination: Object.assign({}, courtDeterminationData_1.courtDeterminationChoseClaimantData),
                claimantPaymentIntention: {
                    paymentDate: '2020-01-01',
                    paymentOption: 'BY_SPECIFIED_DATE'
                }
            },
            countyCourtJudgment: Object.assign({}, ccjData_1.ccjDeterminationBySpecifiedDate()),
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign({}, responseData_1.partialAdmissionWithSoMPaymentBySetDateData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
    },
    {
        status: 'CCJ - full admission, pay by set date, rejected the defendants repayment plan and rejected alternative plan suggested by the court.',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'REFER_TO_JUDGE' },
            settlementReachedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData)
        },
        claimantAssertions: ['000MC050', 'Awaiting judge’s review'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
    },
    {
        status: 'CCJ - part admission, pay by set date, rejected the defendants repayment plan and rejected alternative plan suggested by the court.',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'REFER_TO_JUDGE' },
            settlementReachedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign({}, responseData_1.partialAdmissionWithSoMPaymentBySetDateData)
        },
        claimantAssertions: ['000MC050', 'Awaiting judge’s review'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
    },
    {
        status: 'CCJ - full admission, pay by repayment plan, claimant accepts the repayment plan and requests a CCJ',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'CCJ' },
            countyCourtJudgment: { 'ccjType': 'ADMISSIONS', 'paidAmount': 10, 'payBySetDate': '2022-01-01', 'paymentOption': 'BY_SPECIFIED_DATE', 'defendantDateOfBirth': '2000-01-01' },
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
    },
    {
        status: 'CCJ - full admission, pay by repayment plan, rejected the defendants repayment plan and rejected alternative plan suggested by the court.',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'REFER_TO_JUDGE' },
            settlementReachedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData)
        },
        claimantAssertions: ['000MC050', 'Awaiting judge’s review'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you']
    },
    {
        status: 'CCJ - full admission, pay by repayment plan, claimant accepts the repayment plan and offers a settlement agreement, defendant rejects the settlement agreement',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
            claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'SETTLEMENT' },
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData)
        },
        claimantAssertions: ['000MC050', 'John Doe has rejected your settlement agreement. You can request a County Court Judgment against them'],
        defendantAssertions: ['000MC050', 'You rejected the settlement agreement']
    },
    {
        status: 'CCJ - full admission, pay by repayment plan, claimant accepts the repayment plan and offers a settlement agreement, defendant accepts the settlement agreement, claimant requests CCJ after set date',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            settlement: claimStoreServiceMock.partySettlementWithSetDateAndAcceptation,
            claimantResponse: { type: 'ACCEPTATION', formaliseOption: 'SETTLEMENT' },
            countyCourtJudgment: Object.assign({}, ccjData_1.ccjDeterminationBySpecifiedDate()),
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you.']
    },
    {
        status: 'CCJ - full admission, pay by repayment plan, claimant rejects the repayment plan, their offer is accepted by the court and offers a settlement agreement, defendant accepts the settlement agreement, claimant requests CCJ after set date',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: Object.assign(Object.assign({}, claimStoreServiceMock.settlementWithSetDateAndAcceptation), { settlementReachedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'), claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'CCJ',
                courtDetermination: Object.assign({}, courtDeterminationData_1.courtDeterminationChoseClaimantData),
                claimantPaymentIntention: {
                    paymentDate: '2020-01-01',
                    paymentOption: 'BY_SPECIFIED_DATE'
                }
            }, countyCourtJudgment: Object.assign({}, ccjData_1.ccjAdmissionBySpecifiedDate()), countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'), response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData) }),
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you.']
    },
    {
        status: 'CCJ - full admission, pay by repayment plan, claimant rejects the repayment plan, accepts the courts offer and offers a settlement agreement, defendant rejects the settlement agreement. Claimant then requests a CCJ',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'SETTLEMENT',
                courtDetermination: Object.assign({}, courtDeterminationData_1.courtDeterminationChoseClaimantData),
                claimantPaymentIntention: {
                    paymentDate: '2020-01-01',
                    paymentOption: 'BY_SPECIFIED_DATE'
                }
            },
            countyCourtJudgment: Object.assign({}, ccjData_1.ccjAdmissionBySpecifiedDate()),
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you.']
    },
    {
        status: 'CCJ - full admission, pay by repayment plan, claimant accepts the repayment plan and offers a settlement agreement, defendant rejects the settlement agreement. Claimant then requests a CCJ',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'SETTLEMENT',
                courtDetermination: Object.assign({}, courtDeterminationData_1.courtDeterminationChoseCourtData),
                claimantPaymentIntention: {
                    paymentDate: '2020-01-01',
                    paymentOption: 'BY_SPECIFIED_DATE'
                }
            },
            countyCourtJudgment: Object.assign({}, ccjData_1.ccjAdmissionBySpecifiedDate()),
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you.']
    },
    {
        status: 'CCJ - full admission, pay by repayment plan, claimant rejects the repayment plan, the court accepts their plan and they offer a settlement agreement, defendant rejects the settlement agreement. Claimant then requests a CCJ',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'SETTLEMENT',
                courtDetermination: Object.assign({}, courtDeterminationData_1.courtDeterminationChoseClaimantData),
                claimantPaymentIntention: {
                    paymentDate: '2020-01-01',
                    paymentOption: 'BY_SPECIFIED_DATE'
                }
            },
            countyCourtJudgment: Object.assign({}, ccjData_1.ccjAdmissionBySpecifiedDate()),
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you.']
    },
    {
        status: 'CCJ - part admission, pay by repayment plan, claimant rejects the repayment plan, the courts accepts their plan and offers a settlement agreement, defendant rejects the settlement agreement and claimant requests a CCJ',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'SETTLEMENT',
                courtDetermination: Object.assign({}, courtDeterminationData_1.courtDeterminationChoseClaimantData),
                claimantPaymentIntention: {
                    paymentDate: '2020-01-01',
                    paymentOption: 'BY_SPECIFIED_DATE'
                }
            },
            countyCourtJudgment: Object.assign({}, ccjData_1.ccjAdmissionBySpecifiedDate()),
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign({}, responseData_1.partialAdmissionWithSoMPaymentBySetDateData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you.']
    },
    {
        status: 'CCJ - part admission, pay by repayment plan, claimant rejects the repayment plan, accepts the courts offer and offers a settlement agreement, defendant rejects the settlement agreement. Claimant then requests a CCJ',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'SETTLEMENT',
                courtDetermination: Object.assign({}, courtDeterminationData_1.courtDeterminationChoseCourtData),
                claimantPaymentIntention: {
                    paymentDate: '2020-01-01',
                    paymentOption: 'BY_SPECIFIED_DATE'
                }
            },
            countyCourtJudgment: Object.assign({}, ccjData_1.ccjAdmissionBySpecifiedDate()),
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign({}, responseData_1.partialAdmissionWithSoMPaymentBySetDateData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you.']
    },
    {
        status: 'CCJ - part admission, pay by repayment plan, claimant accepts the repayment plan and they offer a settlement agreement, defendant rejects the settlement agreement. Claimant then requests a CCJ',
        claim: claimStoreServiceMock.sampleClaimIssueObj,
        claimOverride: {
            settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'SETTLEMENT'
            },
            countyCourtJudgment: Object.assign({}, ccjData_1.ccjAdmissionBySpecifiedDate()),
            countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            response: Object.assign({}, responseData_1.partialAdmissionWithSoMPaymentBySetDateData)
        },
        claimantAssertions: ['000MC050', 'You requested a County Court Judgment against John Doe'],
        defendantAssertions: ['000MC050', 'John Smith requested a County Court Judgment against you.']
    }
];
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
                    testData.forEach(data => {
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
                    testData.forEach(data => {
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
