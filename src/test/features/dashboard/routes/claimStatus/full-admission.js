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
const momentFactory_1 = require("shared/momentFactory");
const numberFormatter_1 = require("utils/numberFormatter");
const responseData_1 = require("test/data/entity/responseData");
const fullAdmission_1 = require("test/data/entity/fullAdmission");
const cookieName = config.get('session.cookieName');
const fullAdmissionClaim = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { responseDeadline: momentFactory_1.MomentFactory.currentDate().add(5, 'days'), response: Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseFullAdmissionData) });
function testData() {
    return [
        {
            status: 'Full admission - defendant responded pay immediately',
            claim: fullAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayImmediatelyData())
            },
            claimantAssertions: [
                'The defendant said they’ll pay you immediately',
                'They must make sure you have the money by',
                'Any cheques or transfers should be clear in your account.',
                'You need to tell us if you’ve settled the claim, for example because the defendant has paid you.',
                'You can settle for less than the full claim amount.',
                'If you haven’t been paid',
                `If the defendant has not paid you`,
                'request a County Court Judgment.'
            ],
            defendantAssertions: [
                'Your response to the claim',
                `You said you’ll pay ${fullAdmissionClaim.claim.claimants[0].name} £200 before 4pm on`,
                'If you pay by cheque or transfer the money must be clear in their account.',
                'If they don’t receive the money by then, they can request a County Court Judgment against you.',
                'you need their payment details. Make sure you get receipts for any payments.',
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay immediately - past payment deadline',
            claim: fullAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayImmediatelyDatePastData()),
                responseDeadline: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days')
            },
            claimantAssertions: [
                'The defendant said they’ll pay you immediately',
                'They must make sure you have the money by',
                'Any cheques or transfers should be clear in your account.',
                'You need to tell us if you’ve settled the claim, for example because the defendant has paid you.',
                'You can settle for less than the full claim amount.',
                'If you haven’t been paid',
                'If the defendant has not paid you, you can',
                'request a County Court Judgment'
            ],
            defendantAssertions: [
                'Your response to the claim',
                `You said you’ll pay ${fullAdmissionClaim.claim.claimants[0].name} £200 before 4pm on`,
                'If you pay by cheque or transfer the money must be clear in their account.',
                'If they don’t receive the money by then, they can request a County Court Judgment against you.',
                'you need their payment details. Make sure you get receipts for any payments.',
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay by set date',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData) }, fullAdmission_1.settlementOfferBySetDate()),
            claimantAssertions: [
                `The defendant has offered to pay by`,
                'View and respond to the offer',
                'If you’ve been paid',
                'Tell us you’ve settled'
            ],
            defendantAssertions: [
                'Your response to the claim',
                `You’ve offered to pay ${fullAdmissionClaim.claim.claimants[0].name} by`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant rejects repayment plan and referred to judge',
            claim: fullAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData),
                claimantResponse: Object.assign({}, fullAdmission_1.claimantReferredToJudgeResponse())
            },
            claimantAssertions: [
                'Wait for a judge to review the case',
                'You’ve rejected the defendant’s repayment plan and haven’t been able to agree to an alternative plan.',
                'A judge will review the case. We’ll contact you by post to tell you what to do next.',
                'Your online account won’t be updated - any further updates will be by post.'
            ],
            defendantAssertions: [
                'Wait for a judge to make a repayment plan',
                'A County Court Judgment (CCJ) has been issued against you.',
                `${fullAdmissionClaim.claim.claimants[0].name} rejected your repayment plan and requested a CCJ against you.`,
                'They also rejected a repayment plan determined by the court, based on the financial details you provided.',
                `When we’ve processed the request we’ll post a copy of the judgment to you and to ${fullAdmissionClaim.claim.claimants[0].name}.`,
                'A judge will make a repayment plan. We’ll contact you by post to tell you what to do next.',
                'Your online account won’t be updated - any further updates will be by post.',
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settlementOfferAcceptBySetDate()),
            claimantAssertions: [
                'You’ve signed a settlement agreement',
                `We’ve emailed ${fullAdmissionClaim.claim.defendants[0].name} the repayment plan and the settlement agreement for them to sign.`,
                'They must respond by',
                'We’ll email you when they respond.',
                'If you’ve been paid',
                'Tell us you’ve settled'
            ],
            defendantAssertions: [
                `${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement`,
                'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
                'View the repayment plan',
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant past counter signature deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settlementOfferAcceptBySetDate()),
            claimantAssertions: [
                'The defendant has not signed your settlement agreement',
                `${fullAdmissionClaim.claim.defendants[0].name} can still sign the settlement agreement until you request a CCJ.`,
                'Request a County Court Judgment',
                'If you’ve been paid',
                'Tell us you’ve settled'
            ],
            defendantAssertions: [
                `${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement`,
                'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
                'View the repayment plan',
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settledWithAgreementBySetDate()),
            claimantAssertions: [
                'You’ve both signed a settlement agreement',
                'The agreement says the defendant will pay you in full by',
                'Download the settlement agreement',
                'Tell us you’ve settled'
            ],
            defendantAssertions: [
                'You’ve both signed a settlement agreement',
                'Download the settlement agreement',
                `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settledWithAgreementBySetDatePastPaymentDeadline()),
            claimantAssertions: [
                'You’ve both signed a settlement agreement',
                'The agreement says the defendant will pay you in full by ',
                'Download the settlement agreement',
                'Tell us you’ve settled',
                'Request County Court Judgment',
                'request a County Court Judgment'
            ],
            defendantAssertions: [
                'You’ve both signed a settlement agreement',
                'Download the settlement agreement',
                `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant rejects settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.defendantRejectedSettlementOfferAcceptBySetDate()),
            claimantAssertions: [
                `The defendant has rejected your settlement agreement`,
                'Request a County Court Judgment (CCJ)'
            ],
            defendantAssertions: [
                'You rejected the settlement agreement',
                `${fullAdmissionClaim.claim.claimants[0].name} can request a County Court Judgment (CCJ) against you.`,
                `If ${fullAdmissionClaim.claim.claimants[0].name} requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanByDetermination()) }, fullAdmission_1.settlementOfferAcceptBySetDate()),
            claimantAssertions: [
                'You’ve signed a settlement agreement',
                `We’ve emailed ${fullAdmissionClaim.claim.defendants[0].name} the repayment plan and the settlement agreement for them to sign.`,
                'They must respond by ',
                'We’ll email you when they respond.'
            ],
            defendantAssertions: [
                `${fullAdmissionClaim.claim.claimants[0].name} rejected your repayment plan.`,
                'They accepted a new repayment plan determined by the court, based on the financial details you provided.',
                'View the repayment plan',
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant past counter signature deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanByDetermination()) }, fullAdmission_1.settlementOfferAcceptBySetDate()),
            claimantAssertions: [
                'The defendant has not signed your settlement agreement',
                `${fullAdmissionClaim.claim.defendants[0].name} can still sign the settlement agreement until you request a CCJ.`,
                'Request a County Court Judgment'
            ],
            defendantAssertions: [
                `${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement`,
                'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
                'View the repayment plan',
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanByDetermination()) }, fullAdmission_1.settledWithAgreementBySetDate()),
            claimantAssertions: [
                'You’ve both signed a settlement agreement',
                'The agreement says the defendant will pay you in full by',
                'Download the settlement agreement',
                'Tell us you’ve settled'
            ],
            defendantAssertions: [
                'You’ve both signed a settlement agreement',
                'Download the settlement agreement',
                `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanByDetermination()) }, fullAdmission_1.settledWithAgreementBySetDatePastPaymentDeadline()),
            claimantAssertions: [
                'You’ve both signed a settlement agreement',
                'The agreement says the defendant will pay you in full by',
                'Download the settlement agreement',
                'Tell us you’ve settled',
                'Request County Court Judgment',
                'request a County Court Judgment'
            ],
            defendantAssertions: [
                'You’ve both signed a settlement agreement',
                'Download the settlement agreement',
                `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant rejects settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayBySetDateData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanByDetermination()) }, fullAdmission_1.defendantRejectedSettlementOfferAcceptBySetDate()),
            claimantAssertions: [
                `The defendant has rejected your settlement agreement`,
                'Request a County Court Judgment (CCJ)'
            ],
            defendantAssertions: [
                'You rejected the settlement agreement',
                `${fullAdmissionClaim.claim.claimants[0].name} can request a County Court Judgment (CCJ) against you.`,
                `If ${fullAdmissionClaim.claim.claimants[0].name} requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay in instalments',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData) }, fullAdmission_1.settlementOfferByInstalments()),
            claimantAssertions: [
                'The defendant has offered to pay in instalments',
                'View and respond to the offer',
                'If you’ve been paid',
                'Tell us you’ve settled'
            ],
            defendantAssertions: [
                'Your response to the claim',
                `You’ve offered to pay ${fullAdmissionClaim.claim.claimants[0].name} ${numberFormatter_1.NumberFormatter.formatMoney(responseData_1.basePayByInstalmentsData.paymentIntention.repaymentPlan.instalmentAmount)} every week starting`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant rejects repayment plan and referred to judge',
            claim: fullAdmissionClaim,
            claimOverride: {
                response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData),
                claimantResponse: Object.assign({}, fullAdmission_1.claimantReferredToJudgeResponseForInstalments())
            },
            claimantAssertions: [
                'Wait for a judge to review the case',
                'You’ve rejected the defendant’s repayment plan and haven’t been able to agree to an alternative plan.',
                'A judge will review the case. We’ll contact you by post to tell you what to do next.',
                'Your online account won’t be updated - any further updates will be by post.'
            ],
            defendantAssertions: [
                'Wait for a judge to make a repayment plan',
                'A County Court Judgment (CCJ) has been issued against you.',
                `${fullAdmissionClaim.claim.claimants[0].name} rejected your repayment plan and requested a CCJ against you.`,
                'They also rejected a repayment plan determined by the court, based on the financial details you provided.',
                `When we’ve processed the request we’ll post a copy of the judgment to you and to ${fullAdmissionClaim.claim.claimants[0].name}.`,
                'We’ll contact you by post to tell you what to do next.',
                'Your online account won’t be updated - any further updates will be by post.',
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settlementOfferAcceptInInstalment()),
            claimantAssertions: [
                'You’ve signed a settlement agreement',
                `We’ve emailed ${fullAdmissionClaim.claim.defendants[0].name} the repayment plan and the settlement agreement for them to sign.`,
                'They must respond by',
                'We’ll email you when they respond.',
                'If you’ve been paid',
                'Tell us you’ve settled'
            ],
            defendantAssertions: [
                `${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement`,
                'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
                'View the repayment plan',
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant past counter signature deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settlementOfferAcceptInInstalment()),
            claimantAssertions: [
                'The defendant has not signed your settlement agreement',
                `${fullAdmissionClaim.claim.defendants[0].name} can still sign the settlement agreement until you request a CCJ.`,
                'Request a County Court Judgment',
                'If you’ve been paid',
                'Tell us you’ve settled'
            ],
            defendantAssertions: [
                `${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement`,
                'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
                'View the repayment plan',
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settledWithAgreementInInstalments()),
            claimantAssertions: [
                'You’ve both signed a settlement agreement',
                `The agreement says the defendant will pay you in instalments of ${numberFormatter_1.NumberFormatter.formatMoney(fullAdmission_1.defendantOffersSettlementByInstalments()[0].offer.paymentIntention.repaymentPlan.instalmentAmount)} every month starting`,
                'Download the settlement agreement',
                'Tell us you’ve settled'
            ],
            defendantAssertions: [
                'You’ve both signed a settlement agreement',
                `The agreement says you’ll repay ${numberFormatter_1.NumberFormatter.formatMoney(fullAdmission_1.defendantOffersSettlementByInstalments()[0].offer.paymentIntention.repaymentPlan.instalmentAmount)} every month starting`,
                'Download the settlement agreement',
                `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.settledWithAgreementInInstalmentsPastPaymentDeadline()),
            claimantAssertions: [
                'You’ve both signed a settlement agreement',
                `The agreement says the defendant will pay you in instalments of ${numberFormatter_1.NumberFormatter.formatMoney(fullAdmission_1.defendantOffersSettlementByInstalments()[0].offer.paymentIntention.repaymentPlan.instalmentAmount)}`,
                'Download the settlement agreement',
                'Tell us you’ve settled',
                'Request County Court Judgment',
                'request a County Court Judgment'
            ],
            defendantAssertions: [
                'You’ve both signed a settlement agreement',
                'Download the settlement agreement',
                `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant rejects settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlan) }, fullAdmission_1.defendantRejectedSettlementOfferAcceptInInstalments()),
            claimantAssertions: [
                `The defendant has rejected your settlement agreement`,
                'Request a County Court Judgment (CCJ)'
            ],
            defendantAssertions: [
                'You rejected the settlement agreement',
                `${fullAdmissionClaim.claim.claimants[0].name} can request a County Court Judgment (CCJ) against you.`,
                `If ${fullAdmissionClaim.claim.claimants[0].name} requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, fullAdmission_1.settlementOfferAcceptInInstalment()),
            claimantAssertions: [
                'You’ve signed a settlement agreement',
                `We’ve emailed ${fullAdmissionClaim.claim.defendants[0].name} the repayment plan and the settlement agreement for them to sign.`,
                'They must respond by',
                'We’ll email you when they respond.'
            ],
            defendantAssertions: [
                `${fullAdmissionClaim.claim.claimants[0].name} rejected your repayment plan.`,
                'They accepted a new repayment plan determined by the court, based on the financial details you provided.',
                'View the repayment plan',
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant past counter signature deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, fullAdmission_1.settlementOfferAcceptInInstalment()),
            claimantAssertions: [
                'The defendant has not signed your settlement agreement',
                `${fullAdmissionClaim.claim.defendants[0].name} can still sign the settlement agreement until you request a CCJ.`,
                'Request a County Court Judgment'
            ],
            defendantAssertions: [
                `${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement`,
                'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
                'View the repayment plan',
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate(), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, fullAdmission_1.settledWithAgreementInInstalments()),
            claimantAssertions: [
                'You’ve both signed a settlement agreement',
                `The agreement says the defendant will pay you in instalments of ${numberFormatter_1.NumberFormatter.formatMoney(fullAdmission_1.defendantOffersSettlementByInstalments()[0].offer.paymentIntention.repaymentPlan.instalmentAmount)} every month starting`,
                'Download the settlement agreement',
                'Tell us you’ve settled'
            ],
            defendantAssertions: [
                'You’ve both signed a settlement agreement',
                `The agreement says you’ll repay ${numberFormatter_1.NumberFormatter.formatMoney(fullAdmission_1.defendantOffersSettlementByInstalments()[0].offer.paymentIntention.repaymentPlan.instalmentAmount)} every month starting`,
                'Download the settlement agreement',
                `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, fullAdmission_1.settledWithAgreementInInstalmentsPastPaymentDeadline()),
            claimantAssertions: [
                'You’ve both signed a settlement agreement',
                `The agreement says the defendant will pay you in instalments of ${numberFormatter_1.NumberFormatter.formatMoney(fullAdmission_1.defendantOffersSettlementByInstalments()[0].offer.paymentIntention.repaymentPlan.instalmentAmount)}`,
                'Download the settlement agreement',
                'Tell us you’ve settled',
                'Request County Court Judgment',
                'request a County Court Judgment'
            ],
            defendantAssertions: [
                'You’ve both signed a settlement agreement',
                'Download the settlement agreement',
                `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
                'Download your response'
            ]
        },
        {
            status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant rejects settlement agreement',
            claim: fullAdmissionClaim,
            claimOverride: Object.assign({ response: Object.assign(Object.assign({}, fullAdmissionClaim.response), responseData_1.basePayByInstalmentsData), claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().subtract(8, 'days'), claimantResponse: Object.assign({}, fullAdmission_1.claimantAcceptRepaymentPlanInInstalmentsByDetermination()) }, fullAdmission_1.defendantRejectedSettlementOfferAcceptInInstalments()),
            claimantAssertions: [
                `The defendant has rejected your settlement agreement`,
                'Request a County Court Judgment (CCJ)'
            ],
            defendantAssertions: [
                'You rejected the settlement agreement',
                `${fullAdmissionClaim.claim.claimants[0].name} can request a County Court Judgment (CCJ) against you.`,
                `If ${fullAdmissionClaim.claim.claimants[0].name} requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.`,
                'Download your response'
            ]
        }
    ];
}
const claimPagePath = paths_1.Paths.claimantPage.evaluateUri({ externalId: fullAdmissionClaim.externalId });
const defendantPagePath = paths_1.Paths.defendantPage.evaluateUri({ externalId: fullAdmissionClaim.externalId });
describe('Dashboard page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        context('when user authorised', () => {
            context('Claim Status', () => {
                context('as a claimant', () => {
                    beforeEach(() => {
                        idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
                    });
                    testData().forEach(data => {
                        it(`should render claim status: ${data.status}`, async () => {
                            claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride);
                            await request(app_1.app)
                                .get(claimPagePath)
                                .set('Cookie', `${cookieName} = ABC`)
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
                                .set('Cookie', `${cookieName} = ABC`)
                                .expect(res => chai_1.expect(res).to.be.successful.withText(...data.defendantAssertions));
                        });
                    });
                });
            });
        });
    });
});
