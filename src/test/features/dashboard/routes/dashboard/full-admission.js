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
const moment = require("moment");
const momentFactory_1 = require("shared/momentFactory");
const responseData_1 = require("test/data/entity/responseData");
const fullAdmission_1 = require("test/data/entity/fullAdmission");
const cookieName = config.get('session.cookieName');
const fullAdmissionClaim = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { responseDeadline: momentFactory_1.MomentFactory.currentDate().add(1, 'days'), response: Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseFullAdmissionData), claimantResponseAt: Object.assign({}, fullAdmission_1.claimantResponseAt()) });
function testData() {
    return [
        {
            status: 'Full admission - defendant responded pay immediately',
            claim: fullAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayImmediatelyData())
            },
            claimantAssertions: ['Wait for the defendant to pay you'],
            defendantAssertions: ['You’ve admitted all of the claim and said you’ll pay the full amount immediately.']
        },
        {
            status: 'Full admission - defendant responded pay immediately - past payment deadline',
            claim: fullAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayImmediatelyDatePastData())
            },
            claimantAssertions: ['Wait for the defendant to pay you'],
            defendantAssertions: ['You’ve admitted all of the claim and said you’ll pay the full amount immediately.']
        },
        {
            status: 'Full admission - defendant responded pay by set date',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData) }, fullAdmission_1.settlementOfferBySetDate()),
            claimantAssertions: ['The defendant has offered to pay by a set date. You can accept or reject their offer.'],
            defendantAssertions: [`You’ve admitted all of the claim and offered to pay the full amount by ${moment(responseData_1.basePayBySetDateData.paymentIntention.paymentDate).format('LL')}`]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant rejects repayment plan and referred to judge',
            claim: fullAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData),
                claimantResponse: Object.assign({}, fullAdmission_1.claimantReferredToJudgeResponse())
            },
            claimantAssertions: ['Awaiting judge’s review.'],
            defendantAssertions: [fullAdmissionClaim.claim.claimants[0].name + ' requested a County Court Judgment against you']
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settlementOfferAcceptBySetDate()),
            claimantAssertions: ['You’ve signed a settlement agreement. The defendant can choose to sign it or not.'],
            defendantAssertions: [`${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant past counter signature deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settlementOfferAcceptBySetDate()),
            claimantAssertions: ['The defendant has not responded to your settlement agreement. You can request a County Court Judgment against them.'],
            defendantAssertions: [`${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settledWithAgreementBySetDate()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed agreement - past payment deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settledWithAgreementBySetDatePastPaymentDeadline()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant rejects settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.defendantRejectedSettlementOfferAcceptBySetDate()),
            claimantAssertions: [`${fullAdmissionClaim.claim.defendants[0].name} has rejected your settlement agreement. You can request a County Court Judgment against them.`],
            defendantAssertions: ['You rejected the settlement agreement.']
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanByDetermination()) }, fullAdmission_1.settlementOfferAcceptBySetDate()),
            claimantAssertions: ['You’ve signed a settlement agreement. The defendant can choose to sign it or not.'],
            defendantAssertions: [`${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant past counter signature deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanByDetermination()) }, fullAdmission_1.settlementOfferAcceptBySetDate()),
            claimantAssertions: ['The defendant has not responded to your settlement agreement. You can request a County Court Judgment against them.'],
            defendantAssertions: [`${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanByDetermination()) }, fullAdmission_1.settledWithAgreementBySetDate()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed agreement - past payment deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanByDetermination()) }, fullAdmission_1.settledWithAgreementBySetDatePastPaymentDeadline()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant rejects settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanByDetermination()) }, fullAdmission_1.defendantRejectedSettlementOfferAcceptBySetDate()),
            claimantAssertions: [`${fullAdmissionClaim.claim.defendants[0].name} has rejected your settlement agreement. You can request a County Court Judgment against them.`],
            defendantAssertions: ['You rejected the settlement agreement.']
        },
        {
            status: 'Full admission - defendant responded pay in instalments',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData) }, fullAdmission_1.settlementOfferByInstalments()),
            claimantAssertions: ['The defendant has offered to pay in instalments. You can accept or reject their offer.'],
            defendantAssertions: ['You’ve admitted all of the claim and offered to pay the full amount in instalments.']
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant rejects court repayment plan and referred to judge',
            claim: fullAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData),
                claimantResponse: Object.assign({}, fullAdmission_1.claimantReferredToJudgeResponseForInstalments())
            },
            claimantAssertions: ['Awaiting judge’s review.'],
            defendantAssertions: [fullAdmissionClaim.claim.claimants[0].name + ' requested a County Court Judgment against you']
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settlementOfferAcceptInInstalment()),
            claimantAssertions: ['You’ve signed a settlement agreement. The defendant can choose to sign it or not.'],
            defendantAssertions: [`${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant past counter signature deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settlementOfferAcceptInInstalment()),
            claimantAssertions: ['The defendant has not responded to your settlement agreement. You can request a County Court Judgment against them.'],
            defendantAssertions: [`${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settledWithAgreementInInstalments()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settledWithAgreementInInstalmentsPastPaymentDeadline()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant rejects settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.defendantRejectedSettlementOfferAcceptInInstalments()),
            claimantAssertions: [`${fullAdmissionClaim.claim.defendants[0].name} has rejected your settlement agreement. You can request a County Court Judgment against them.`],
            defendantAssertions: ['You rejected the settlement agreement.']
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, fullAdmission_1.settlementOfferAcceptInInstalment()),
            claimantAssertions: ['You’ve signed a settlement agreement. The defendant can choose to sign it or not.'],
            defendantAssertions: [`${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant past counter signature deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, fullAdmission_1.settlementOfferAcceptInInstalment()),
            claimantAssertions: ['The defendant has not responded to your settlement agreement. You can request a County Court Judgment against them.'],
            defendantAssertions: [`${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement.`]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination  and offered a settlement agreement - defendant signed settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, fullAdmission_1.settledWithAgreementInInstalments()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, fullAdmission_1.settledWithAgreementInInstalmentsPastPaymentDeadline()),
            claimantAssertions: ['You’ve both signed a settlement agreement.'],
            defendantAssertions: ['You’ve both signed a settlement agreement.']
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant rejects settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, fullAdmission_1.defendantRejectedSettlementOfferAcceptInInstalments()),
            claimantAssertions: [`${fullAdmissionClaim.claim.defendants[0].name} has rejected your settlement agreement. You can request a County Court Judgment against them.`],
            defendantAssertions: ['You rejected the settlement agreement.']
        }
    ];
}
describe('Dashboard page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
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
