"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const paths_1 = require("claimant-response/paths");
const taskListBuilder_1 = require("claimant-response/helpers/taskListBuilder");
const logger = nodejs_logging_1.Logger.getLogger('router/claimant-response/check-and-send');
class AllClaimantResponseTasksCompletedGuard {
    static async requestHandler(req, res, next) {
        try {
            const draft = res.locals.claimantResponseDraft;
            const mediationDraft = res.locals.mediationDraft;
            const directionsQuestionnaireDraft = res.locals.directionsQuestionnaireDraft;
            const claim = res.locals.claim;
            const allTasksCompleted = taskListBuilder_1.TaskListBuilder
                .buildRemainingTasks(draft.document, claim, mediationDraft.document, directionsQuestionnaireDraft.document).length === 0;
            if (allTasksCompleted) {
                return next();
            }
            logger.debug('State guard: check and send page is disabled until all tasks are completed - redirecting to task list');
            res.redirect(paths_1.Paths.incompleteSubmissionPage.evaluateUri({ externalId: claim.externalId }));
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AllClaimantResponseTasksCompletedGuard = AllClaimantResponseTasksCompletedGuard;
