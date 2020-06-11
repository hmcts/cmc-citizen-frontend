"use strict";
/* tslint:disable:no-console */
Object.defineProperty(exports, "__esModule", { value: true });
const idamClient_1 = require("integration-test/helpers/clients/idamClient");
const test_data_1 = require("integration-test/data/test-data");
const userEmails = new test_data_1.UserEmails();
module.exports = {
    teardownAll: function (done) {
        try {
            if (process.env.IDAM_URL) {
                if (process.env.SMOKE_TEST_CITIZEN_USERNAME) {
                    idamClient_1.IdamClient.deleteUser(userEmails.getDefendant());
                    idamClient_1.IdamClient.deleteUser(userEmails.getClaimant());
                    idamClient_1.IdamClient.deleteUsers([userEmails.getClaimant(), userEmails.getDefendant()]);
                }
            }
        }
        catch (error) {
            handleError(error);
        }
    }
};
function handleError(error) {
    console.log('Error during teardown, exiting', error);
    process.exit(1);
}
