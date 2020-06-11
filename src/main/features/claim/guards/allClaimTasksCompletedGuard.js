"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("claim/paths");
const taskListBuilder_1 = require("claim/helpers/taskListBuilder");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const logger = nodejs_logging_1.Logger.getLogger('claim/guards/allTasksCompletedGuard');
class AllClaimTasksCompletedGuard {
    static requestHandler(req, res, next) {
        const draft = res.locals.claimDraft;
        const allTasksCompleted = taskListBuilder_1.TaskListBuilder.buildRemainingTasks(draft.document).length === 0;
        if (allTasksCompleted) {
            return next();
        }
        logger.debug('State guard: claim check and send page is disabled until all tasks are completed ' +
            '- redirecting to incomplete submission');
        res.redirect(paths_1.Paths.incompleteSubmissionPage.uri);
    }
}
exports.AllClaimTasksCompletedGuard = AllClaimTasksCompletedGuard;
