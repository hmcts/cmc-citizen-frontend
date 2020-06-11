"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const chai_1 = require("chai");
const jwtExtractor_1 = require("idam/jwtExtractor");
const sessionCookieName = config.get('session.cookieName');
describe('Extracting JWT', () => {
    it('should return token from cookie', () => {
        const jwtValue = 'a';
        const req = {
            cookies: {
                [sessionCookieName]: jwtValue
            }
        };
        chai_1.expect(jwtExtractor_1.JwtExtractor.extract(req)).to.equal(jwtValue);
    });
});
