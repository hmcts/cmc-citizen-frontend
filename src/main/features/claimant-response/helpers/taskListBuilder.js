"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("claimant-response/paths");
const acceptPaymentMethodTask_1 = require("claimant-response/tasks/acceptPaymentMethodTask");
const settleAdmittedTask_1 = require("claimant-response/tasks/settleAdmittedTask");
const yesNoOption_1 = require("claims/models/response/core/yesNoOption");
const responseType_1 = require("claims/models/response/responseType");
const class_validator_1 = require("@hmcts/class-validator");
const taskList_1 = require("drafts/tasks/taskList");
const taskListItem_1 = require("drafts/tasks/taskListItem");
const numberFormatter_1 = require("utils/numberFormatter");
const paymentOption_1 = require("claims/models/paymentOption");
const viewDefendantResponseTask_1 = require("claimant-response/tasks/viewDefendantResponseTask");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
const chooseHowToProceedTask_1 = require("claimant-response/tasks/chooseHowToProceedTask");
const signSettlementAgreementTask_1 = require("claimant-response/tasks/signSettlementAgreementTask");
const freeMediationTask_1 = require("shared/components/free-mediation/freeMediationTask");
const claimSettledTask_1 = require("claimant-response/tasks/states-paid/claimSettledTask");
const partPaymentReceivedTask_1 = require("claimant-response/tasks/states-paid/partPaymentReceivedTask");
const statesPaidHelper_1 = require("claimant-response/helpers/statesPaidHelper");
const directionsQuestionnaireHelper_1 = require("claimant-response/helpers/directionsQuestionnaireHelper");
const featureToggles_1 = require("utils/featureToggles");
const paths_2 = require("mediation/paths");
const paths_3 = require("directions-questionnaire/paths");
const detailsInCaseOfHearingTask_1 = require("claimant-response/tasks/detailsInCaseOfHearingTask");
const intentionToProceedTask_1 = require("claimant-response/tasks/intentionToProceedTask");
const validator = new class_validator_1.Validator();
function isDefinedAndValid(value) {
    return value && validator.validateSync(value).length === 0;
}
class TaskListBuilder {
    static buildDefendantResponseSection(draft, claim) {
        const tasks = [];
        const externalId = claim.externalId;
        tasks.push(new taskListItem_1.TaskListItem('View the defendant’s response', paths_1.Paths.defendantsResponsePage.evaluateUri({ externalId: externalId }), viewDefendantResponseTask_1.ViewDefendantResponseTask.isCompleted(draft.defendantResponseViewed)));
        return new taskList_1.TaskList('How they responded', tasks);
    }
    static buildStatesPaidHowYouWantToRespondSection(draft, claim, mediationDraft) {
        const tasks = [];
        const response = claim.response;
        const externalId = claim.externalId;
        if (response.responseType === responseType_1.ResponseType.FULL_DEFENCE) {
            tasks.push(new taskListItem_1.TaskListItem('Accept or reject their response', paths_1.Paths.settleClaimPage.evaluateUri({ externalId: externalId }), claimSettledTask_1.ClaimSettledTask.isCompleted(draft)));
        }
        else {
            if (statesPaidHelper_1.StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)) {
                tasks.push(new taskListItem_1.TaskListItem(`Have you been paid the ${numberFormatter_1.NumberFormatter.formatMoney(response.amount)}?`, paths_1.Paths.partPaymentReceivedPage.evaluateUri({ externalId: externalId }), partPaymentReceivedTask_1.PartPaymentReceivedTask.isCompleted(draft)));
                if (draft.partPaymentReceived && draft.partPaymentReceived.received.option === yesNoOption_1.YesNoOption.YES) {
                    tasks.push(new taskListItem_1.TaskListItem(`Settle the claim for ${numberFormatter_1.NumberFormatter.formatMoney(response.amount)}?`, paths_1.Paths.settleClaimPage.evaluateUri({ externalId: externalId }), claimSettledTask_1.ClaimSettledTask.isCompleted(draft)));
                }
            }
            else {
                tasks.push(new taskListItem_1.TaskListItem(`Have you been paid the full ${numberFormatter_1.NumberFormatter.formatMoney(claim.totalAmountTillDateOfIssue)}?`, paths_1.Paths.settleClaimPage.evaluateUri({ externalId: externalId }), claimSettledTask_1.ClaimSettledTask.isCompleted(draft)));
            }
        }
        if (claim.response.freeMediation === yesNoOption_1.YesNoOption.YES) {
            if ((draft.accepted && draft.accepted.accepted.option === yesNoOption_1.YesNoOption.NO) ||
                (draft.partPaymentReceived && draft.partPaymentReceived.received.option === yesNoOption_1.YesNoOption.NO)) {
                if (featureToggles_1.FeatureToggles.isEnabled('mediation')) {
                    const path = paths_2.Paths.freeMediationPage.evaluateUri({ externalId: claim.externalId });
                    tasks.push(new taskListItem_1.TaskListItem('Free telephone mediation', path, freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)));
                }
                else {
                    const path = paths_2.Paths.tryFreeMediationPage.evaluateUri({ externalId: claim.externalId });
                    tasks.push(new taskListItem_1.TaskListItem('Free telephone mediation', path, freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)));
                }
            }
        }
        return new taskList_1.TaskList('Your response', tasks);
    }
    static buildHowYouWantToRespondSection(draft, claim, mediationDraft) {
        if (statesPaidHelper_1.StatesPaidHelper.isResponseAlreadyPaid(claim)) {
            return this.buildStatesPaidHowYouWantToRespondSection(draft, claim, mediationDraft);
        }
        const externalId = claim.externalId;
        const tasks = [];
        if (claim.response.responseType === responseType_1.ResponseType.FULL_DEFENCE) {
            tasks.push(new taskListItem_1.TaskListItem('Decide whether to proceed', paths_1.Paths.intentionToProceedPage.evaluateUri({ externalId: externalId }), intentionToProceedTask_1.IntentionToProceedTask.isCompleted(draft.intentionToProceed)));
            if (claim.response.freeMediation === yesNoOption_1.YesNoOption.YES && draft.intentionToProceed && draft.intentionToProceed.proceed.option === yesNoOption_1.YesNoOption.YES) {
                if (featureToggles_1.FeatureToggles.isEnabled('mediation')) {
                    const path = paths_2.Paths.freeMediationPage.evaluateUri({ externalId: claim.externalId });
                    tasks.push(new taskListItem_1.TaskListItem('Free telephone mediation', path, freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)));
                }
                else {
                    const path = paths_2.Paths.tryFreeMediationPage.evaluateUri({ externalId: claim.externalId });
                    tasks.push(new taskListItem_1.TaskListItem('Free telephone mediation', path, freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)));
                }
            }
        }
        else if (claim.response.responseType === responseType_1.ResponseType.PART_ADMISSION && claim.response.paymentIntention !== undefined) {
            tasks.push(new taskListItem_1.TaskListItem('Accept or reject the ' + numberFormatter_1.NumberFormatter.formatMoney(claim.response.amount), paths_1.Paths.settleAdmittedPage.evaluateUri({ externalId: externalId }), settleAdmittedTask_1.SettleAdmittedTask.isCompleted(draft.settleAdmitted)));
            if (draft.settleAdmitted
                && draft.settleAdmitted.admitted.option === yesNoOption_1.YesNoOption.YES
                && claim.response.paymentIntention.paymentOption !== paymentOption_1.PaymentOption.IMMEDIATELY) {
                tasks.push(new taskListItem_1.TaskListItem('Accept or reject their repayment plan', paths_1.Paths.acceptPaymentMethodPage.evaluateUri({ externalId: externalId }), acceptPaymentMethodTask_1.AcceptPaymentMethodTask.isCompleted(draft.acceptPaymentMethod)));
            }
            this.buildProposeAlternateRepaymentPlanTask(draft, tasks, externalId);
            if (!claim.claimData.defendant.isBusiness() || (draft.acceptPaymentMethod && draft.acceptPaymentMethod.accept.option === yesNoOption_1.YesNoOption.YES)) {
                this.buildFormaliseRepaymentPlan(draft, tasks, externalId);
            }
            this.buildSignSettlementAgreement(draft, tasks, externalId);
            this.buildRequestCountyCourtJudgment(draft, tasks, externalId);
            if (claim.response.freeMediation === yesNoOption_1.YesNoOption.YES
                && ((draft.settleAdmitted && draft.settleAdmitted.admitted.option === yesNoOption_1.YesNoOption.NO)
                    || (draft.intentionToProceed && draft.intentionToProceed.proceed.option === yesNoOption_1.YesNoOption.YES))) {
                if (featureToggles_1.FeatureToggles.isEnabled('mediation')) {
                    const path = paths_2.Paths.freeMediationPage.evaluateUri({ externalId: claim.externalId });
                    tasks.push(new taskListItem_1.TaskListItem('Free telephone mediation', path, freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)));
                }
                else {
                    const path = paths_2.Paths.tryFreeMediationPage.evaluateUri({ externalId: claim.externalId });
                    tasks.push(new taskListItem_1.TaskListItem('Free telephone mediation', path, freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)));
                }
            }
        }
        else if (claim.response.responseType === responseType_1.ResponseType.FULL_ADMISSION
            && claim.response.paymentIntention.paymentOption !== paymentOption_1.PaymentOption.IMMEDIATELY) {
            tasks.push(new taskListItem_1.TaskListItem('Accept or reject their repayment plan', paths_1.Paths.acceptPaymentMethodPage.evaluateUri({ externalId: externalId }), acceptPaymentMethodTask_1.AcceptPaymentMethodTask.isCompleted(draft.acceptPaymentMethod)));
            this.buildProposeAlternateRepaymentPlanTask(draft, tasks, externalId);
            if (!claim.claimData.defendant.isBusiness() || (draft.acceptPaymentMethod && draft.acceptPaymentMethod.accept.option === yesNoOption_1.YesNoOption.YES)) {
                this.buildFormaliseRepaymentPlan(draft, tasks, externalId);
            }
            this.buildSignSettlementAgreement(draft, tasks, externalId);
            this.buildRequestCountyCourtJudgment(draft, tasks, externalId);
        }
        return new taskList_1.TaskList('Choose what to do next', tasks);
    }
    static buildProposeAlternateRepaymentPlanTask(draft, tasks, externalId) {
        if (draft.acceptPaymentMethod && draft.acceptPaymentMethod.accept.option === yesNoOption_1.YesNoOption.NO) {
            tasks.push(new taskListItem_1.TaskListItem('Propose an alternative repayment plan', paths_1.Paths.alternateRepaymentPlanPage.evaluateUri({ externalId: externalId }), isDefinedAndValid(draft.alternatePaymentMethod)));
        }
    }
    static buildSignSettlementAgreement(draft, tasks, externalId) {
        if (draft.formaliseRepaymentPlan
            && draft.formaliseRepaymentPlan.option.value === formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT.value) {
            tasks.push(new taskListItem_1.TaskListItem('Sign a settlement agreement', paths_1.Paths.signSettlementAgreementPage.evaluateUri({ externalId: externalId }), signSettlementAgreementTask_1.SignSettlementAgreementTask.isCompleted(draft.settlementAgreement)));
        }
    }
    static buildRequestCountyCourtJudgment(draft, tasks, externalId) {
        if (draft.formaliseRepaymentPlan
            && draft.formaliseRepaymentPlan.option.value === formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT.value) {
            tasks.push(new taskListItem_1.TaskListItem('Request a County Court Judgment', paths_1.CCJPaths.paidAmountPage.evaluateUri({ externalId: externalId }), isDefinedAndValid(draft.paidAmount)));
        }
    }
    static buildFormaliseRepaymentPlan(draft, tasks, externalId) {
        if (draft.acceptPaymentMethod && (draft.acceptPaymentMethod.accept.option === yesNoOption_1.YesNoOption.YES || (this.isFormaliseRepaymentPlanNotSetOrNotReferToJudge(draft) &&
            draft.acceptPaymentMethod.accept.option === yesNoOption_1.YesNoOption.NO &&
            isDefinedAndValid(draft.alternatePaymentMethod) &&
            draft.courtDetermination.rejectionReason.text === undefined))) {
            tasks.push(new taskListItem_1.TaskListItem('Choose how to formalise repayment', paths_1.Paths.chooseHowToProceedPage.evaluateUri({ externalId: externalId }), chooseHowToProceedTask_1.ChooseHowToProceedTask.isCompleted(draft.formaliseRepaymentPlan)));
        }
    }
    static isFormaliseRepaymentPlanNotSetOrNotReferToJudge(draft) {
        return draft.formaliseRepaymentPlan === undefined || (draft.formaliseRepaymentPlan && draft.formaliseRepaymentPlan.option !== formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REFER_TO_JUDGE);
    }
    static buildSubmitSection(draft, externalId) {
        const tasks = [];
        tasks.push(new taskListItem_1.TaskListItem('Check and submit your response', paths_1.Paths.checkAndSendPage.evaluateUri({ externalId: externalId }), false));
        return new taskList_1.TaskList('Submit', tasks);
    }
    static buildRemainingTasks(draft, claim, mediationDraft, directionsQuestionnaireDraft) {
        const resolveDirectionsQuestionnaireTaskList = TaskListBuilder.buildDirectionsQuestionnaireSection(draft, claim, directionsQuestionnaireDraft);
        return [].concat(TaskListBuilder.buildDefendantResponseSection(draft, claim).tasks, TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, mediationDraft).tasks, resolveDirectionsQuestionnaireTaskList !== undefined ? resolveDirectionsQuestionnaireTaskList.tasks : [])
            .filter(item => !item.completed);
    }
    static buildDirectionsQuestionnaireSection(draft, claim, directionsQuestionnaireDraft) {
        if (directionsQuestionnaireHelper_1.DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(draft, claim)) {
            return new taskList_1.TaskList('Your hearing requirements', [
                new taskListItem_1.TaskListItem(`Give us details in case there’s a hearing`, paths_3.Paths.supportPage.evaluateUri({ externalId: claim.externalId }), detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim))
            ]);
        }
        return undefined;
    }
}
exports.TaskListBuilder = TaskListBuilder;
