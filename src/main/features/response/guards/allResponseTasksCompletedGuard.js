"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("response/paths");
const taskListBuilder_1 = require("response/helpers/taskListBuilder");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const logger = nodejs_logging_1.Logger.getLogger('router/response/check-and-send');
class AllResponseTasksCompletedGuard {
    static async requestHandler(req, res, next) {
        try {
            const claim = res.locals.claim;
            const draft = res.locals.responseDraft;
            const mediationDraft = res.locals.mediationDraft;
            const directionQuestionnaireDraft = res.locals.directionsQuestionnaireDraft;
            const allTasksCompleted = (await taskListBuilder_1.TaskListBuilder
                .buildRemainingTasks(draft.document, claim, mediationDraft.document, directionQuestionnaireDraft.document)).length === 0;
            if (allTasksCompleted) {
                return next();
            }
            logger.debug('State guard: claim check and send page is disabled until all tasks are completed - redirecting to task list');
            res.redirect(paths_1.Paths.incompleteSubmissionPage.evaluateUri({ externalId: claim.externalId }));
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AllResponseTasksCompletedGuard = AllResponseTasksCompletedGuard;
