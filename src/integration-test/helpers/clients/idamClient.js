"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("integration-test/helpers/clients/base/request");
const url = require("url");
const urlencode = require("urlencode");
const baseURL = process.env.IDAM_URL;
const defaultPassword = process.env.SMOKE_TEST_USER_PASSWORD;
const oauth2 = {
    client_id: 'cmc_citizen',
    redirect_uri: `${process.env.CITIZEN_APP_URL}/receiver`,
    client_secret: process.env.OAUTH_CLIENT_SECRET
};
class IdamClient {
    /**
     * Creates user with default password
     *
     * @param {string} email
     * @param {string} userRoleCode
     * @param password the user's password, will use a default if undefined
     * @returns {Promise<void>}
     */
    static createUser(email, userRoleCode, password = process.env.SMOKE_TEST_USER_PASSWORD) {
        const options = {
            method: 'POST',
            uri: `${baseURL}/testing-support/accounts`,
            body: {
                email: email,
                forename: 'John',
                surname: 'Smith',
                levelOfAccess: 0,
                roles: [{ code: userRoleCode }],
                activationDate: '',
                lastAccess: '',
                password: password ? password : defaultPassword
            }
        };
        return request_1.request(options).then(function () {
            return Promise.resolve();
        });
    }
    /**
     * Deletes user with the supplied username
     *
     * @returns {Promise<void>}
     */
    static deleteUser(username) {
        const options = {
            method: 'DELETE',
            uri: `${baseURL}/testing-support/accounts/${username}`
        };
        return request_1.request(options).then(function (resp) {
            return Promise.resolve();
        }).catch(function (err) {
            // tslint:disable-next-line:no-console
            console.log('error deleting user: ' + err);
        });
    }
    /**
     * Deletes users with the supplied usernames
     *
     * @returns {Promise<void>}
     */
    static deleteUsers(usernames) {
        let params = usernames.map(function (s) {
            return `userNames=${encodeURIComponent(s)}`;
        }).join('&');
        const options = {
            method: 'DELETE',
            uri: `${baseURL}/testing-support/test-data?${params}`
        };
        return request_1.request(options).then(function (resp) {
            // tslint:disable-next-line:no-console
            console.log(resp);
            return Promise.resolve();
        }).catch(function (err) {
            // tslint:disable-next-line:no-console
            console.log('error deleting user: ' + err);
        });
    }
    /**
     * Authenticate user
     *
     * @param {string} username the username to authenticate
     * @param password the users password (optional, default will be used if none provided)
     * @returns {Promise<string>} the users access token
     */
    static async authenticateUser(username, password = undefined) {
        const base64Authorisation = IdamClient.toBase64(`${username}:${password || defaultPassword}`);
        const oauth2Params = IdamClient.toUrlParams(oauth2);
        const options = {
            method: 'POST',
            uri: `${baseURL}/oauth2/authorize?response_type=code&${oauth2Params}`,
            headers: {
                Authorization: `Basic ${base64Authorisation}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        return request_1.request(options).then(function (response) {
            return response.code;
        }).then(function (response) {
            return IdamClient.exchangeCode(response).then(function (response) {
                return response;
            });
        });
    }
    static getPin(letterHolderId) {
        const options = {
            uri: `${baseURL}/testing-support/accounts/pin/${letterHolderId}`,
            resolveWithFullResponse: true,
            rejectUnauthorized: false,
            json: false
        };
        return request_1.request(options).then(function (response) {
            return response.body;
        });
    }
    /**
     * Authorizes pin user
     *
     * @param {string} pin
     * @returns {Promise<string>} bearer token
     */
    static async authenticatePinUser(pin) {
        const oauth2Params = IdamClient.toUrlParams(oauth2);
        const options = {
            uri: `${baseURL}/pin?${oauth2Params}`,
            headers: {
                pin,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            simple: false,
            followRedirect: false,
            json: false,
            resolveWithFullResponse: true
        };
        return request_1.request(options).then(function (response) {
            return response;
        }).then(function (response) {
            const code = url.parse(response.headers.location, true).query.code;
            return IdamClient.exchangeCode(code).then(function (response) {
                return response;
            });
        });
    }
    static exchangeCode(code) {
        const options = {
            method: 'POST',
            uri: `${baseURL}/oauth2/token`,
            auth: {
                username: oauth2.client_id,
                password: oauth2.client_secret
            },
            form: { grant_type: 'authorization_code', code: code, redirect_uri: oauth2.redirect_uri }
        };
        return request_1.request(options).then(function (response) {
            return response['access_token'];
        });
    }
    /**
     * Retrieves uses details
     *
     * @param {string} jwt
     * @returns {Promise<User>}
     */
    static retrieveUser(jwt) {
        const options = {
            uri: `${baseURL}/details`,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        };
        return request_1.request(options).then(function (response) {
            return response;
        });
    }
    static toBase64(value) {
        return Buffer.from(value).toString('base64');
    }
    static toUrlParams(value) {
        return Object.entries(value).map(([key, val]) => `${key}=${urlencode(val)}`).join('&');
    }
}
exports.IdamClient = IdamClient;
