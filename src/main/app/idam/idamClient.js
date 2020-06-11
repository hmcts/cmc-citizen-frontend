"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const otp = require("otp");
const request_1 = require("client/request");
const user_1 = require("idam/user");
const serviceAuthToken_1 = require("idam/serviceAuthToken");
const authToken_1 = require("idam/authToken");
const customEventTracker_1 = require("logging/customEventTracker");
const s2sUrl = config.get('idam.service-2-service-auth.url');
const idamApiUrl = config.get('idam.api.url');
const totpSecret = config.get('secrets.cmc.cmc-s2s-secret');
const microserviceName = config.get('idam.service-2-service-auth.microservice');
class ServiceAuthRequest {
    constructor(microservice, oneTimePassword) {
        this.microservice = microservice;
        this.oneTimePassword = oneTimePassword;
        this.microservice = microservice;
        this.oneTimePassword = oneTimePassword;
    }
}
class IdamClient {
    static retrieveServiceToken() {
        const oneTimePassword = otp({ secret: totpSecret }).totp();
        return request_1.request.post({
            uri: `${s2sUrl}/lease`,
            body: new ServiceAuthRequest(microserviceName, oneTimePassword)
        }).then(token => {
            return new serviceAuthToken_1.ServiceAuthToken(token);
        });
    }
    static retrieveUserFor(jwt) {
        return request_1.request.get({
            uri: `${idamApiUrl}/details`,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }).then((response) => {
            return new user_1.User(response.id.toString(), response.email, response.forename, response.surname, response.roles, response.group, jwt);
        });
    }
    static exchangeCode(code, redirectUri) {
        const clientId = config.get('oauth.clientId');
        const clientSecret = config.get('secrets.cmc.citizen-oauth-client-secret');
        const url = `${config.get('idam.api.url')}/oauth2/token`;
        return request_1.request.post({
            uri: url,
            auth: {
                username: clientId,
                password: clientSecret
            },
            form: { grant_type: 'authorization_code', code: code, redirect_uri: redirectUri }
        })
            .then((response) => {
            return new authToken_1.AuthToken(response.access_token, response.token_type, response.expires_in);
        })
            .catch((error) => {
            customEventTracker_1.trackCustomEvent('failed to exchange code', {
                errorValue: {
                    message: error.name,
                    code: error.statusCode
                }
            });
            throw error;
        });
    }
    static invalidateSession(jwt, bearerToken) {
        if (!jwt) {
            return Promise.reject(new Error('JWT is required'));
        }
        const options = {
            method: 'DELETE',
            uri: `${config.get('idam.api.url')}/session/${jwt}`,
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        };
        request_1.request(options);
    }
}
exports.IdamClient = IdamClient;
