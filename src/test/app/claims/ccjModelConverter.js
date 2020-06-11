"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const ccjModelConverter_1 = require("claims/ccjModelConverter");
const draftCCJ_1 = require("ccj/draft/draftCCJ");
const countyCourtJudgment_1 = require("claims/models/countyCourtJudgment");
const paymentOption_1 = require("claims/models/paymentOption");
const countyCourtJudgmentType_1 = require("claims/models/countyCourtJudgmentType");
const claim_1 = require("claims/models/claim");
const claimStoreMock = require("test/http-mocks/claim-store");
const paymentOption_2 = require("shared/components/payment-intention/model/paymentOption");
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
const responseData_1 = require("test/data/entity/responseData");
const statementType_1 = require("offer/form/models/statementType");
const madeBy_1 = require("claims/models/madeBy");
const repaymentPlan_1 = require("claims/models/repaymentPlan");
const localDate_1 = require("forms/models/localDate");
const momentFactory_1 = require("shared/momentFactory");
const ccjDraft = new draftCCJ_1.DraftCCJ().deserialize({
    paymentOption: {
        option: paymentOption_2.PaymentType.IMMEDIATELY
    },
    paidAmount: {
        option: {
            value: 'no'
        },
        claimedAmount: 1060
    }
});
const dob = new localDate_1.LocalDate(1999, 1, 1);
const ccjDraftWithDefendantDOBKnown = new draftCCJ_1.DraftCCJ().deserialize({
    paymentOption: {
        option: paymentOption_2.PaymentType.IMMEDIATELY
    },
    defendantDateOfBirth: {
        known: true,
        date: dob
    },
    paidAmount: {
        option: {
            value: 'no'
        },
        claimedAmount: 1060
    }
});
const ccjDraftWithInstallments = new draftCCJ_1.DraftCCJ().deserialize({
    paymentOption: {
        option: paymentOption_2.PaymentType.INSTALMENTS
    },
    defendantDateOfBirth: {
        known: true,
        date: dob
    },
    repaymentPlan: {
        remainingAmount: 4060,
        instalmentAmount: 100,
        firstPaymentDate: new localDate_1.LocalDate(2010, 12, 30),
        paymentSchedule: {
            value: 'EACH_WEEK',
            displayValue: 'Each week'
        }
    },
    paidAmount: {
        option: {
            value: 'no'
        },
        claimedAmount: 4060
    }
});
const fullAdmissionResponseWithSetDateAndPaymentDateElapsed = Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseFullAdmissionData), { paymentIntention: {
        paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: '2010-12-31'
    }, statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithAllFieldsData) });
const repaymentPlanPaymentIntention = {
    paymentIntention: {
        paymentOption: paymentOption_1.PaymentOption.INSTALMENTS,
        repaymentPlan: {
            instalmentAmount: 100,
            firstPaymentDate: momentFactory_1.MomentFactory.currentDate().subtract(10, 'day'),
            paymentSchedule: paymentSchedule_1.PaymentSchedule.EACH_WEEK,
            completionDate: '2051-12-31',
            paymentLength: '1'
        }
    }
};
const fullAdmissionResponseWithInstallmentsAndPaymentDateElapsed = Object.assign(Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.baseFullAdmissionData), repaymentPlanPaymentIntention), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithAllFieldsData) });
const sampleClaimWithFullAdmissionWithSetDateResponseObj = Object.assign(Object.assign({}, claimStoreMock.sampleClaimIssueObj), { response: fullAdmissionResponseWithSetDateAndPaymentDateElapsed });
const sampleClaimWithFullAdmissionWithInstallmentsResponseObj = Object.assign(Object.assign({}, claimStoreMock.sampleClaimIssueObj), { response: fullAdmissionResponseWithInstallmentsAndPaymentDateElapsed, settlement: {
        partyStatements: [
            {
                type: statementType_1.StatementType.OFFER.value,
                madeBy: madeBy_1.MadeBy.DEFENDANT.value,
                offer: Object.assign({ content: 'My offer contents here.', completionDate: '2020-10-10' }, repaymentPlanPaymentIntention)
            },
            {
                madeBy: madeBy_1.MadeBy.CLAIMANT.value,
                type: statementType_1.StatementType.ACCEPTATION.value
            }
        ]
    } });
