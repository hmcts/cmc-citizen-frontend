"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const jwtUtils_1 = require("shared/utils/jwtUtils");
describe('JwtUtils', () => {
    describe('decodePayload', () => {
        it('should throw an error when JWT is malformed', () => {
            chai_1.expect(() => jwtUtils_1.JwtUtils.decodePayload('malformed-jwt')).to.throw(Error, 'Unable to parse JWT token: malformed-jwt');
        });
        it('should throw an error when JWT payload is malformed', () => {
            const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHB9.Q9-gf315saUt007Gau0tBUxevcRwhEckLHzC82EVGIM';
            chai_1.expect(() => jwtUtils_1.JwtUtils.decodePayload(token)).to.throw(Error, `Unable to parse JWT token: ${token}`);
        });
        it('should decode payload when JWT is valid', () => {
            const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpZGFtIiwiaWF0IjoxNDgzMjI4ODAwLCJleHAiOjQxMDI0NDQ4MDAsImF1ZCI6ImNtYyIsInN1YiI6ImNtYyJ9.Q9-gf315saUt007Gau0tBUxevcRwhEckLHzC82EVGIM';
            chai_1.expect(jwtUtils_1.JwtUtils.decodePayload(token)).to.be.deep.equal({
                aud: 'cmc',
                exp: 4102444800,
                iat: 1483228800,
                iss: 'idam',
                sub: 'cmc'
            });
        });
    });
});
