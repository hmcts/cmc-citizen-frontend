"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const serviceAuthToken_1 = require("idam/serviceAuthToken");
describe('ServiceAuthToken', () => {
    describe('hasExpired', () => {
        it('should thrown an error when token is malformed', () => {
            chai_1.expect(() => new serviceAuthToken_1.ServiceAuthToken('malformed-jwt-token').hasExpired()).to.throw(Error, 'Unable to parse JWT token: malformed-jwt-token');
        });
        it('should return true when token has expired', () => {
            const token = jwt.sign({ exp: moment().unix() }, 'secret');
            chai_1.expect(new serviceAuthToken_1.ServiceAuthToken(token).hasExpired()).to.be.true;
        });
        it('should return false when token has not expired yet', () => {
            const token = jwt.sign({ exp: moment().add(1, 'second').unix() }, 'secret');
            chai_1.expect(new serviceAuthToken_1.ServiceAuthToken(token).hasExpired()).to.be.false;
        });
    });
});