describe('CCJModelConverter - convert CCJDraft to CountyCourtJudgement', () => {
    it('should convert to CCJ - for a valid CCJ draft', () => {
        const draft = ccjDraft;
        const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimIssueObj);
        const countyCourtJudgment = ccjModelConverter_1.CCJModelConverter.convertForRequest(draft, claim);
        chai_1.expect(countyCourtJudgment).to.be.deep.equal(new countyCourtJudgment_1.CountyCourtJudgment(undefined, paymentOption_1.PaymentOption.IMMEDIATELY, undefined, undefined, undefined, undefined, countyCourtJudgmentType_1.CountyCourtJudgmentType.DEFAULT));
    });
    it('should convert to CCJ - for a valid CCJ draft for full admission response paying by set date on breach of payment terms', () => {
        const draft = ccjDraftWithDefendantDOBKnown;
        const claim = new claim_1.Claim().deserialize(sampleClaimWithFullAdmissionWithSetDateResponseObj);
        const DOB = dob.toMoment();
        const countyCourtJudgment = ccjModelConverter_1.CCJModelConverter.convertForRequest(draft, claim);
        chai_1.expect(countyCourtJudgment).to.be.deep.equal(new countyCourtJudgment_1.CountyCourtJudgment(DOB, paymentOption_1.PaymentOption.IMMEDIATELY, undefined, undefined, undefined, undefined, countyCourtJudgmentType_1.CountyCourtJudgmentType.ADMISSIONS));
    });
    it('should convert to CCJ - for a valid CCJ draft for full admission response paying by installments on breach of payment terms', () => {
        const draft = ccjDraftWithInstallments;
        const claim = new claim_1.Claim().deserialize(sampleClaimWithFullAdmissionWithInstallmentsResponseObj);
        const expectedRepaymentPlan = new repaymentPlan_1.RepaymentPlan(100, new localDate_1.LocalDate(2010, 12, 30).toMoment(), 'EACH_WEEK');
        const DOB = dob.toMoment();
        const countyCourtJudgment = ccjModelConverter_1.CCJModelConverter.convertForRequest(draft, claim);
        chai_1.expect(countyCourtJudgment).to.be.deep.equal(new countyCourtJudgment_1.CountyCourtJudgment(DOB, paymentOption_1.PaymentOption.INSTALMENTS, undefined, expectedRepaymentPlan, undefined, undefined, countyCourtJudgmentType_1.CountyCourtJudgmentType.ADMISSIONS));
    });
});
describe('CCJModelConverter - Unit test on ModelConverter', () => {
    const sampleClaimWithInstalments = Object.assign(Object.assign({}, claimStoreMock.sampleClaimIssueObj), { response: fullAdmissionResponseWithInstallmentsAndPaymentDateElapsed, settlement: {
            partyStatements: [
                {
                    type: statementType_1.StatementType.OFFER.value,
                    madeBy: madeBy_1.MadeBy.DEFENDANT.value,
                    offer: Object.assign({ content: 'My offer contents here.', completionDate: '2020-10-10' }, repaymentPlanPaymentIntention)
                },
                {
                    madeBy: madeBy_1.MadeBy.CLAIMANT.value,
                    type: statementType_1.StatementType.ACCEPTATION.value
                }
            ]
        }, settlementReachedAt: new localDate_1.LocalDate(2010, 1, 1).toMoment() });
    it('should get undefined CCJPaymentOption when response not present', () => {
        const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimIssueObj);
        const ccjPaymentOption = ccjModelConverter_1.retrievePaymentOptionsFromClaim(claim);
        chai_1.expect(ccjPaymentOption).to.be.undefined;
    });
    it('should get defined CCJPaymentOption when response is present', () => {
        const claim = new claim_1.Claim().deserialize(sampleClaimWithInstalments);
        const ccjPaymentOption = ccjModelConverter_1.retrievePaymentOptionsFromClaim(claim);
        chai_1.expect(ccjPaymentOption.option.value).to.be.equal(paymentOption_2.PaymentType.INSTALMENTS.value);
    });
});
