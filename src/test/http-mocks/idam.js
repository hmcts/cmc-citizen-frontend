"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const mock = require("nock");
const HttpStatus = require("http-status-codes");
const apiServiceBaseURL = config.get('idam.api.url');
const s2sAuthServiceBaseURL = config.get('idam.service-2-service-auth.url');
exports.defaultAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpZGFtIiwiaWF0IjoxNDgzMjI4ODAwLCJleHAiOjQxMDI0NDQ4MDAsImF1ZCI6ImNtYyIsInN1YiI6ImNtYyJ9.Q9-gf315saUt007Gau0tBUxevcRwhEckLHzC82EVGIM'; // valid until 1st Jan 2100
function resolveRetrieveUserFor(id, ...roles) {
    return mock(apiServiceBaseURL)
        .get('/details')
        .reply(HttpStatus.OK, { id: id, roles: roles, email: 'user@example.com' });
}
exports.resolveRetrieveUserFor = resolveRetrieveUserFor;
function resolveExchangeCode(token) {
    mock(apiServiceBaseURL)
        .post(new RegExp('/oauth2/token.*'))
        .reply(HttpStatus.OK, {
        access_token: token,
        token_type: 'Bearer',
        expires_in: 28800
    });
}
exports.resolveExchangeCode = resolveExchangeCode;
function rejectExchangeCode(token) {
    mock(apiServiceBaseURL)
        .post(new RegExp('/oauth2/token.*'))
        .reply(HttpStatus.UNAUTHORIZED);
}
exports.rejectExchangeCode = rejectExchangeCode;
function resolveInvalidateSession(token) {
    mock(apiServiceBaseURL)
        .delete(`/session/${token}`)
        .reply(HttpStatus.OK);
}
exports.resolveInvalidateSession = resolveInvalidateSession;
function rejectInvalidateSession(token = exports.defaultAuthToken, reason = 'HTTP error') {
    mock(apiServiceBaseURL)
        .delete(`/session/${token}`)
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectInvalidateSession = rejectInvalidateSession;
function rejectRetrieveUserFor(reason) {
    return mock(apiServiceBaseURL)
        .get('/details')
        .reply(HttpStatus.FORBIDDEN, reason);
}
exports.rejectRetrieveUserFor = rejectRetrieveUserFor;
function resolveRetrieveServiceToken(token = exports.defaultAuthToken) {
    return mock(s2sAuthServiceBaseURL)
        .post('/lease')
        .reply(HttpStatus.OK, token);
}
exports.resolveRetrieveServiceToken = resolveRetrieveServiceToken;
function rejectRetrieveServiceToken(reason = 'HTTP error') {
    return mock(s2sAuthServiceBaseURL)
        .post('/lease')
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectRetrieveServiceToken = rejectRetrieveServiceToken;
