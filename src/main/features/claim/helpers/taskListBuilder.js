"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taskList_1 = require("drafts/tasks/taskList");
const taskListItem_1 = require("drafts/tasks/taskListItem");
const paths_1 = require("claim/paths");
const resolveDispute_1 = require("drafts/tasks/resolveDispute");
const completingYourClaim_1 = require("drafts/tasks/completingYourClaim");
const claimAmount_1 = require("drafts/tasks/claimAmount");
const claimDetails_1 = require("drafts/tasks/claimDetails");
const yourDetails_1 = require("drafts/tasks/yourDetails");
const theirDetails_1 = require("drafts/tasks/theirDetails");
class TaskListBuilder {
    static buildBeforeYouStartSection(draft) {
        return new taskList_1.TaskList('Consider other options', [
            new taskListItem_1.TaskListItem('Resolving this dispute', paths_1.Paths.resolvingThisDisputerPage.uri, resolveDispute_1.ResolveDispute.isCompleted(draft))
        ]);
    }
    static buildPrepareYourClaimSection(draft) {
        return new taskList_1.TaskList('Prepare your claim', [
            new taskListItem_1.TaskListItem('Completing your claim', paths_1.Paths.completingClaimPage.uri, completingYourClaim_1.CompletingYourClaim.isCompleted(draft)),
            new taskListItem_1.TaskListItem('Your details', paths_1.Paths.claimantPartyTypeSelectionPage.uri, yourDetails_1.YourDetails.isCompleted(draft)),
            new taskListItem_1.TaskListItem('Their details', paths_1.Paths.defendantPartyTypeSelectionPage.uri, theirDetails_1.TheirDetails.isCompleted(draft)),
            new taskListItem_1.TaskListItem('Claim amount', paths_1.Paths.amountPage.uri, claimAmount_1.ClaimAmount.isCompleted(draft)),
            new taskListItem_1.TaskListItem('Claim details', paths_1.Paths.reasonPage.uri, claimDetails_1.ClaimDetails.isCompleted(draft))
        ]);
    }
    static buildSubmitSection() {
        return new taskList_1.TaskList('Submit', [
            new taskListItem_1.TaskListItem('Check and submit your claim', paths_1.Paths.checkAndSendPage.uri, false)
        ]);
    }
    static buildRemainingTasks(draft) {
        return [].concat(TaskListBuilder.buildBeforeYouStartSection(draft).tasks, TaskListBuilder.buildPrepareYourClaimSection(draft).tasks)
            .filter(item => !item.completed);
    }
}
exports.TaskListBuilder = TaskListBuilder;
