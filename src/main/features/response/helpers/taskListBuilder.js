"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taskList_1 = require("drafts/tasks/taskList");
const taskListItem_1 = require("drafts/tasks/taskListItem");
const paths_1 = require("response/paths");
const paths_2 = require("mediation/paths");
const paths_3 = require("directions-questionnaire/paths");
const momentFactory_1 = require("shared/momentFactory");
const moreTimeNeededTask_1 = require("response/tasks/moreTimeNeededTask");
const oweMoneyTask_1 = require("response/tasks/oweMoneyTask");
const yourDefenceTask_1 = require("response/tasks/yourDefenceTask");
const yourDetails_1 = require("response/tasks/yourDetails");
const freeMediationTask_1 = require("shared/components/free-mediation/freeMediationTask");
const decideHowYouWillPayTask_1 = require("response/tasks/decideHowYouWillPayTask");
const isPastDeadline_1 = require("claims/isPastDeadline");
const yourRepaymentPlanTask_1 = require("features/response/tasks/yourRepaymentPlanTask");
const statementOfMeansTask_1 = require("response/tasks/statementOfMeansTask");
const statementOfMeansFeature_1 = require("response/helpers/statementOfMeansFeature");
const howMuchDoYouOweTask_1 = require("response/tasks/howMuchDoYouOweTask");
const whenWillYouPayTask_1 = require("response/tasks/whenWillYouPayTask");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const numberFormatter_1 = require("utils/numberFormatter");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
const ValidationUtils_1 = require("shared/ValidationUtils");
const viewSendCompanyFinancialDetailsTask_1 = require("response/tasks/viewSendCompanyFinancialDetailsTask");
const detailsInCaseOfHearingTask_1 = require("response/tasks/detailsInCaseOfHearingTask");
const featureToggles_1 = require("utils/featureToggles");
const deadlineCalculatorClient_1 = require("claims/deadlineCalculatorClient");
class TaskListBuilder {
    static async buildBeforeYouStartSection(draft, claim, now) {
        const tasks = [];
        const externalId = claim.externalId;
        if (!claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim)
            && (draft.isResponsePartiallyAdmitted() || draft.isResponseFullyAdmitted())) {
            delete draft.response.type;
        }
        tasks.push(new taskListItem_1.TaskListItem('Confirm your details', paths_1.Paths.defendantYourDetailsPage.evaluateUri({ externalId: externalId }), yourDetails_1.YourDetails.isCompleted(draft)));
        const postponedDeadline = await deadlineCalculatorClient_1.DeadlineCalculatorClient.calculatePostponedDeadline(claim.issuedOn);
        if (!isPastDeadline_1.isPastDeadline(now, postponedDeadline)) {
            tasks.push(new taskListItem_1.TaskListItem('Decide if you need more time to respond', paths_1.Paths.moreTimeRequestPage.evaluateUri({ externalId: externalId }), moreTimeNeededTask_1.MoreTimeNeededTask.isCompleted(draft, claim.moreTimeRequested)));
        }
        return new taskList_1.TaskList('Prepare your response', tasks);
    }
    static buildRespondToClaimSection(draft, claim) {
        const externalId = claim.externalId;
        const tasks = [];
        tasks.push(new taskListItem_1.TaskListItem('Choose a response', paths_1.Paths.responseTypePage.evaluateUri({ externalId: externalId }), oweMoneyTask_1.OweMoneyTask.isCompleted(draft)));
        if (draft.isResponseRejectedFullyBecausePaidWhatOwed()) {
            tasks.push(new taskListItem_1.TaskListItem('Tell us how much you’ve paid', paths_1.FullRejectionPaths.howMuchHaveYouPaidPage.evaluateUri({ externalId: externalId }), ValidationUtils_1.ValidationUtils.isValid(draft.rejectAllOfClaim.howMuchHaveYouPaid)));
            if (claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim)
                && draft.rejectAllOfClaim.howMuchHaveYouPaid !== undefined
                && draft.rejectAllOfClaim.howMuchHaveYouPaid.amount < claim.totalAmountTillToday) {
                tasks.push(new taskListItem_1.TaskListItem('Why do you disagree with the amount claimed?', paths_1.FullRejectionPaths.whyDoYouDisagreePage.evaluateUri({ externalId: externalId }), ValidationUtils_1.ValidationUtils.isValid(draft.rejectAllOfClaim.whyDoYouDisagree)));
            }
        }
        if (draft.isResponseRejectedFullyWithDispute()) {
            tasks.push(new taskListItem_1.TaskListItem('Tell us why you disagree with the claim', paths_1.Paths.defencePage.evaluateUri({ externalId: externalId }), yourDefenceTask_1.YourDefenceTask.isCompleted(draft)));
        }
        if (claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim)) {
            if (draft.isResponseFullyAdmitted()) {
                tasks.push(new taskListItem_1.TaskListItem('Decide how you’ll pay', paths_1.FullAdmissionPaths.paymentOptionPage.evaluateUri({ externalId: externalId }), decideHowYouWillPayTask_1.DecideHowYouWillPayTask.isCompleted(draft)));
                if (statementOfMeansFeature_1.StatementOfMeansFeature.isApplicableFor(claim, draft)) {
                    tasks.push(new taskListItem_1.TaskListItem('Share your financial details', paths_1.StatementOfMeansPaths.introPage.evaluateUri({ externalId: externalId }), statementOfMeansTask_1.StatementOfMeansTask.isCompleted(draft)));
                }
                else if (draft.defendantDetails.partyDetails.isBusiness() &&
                    !draft.isImmediatePaymentOptionSelected(draft.fullAdmission) &&
                    !draft.isImmediatePaymentOptionSelected(draft.partialAdmission)) {
                    tasks.push(new taskListItem_1.TaskListItem('Share your financial details', paths_1.Paths.sendCompanyFinancialDetailsPage.evaluateUri({ externalId: externalId }), viewSendCompanyFinancialDetailsTask_1.ViewSendCompanyFinancialDetailsTask.isCompleted(draft)));
                }
                if (draft.isResponseFullyAdmittedWithInstalments()) {
                    tasks.push(new taskListItem_1.TaskListItem('Your repayment plan', paths_1.FullAdmissionPaths.paymentPlanPage.evaluateUri({ externalId: externalId }), yourRepaymentPlanTask_1.YourRepaymentPlanTask.isCompleted(draft.fullAdmission.paymentIntention.paymentPlan)));
                }
            }
            const partiallyAdmitted = draft.isResponsePartiallyAdmitted();
            const partiallyAdmittedAndPaid = draft.isResponsePartiallyAdmittedAndAlreadyPaid();
            if (partiallyAdmitted) {
                if (partiallyAdmittedAndPaid) {
                    tasks.push(new taskListItem_1.TaskListItem('How much have you paid?', paths_1.PartAdmissionPaths.howMuchHaveYouPaidPage.evaluateUri({ externalId: externalId }), ValidationUtils_1.ValidationUtils.isValid(draft.partialAdmission.howMuchHaveYouPaid)));
                    if (draft.partialAdmission.paymentIntention !== undefined) {
                        draft.partialAdmission.paymentIntention = undefined;
                    }
                    if (draft.statementOfMeans !== undefined) {
                        draft.statementOfMeans = undefined;
                    }
                }
                else {
                    tasks.push(new taskListItem_1.TaskListItem('How much money do you admit you owe?', paths_1.PartAdmissionPaths.howMuchDoYouOwePage.evaluateUri({ externalId: externalId }), howMuchDoYouOweTask_1.HowMuchDoYouOweTask.isCompleted(draft)));
                }
                tasks.push(new taskListItem_1.TaskListItem('Why do you disagree with the amount claimed?', paths_1.PartAdmissionPaths.whyDoYouDisagreePage.evaluateUri({ externalId: externalId }), ValidationUtils_1.ValidationUtils.isValid(draft.partialAdmission.whyDoYouDisagree)));
                const howMuchDoYouOweTask = howMuchDoYouOweTask_1.HowMuchDoYouOweTask.isCompleted(draft);
                if (howMuchDoYouOweTask) {
                    tasks.push(new taskListItem_1.TaskListItem(`When will you pay the ${numberFormatter_1.NumberFormatter.formatMoney(draft.partialAdmission.howMuchDoYouOwe.amount)}?`, paths_1.PartAdmissionPaths.paymentOptionPage.evaluateUri({ externalId: externalId }), whenWillYouPayTask_1.WhenWillYouPayTask.isCompleted(draft)));
                }
                if (statementOfMeansFeature_1.StatementOfMeansFeature.isApplicableFor(claim, draft)) {
                    tasks.push(new taskListItem_1.TaskListItem('Share your financial details', paths_1.StatementOfMeansPaths.introPage.evaluateUri({ externalId: externalId }), statementOfMeansTask_1.StatementOfMeansTask.isCompleted(draft)));
                }
                else if (draft.defendantDetails.partyDetails.isBusiness() &&
                    !draft.isImmediatePaymentOptionSelected(draft.fullAdmission) &&
                    !draft.isImmediatePaymentOptionSelected(draft.partialAdmission)) {
                    tasks.push(new taskListItem_1.TaskListItem('Share your financial details', paths_1.Paths.sendCompanyFinancialDetailsPage.evaluateUri({ externalId: externalId }), viewSendCompanyFinancialDetailsTask_1.ViewSendCompanyFinancialDetailsTask.isCompleted(draft)));
                }
                if (howMuchDoYouOweTask && whenWillYouPayTask_1.WhenWillYouPayTask.isCompleted(draft)
                    && draft.partialAdmission.paymentIntention.paymentOption.isOfType(paymentOption_1.PaymentType.INSTALMENTS)) {
                    tasks.push(new taskListItem_1.TaskListItem('Your repayment plan', paths_1.PartAdmissionPaths.paymentPlanPage.evaluateUri({ externalId: externalId }), yourRepaymentPlanTask_1.YourRepaymentPlanTask.isCompleted(draft.partialAdmission.paymentIntention.paymentPlan)));
                }
            }
        }
        return new taskList_1.TaskList('Respond to claim', tasks);
    }
    static buildResolvingClaimSection(draft, claim, mediationDraft) {
        if (draft.isResponseRejectedFullyWithDispute()
            || draft.isResponseRejectedFullyBecausePaidWhatOwed()
            || TaskListBuilder.isPartiallyAdmittedAndWhyDoYouDisagreeTaskCompleted(draft)) {
            let path;
            if (featureToggles_1.FeatureToggles.isEnabled('mediation')) {
                path = paths_2.Paths.freeMediationPage.evaluateUri({ externalId: claim.externalId });
                return new taskList_1.TaskList('Try to resolve the claim', [
                    new taskListItem_1.TaskListItem('Free telephone mediation', path, freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim))
                ]);
            }
            else {
                path = paths_2.Paths.tryFreeMediationPage.evaluateUri({ externalId: claim.externalId });
                return new taskList_1.TaskList('Resolving the claim', [
                    new taskListItem_1.TaskListItem('Free telephone mediation', path, freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim))
                ]);
            }
        }
        return undefined;
    }
    static buildDirectionsQuestionnaireSection(draft, claim, directionsQuestionnaireDraft) {
        if (draft.isResponsePartiallyAdmitted() || draft.isResponseRejected()) {
            return new taskList_1.TaskList('Your hearing requirements', [
                new taskListItem_1.TaskListItem(`Give us details in case there’s a hearing`, paths_3.Paths.supportPage.evaluateUri({ externalId: claim.externalId }), detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim))
            ]);
        }
        return undefined;
    }
    static buildSubmitSection(claim, draft, externalId) {
        const tasks = [];
        if (!draft.isResponsePopulated()
            || draft.isResponseRejectedFullyWithDispute()
            || TaskListBuilder.isRejectedFullyBecausePaidClaimAmount(claim, draft)
            || (claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim) && TaskListBuilder.isRejectedFullyBecausePaidMoreThenClaimAmount(claim, draft))
            || (claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim) && TaskListBuilder.isRejectedFullyBecausePaidLessThanClaimAmountAndExplanationGiven(claim, draft))
            || draft.isResponseFullyAdmitted()
            || draft.isResponsePartiallyAdmitted()) {
            tasks.push(new taskListItem_1.TaskListItem('Check and submit your response', paths_1.Paths.checkAndSendPage.evaluateUri({ externalId: externalId }), false));
            return new taskList_1.TaskList('Submit', tasks);
        }
        return undefined;
    }
    static isPartiallyAdmittedAndWhyDoYouDisagreeTaskCompleted(draft) {
        return draft.isResponsePartiallyAdmitted() && ValidationUtils_1.ValidationUtils.isValid(draft.partialAdmission.whyDoYouDisagree);
    }
    static isRejectedFullyBecausePaidClaimAmount(claim, draft) {
        return draft.isResponseRejectedFullyBecausePaidWhatOwed()
            && draft.rejectAllOfClaim.howMuchHaveYouPaid !== undefined
            && claim.totalAmountTillToday === draft.rejectAllOfClaim.howMuchHaveYouPaid.amount;
    }
    static isRejectedFullyBecausePaidMoreThenClaimAmount(claim, draft) {
        return draft.isResponseRejectedFullyBecausePaidWhatOwed()
            && draft.rejectAllOfClaim.howMuchHaveYouPaid !== undefined
            && claim.totalAmountTillToday < draft.rejectAllOfClaim.howMuchHaveYouPaid.amount;
    }
    static isRejectedFullyBecausePaidLessThanClaimAmountAndExplanationGiven(claim, draft) {
        return draft.isResponseRejectedFullyBecausePaidWhatOwed()
            && draft.rejectAllOfClaim.howMuchHaveYouPaid !== undefined
            && claim.totalAmountTillToday > draft.rejectAllOfClaim.howMuchHaveYouPaid.amount
            && ValidationUtils_1.ValidationUtils.isValid(draft.rejectAllOfClaim.whyDoYouDisagree);
    }
    static async buildRemainingTasks(draft, claim, mediationDraft, directionQuestionnaireDraft) {
        const resolvingClaimTaskList = TaskListBuilder.buildResolvingClaimSection(draft, claim, mediationDraft);
        let resolveDirectionsQuestionnaireTaskList;
        if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire') && claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) {
            resolveDirectionsQuestionnaireTaskList = TaskListBuilder.buildDirectionsQuestionnaireSection(draft, claim, directionQuestionnaireDraft);
        }
        const beforeYouStartSectionTasks = (await TaskListBuilder.buildBeforeYouStartSection(draft, claim, momentFactory_1.MomentFactory.currentDateTime())).tasks;
        return [].concat(beforeYouStartSectionTasks, TaskListBuilder.buildRespondToClaimSection(draft, claim).tasks, resolvingClaimTaskList !== undefined ? resolvingClaimTaskList.tasks : [], resolveDirectionsQuestionnaireTaskList !== undefined ? resolveDirectionsQuestionnaireTaskList.tasks : [])
            .filter(item => !item.completed);
    }
}
exports.TaskListBuilder = TaskListBuilder;
