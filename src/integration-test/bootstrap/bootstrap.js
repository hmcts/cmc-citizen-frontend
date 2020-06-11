"use strict";
/* tslint:disable:no-console */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const request_1 = require("integration-test/helpers/clients/base/request");
const idamClient_1 = require("integration-test/helpers/clients/idamClient");
const claimStoreClient_1 = require("integration-test/helpers/clients/claimStoreClient");
const test_data_1 = require("integration-test/data/test-data");
const citizenAppURL = process.env.CITIZEN_APP_URL;
const userEmails = new test_data_1.UserEmails();
class Client {
    static checkHealth(appURL) {
        return request_1.request.get({
            uri: `${appURL}/health`,
            resolveWithFullResponse: true,
            rejectUnauthorized: false,
            ca: fs.readFileSync('./src/integration-test/resources/localhost.crt')
        }).catch((error) => {
            return error;
        });
    }
}
// TS:no-
function logStartupProblem(response) {
    if (response.body) {
        console.log(response.body);
    }
    else if (response.message) {
        console.log(response.message);
    }
}
function handleError(error) {
    console.log('Error during bootstrap, exiting', error);
    process.exit(1);
}
function sleepFor(sleepDurationInSeconds) {
    console.log(`Sleeping for ${sleepDurationInSeconds} seconds`);
    return new Promise((resolve) => {
        setTimeout(resolve, sleepDurationInSeconds * 1000);
    });
}
async function waitTillHealthy(appURL) {
    const maxTries = 36;
    const sleepInterval = 10;
    console.log(`Verifying health for ${appURL}`);
    let response;
    for (let i = 0; i < maxTries; i++) {
        response = await Client.checkHealth(appURL);
        console.log(`Attempt ${i + 1} - received status code ${response.statusCode} from ${appURL}/health`);
        if (response.statusCode === 200) {
            console.log(`Service ${appURL} became ready after ${sleepInterval * i} seconds`);
            console.log(`FEATURE_ADMISSIONS=${process.env.FEATURE_ADMISSIONS}`);
            console.log(`FEATURE_MEDIATION=${process.env.FEATURE_MEDIATION}`);
            console.log(`FEATURE_DIRECTIONS_QUESTIONNAIRE=${process.env.FEATURE_DIRECTIONS_QUESTIONNAIRE}`);
            console.log(`FEATURE_INVERSION_OF_CONTROL=${process.env.FEATURE_INVERSION_OF_CONTROL}`);
            return Promise.resolve();
        }
        else {
            logStartupProblem(response);
            await sleepFor(sleepInterval);
        }
    }
    const error = new Error(`Failed to successfully contact ${appURL} after ${maxTries} attempts`);
    error.message = '' + response;
    return Promise.reject(error);
}
async function createSmokeTestsUserIfDoesntExist(username, userRole, password) {
    let bearerToken;
    try {
        bearerToken = await idamClient_1.IdamClient.authenticateUser(username, password);
    }
    catch (_a) {
        if (!(username || password)) {
            return;
        }
        await idamClient_1.IdamClient.createUser(username, userRole, password);
        bearerToken = await idamClient_1.IdamClient.authenticateUser(username, password);
    }
    try {
        await claimStoreClient_1.ClaimStoreClient.addRoleToUser(bearerToken, 'cmc-new-features-consent-given');
    }
    catch (err) {
        if (err && err.statusCode === 409) {
            console.log('User already has user consent role');
            return;
        }
        console.log('Failed to add user consent role');
        throw err;
    }
}
module.exports = {
    bootstrapAll: function (done) {
        try {
            waitTillHealthy(citizenAppURL);
            if (process.env.IDAM_URL) {
                if (process.env.SMOKE_TEST_CITIZEN_USERNAME) {
                    createSmokeTestsUserIfDoesntExist(process.env.SMOKE_TEST_CITIZEN_USERNAME, 'citizen', process.env.SMOKE_TEST_USER_PASSWORD);
                    createSmokeTestsUserIfDoesntExist(userEmails.getDefendant(), 'citizen', process.env.SMOKE_TEST_USER_PASSWORD);
                    createSmokeTestsUserIfDoesntExist(userEmails.getClaimant(), 'citizen', process.env.SMOKE_TEST_USER_PASSWORD);
                }
            }
        }
        catch (error) {
            handleError(error);
        }
        done();
    }
};
