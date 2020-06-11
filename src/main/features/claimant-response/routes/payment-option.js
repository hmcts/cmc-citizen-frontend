"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const payment_option_1 = require("shared/components/payment-intention/payment-option");
const model_accessor_1 = require("shared/components/model-accessor");
const paymentIntention_1 = require("shared/components/payment-intention/model/paymentIntention");
const paymentIntention_2 = require("claims/models/response/core/paymentIntention");
const paths_1 = require("claimant-response/paths");
const CourtDecisionHelper_1 = require("shared/helpers/CourtDecisionHelper");
const decisionType_1 = require("common/court-calculations/decisionType");
const paymentOption_1 = require("claims/models/paymentOption");
const paymentPlanHelper_1 = require("shared/helpers/paymentPlanHelper");
const frequency_1 = require("common/frequency/frequency");
const momentFactory_1 = require("shared/momentFactory");
const paymentOption_2 = require("shared/components/payment-intention/model/paymentOption");
const allowanceRepository_1 = require("common/allowances/allowanceRepository");
const allowanceCalculations_1 = require("common/allowances/allowanceCalculations");
const statementOfMeansCalculations_1 = require("common/statement-of-means/statementOfMeansCalculations");
const partyType_1 = require("common/partyType");
const courtDetermination_1 = require("claimant-response/draft/courtDetermination");
const admissionHelper_1 = require("shared/helpers/admissionHelper");
class PaymentOptionPage extends payment_option_1.AbstractPaymentOptionPage {
    static generateCourtOfferedPaymentIntention(draft, claim, decisionType) {
        const courtOfferedPaymentIntention = new paymentIntention_2.PaymentIntention();
        const claimResponse = claim.response;
        const admittedClaimAmount = admissionHelper_1.AdmissionHelper.getAdmittedAmount(claim);
        if (decisionType === decisionType_1.DecisionType.CLAIMANT || decisionType === decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT) {
            courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.IMMEDIATELY;
            courtOfferedPaymentIntention.paymentDate = momentFactory_1.MomentFactory.currentDate().add(5, 'days');
        }
        if (decisionType === decisionType_1.DecisionType.COURT) {
            const paymentPlanFromDefendantFinancialStatement = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft);
            if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.INSTALMENTS) {
                const defendantFrequency = frequency_1.Frequency.of(claimResponse.paymentIntention.repaymentPlan.paymentSchedule);
                const paymentPlanConvertedToDefendantFrequency = paymentPlanFromDefendantFinancialStatement.convertTo(defendantFrequency);
                courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.INSTALMENTS;
                courtOfferedPaymentIntention.repaymentPlan = {
                    firstPaymentDate: paymentPlanConvertedToDefendantFrequency.startDate,
                    instalmentAmount: paymentPlanConvertedToDefendantFrequency.instalmentAmount > admittedClaimAmount ?
                        admittedClaimAmount : _.round(paymentPlanConvertedToDefendantFrequency.instalmentAmount, 2),
                    paymentSchedule: frequency_1.Frequency.toPaymentSchedule(paymentPlanConvertedToDefendantFrequency.frequency),
                    completionDate: paymentPlanConvertedToDefendantFrequency.calculateLastPaymentDate(),
                    paymentLength: paymentPlanConvertedToDefendantFrequency.calculatePaymentLength()
                };
            }
            else {
                const paymentPlanConvertedToMonthlyFrequency = paymentPlanFromDefendantFinancialStatement.convertTo(frequency_1.Frequency.MONTHLY);
                courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.INSTALMENTS;
                courtOfferedPaymentIntention.repaymentPlan = {
                    firstPaymentDate: paymentPlanConvertedToMonthlyFrequency.startDate,
                    instalmentAmount: paymentPlanConvertedToMonthlyFrequency.instalmentAmount > admittedClaimAmount ?
                        admittedClaimAmount : _.round(paymentPlanConvertedToMonthlyFrequency.instalmentAmount, 2),
                    paymentSchedule: frequency_1.Frequency.toPaymentSchedule(paymentPlanConvertedToMonthlyFrequency.frequency),
                    completionDate: paymentPlanConvertedToMonthlyFrequency.calculateLastPaymentDate(),
                    paymentLength: paymentPlanConvertedToMonthlyFrequency.calculatePaymentLength()
                };
            }
        }
        if (decisionType === decisionType_1.DecisionType.DEFENDANT) {
            if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.BY_SPECIFIED_DATE) {
                courtOfferedPaymentIntention.paymentDate = claimResponse.paymentIntention.paymentDate;
                courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.BY_SPECIFIED_DATE;
            }
            if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.INSTALMENTS) {
                courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.INSTALMENTS;
                courtOfferedPaymentIntention.repaymentPlan = claimResponse.paymentIntention.repaymentPlan;
            }
        }
        return courtOfferedPaymentIntention;
    }
    static generateCourtCalculatedPaymentIntention(draft, claim) {
        const courtCalculatedPaymentIntention = new paymentIntention_2.PaymentIntention();
        const paymentPlan = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft);
        if (!paymentPlan) {
            return undefined;
        }
        courtCalculatedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.BY_SPECIFIED_DATE;
        courtCalculatedPaymentIntention.paymentDate = paymentPlan.calculateLastPaymentDate();
        return courtCalculatedPaymentIntention;
    }
    static getCourtDecision(draft, claim) {
        return CourtDecisionHelper_1.CourtDecisionHelper.createCourtDecision(claim, draft);
    }
    getView() {
        return 'claimant-response/views/payment-option';
    }
    createModelAccessor() {
        return new model_accessor_1.DefaultModelAccessor('alternatePaymentMethod', () => new paymentIntention_1.PaymentIntention());
    }
    buildTaskListUri(req, res) {
        const claim = res.locals.claim;
        const draft = res.locals.draft.document;
        const claimResponse = claim.response;
        const externalId = req.params.externalId;
        const courtDecision = PaymentOptionPage.getCourtDecision(draft, claim);
        switch (courtDecision) {
            case decisionType_1.DecisionType.NOT_APPLICABLE_IS_BUSINESS:
                return paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId });
            case decisionType_1.DecisionType.COURT:
                return paths_1.Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId });
            case decisionType_1.DecisionType.DEFENDANT: {
                if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.INSTALMENTS) {
                    return paths_1.Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId });
                }
                if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.BY_SPECIFIED_DATE) {
                    return paths_1.Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId });
                }
                break;
            }
            case decisionType_1.DecisionType.CLAIMANT:
            case decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT: {
                return paths_1.Paths.payBySetDateAcceptedPage.evaluateUri({ externalId: externalId });
            }
        }
    }
    static getDateOfBirth(defendant) {
        if (defendant.type === partyType_1.PartyType.INDIVIDUAL.value) {
            return momentFactory_1.MomentFactory.parse(defendant.dateOfBirth);
        }
        return undefined;
    }
    static getMonthlyDisposableIncome(claim) {
        const repository = new allowanceRepository_1.ResourceAllowanceRepository();
        const allowanceHelper = new allowanceCalculations_1.AllowanceCalculations(repository);
        const statementOfMeansCalculations = new statementOfMeansCalculations_1.StatementOfMeansCalculations(allowanceHelper);
        const response = claim.response;
        const disposableIncome = statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(response.statementOfMeans, response.defendant.type, PaymentOptionPage.getDateOfBirth(response.defendant));
        return disposableIncome === 0 ? 0 : _.round(disposableIncome, 2);
    }
    async saveDraft(locals) {
        const courtDetermination = new courtDetermination_1.CourtDetermination();
        if (locals.claim.claimData.defendant.isBusiness()) {
            locals.draft.document.courtDetermination = undefined;
        }
        else {
            locals.draft.document.courtDetermination = courtDetermination;
            locals.draft.document.courtDetermination.disposableIncome = PaymentOptionPage.getMonthlyDisposableIncome(locals.claim);
            if (locals.draft.document.alternatePaymentMethod.paymentOption.option === paymentOption_2.PaymentType.IMMEDIATELY) {
                const decisionType = PaymentOptionPage.getCourtDecision(locals.draft.document, locals.claim);
                courtDetermination.decisionType = decisionType;
                courtDetermination.courtPaymentIntention = PaymentOptionPage.generateCourtCalculatedPaymentIntention(locals.draft.document, locals.claim);
                courtDetermination.courtDecision = PaymentOptionPage.generateCourtOfferedPaymentIntention(locals.draft.document, locals.claim, decisionType);
            }
        }
        return super.saveDraft(locals);
    }
}
exports.PaymentOptionPage = PaymentOptionPage;
/* tslint:disable:no-default-export */
exports.default = new PaymentOptionPage()
    .buildRouter(paths_1.claimantResponsePath);
