"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_data_1 = require("integration-test/data/test-data");
const claimant_task_list_1 = require("integration-test/tests/citizen/claim/pages/claimant-task-list");
const login_1 = require("integration-test/tests/citizen/home/pages/login");
const loginPage = new login_1.LoginPage();
const taskListPage = new claimant_task_list_1.ClaimantTaskListPage();
const userEmails = new test_data_1.UserEmails();
class UserSteps {
    getClaimantEmail() {
        return userEmails.getClaimant();
    }
    getDefendantEmail() {
        return userEmails.getDefendant();
    }
    login(username) {
        loginPage.open();
        loginPage.login(username, test_data_1.DEFAULT_PASSWORD);
    }
    loginWithPreRegisteredUser(username, password) {
        loginPage.open();
        loginPage.login(username, password);
    }
    selectResolvingThisDispute() {
        taskListPage.selectTaskResolvingThisDispute();
    }
    selectCompletingYourClaim() {
        taskListPage.selectTaskCompletingYourClaim();
    }
    selectYourDetails() {
        taskListPage.selectTaskYourDetails();
    }
    selectTheirDetails() {
        taskListPage.selectTaskTheirDetails();
    }
    selectClaimAmount() {
        taskListPage.selectTaskClaimAmount();
    }
    selectClaimDetails() {
        taskListPage.selectTaskClaimDetails();
    }
    selectCheckAndSubmitYourClaim() {
        taskListPage.selectTaskCheckAndSubmitYourClaim();
    }
}
exports.UserSteps = UserSteps;
