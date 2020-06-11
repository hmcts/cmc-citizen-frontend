"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai = require("chai");
const spies = require("sinon-chai");
const sinon = require("sinon");
const serviceAuthToken_1 = require("idam/serviceAuthToken");
const idamClient_1 = require("idam/idamClient");
const requireUtils_1 = require("test/requireUtils");
requireUtils_1.RequireUtils.removeModuleFromCache('common/security/serviceTokenFactoryImpl');
const serviceTokenFactoryImpl_1 = require("shared/security/serviceTokenFactoryImpl");
chai.use(spies);
const expect = chai.expect;
const serviceAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpZGFtIiwiaWF0IjoxNDgzMjI4ODAwLCJleHAiOjQxMDI0NDQ4MDAsImF1ZCI6ImNtYyIsInN1YiI6ImNtYyJ9.Q9-gf315saUt007Gau0tBUxevcRwhEckLHzC82EVGIM'; // valid until 1st Jan 2100
async function returnServiceAuthToken() {
    return new serviceAuthToken_1.ServiceAuthToken(serviceAuthToken);
}
describe('ServiceAuthTokenFactory', () => {
    let retrieveServiceTokenFn;
    beforeEach(() => {
        retrieveServiceTokenFn = sinon.stub(idamClient_1.IdamClient, 'retrieveServiceToken')
            .onFirstCall().returns(returnServiceAuthToken())
            .onSecondCall().throws('Unexpected error');
    });
    afterEach(() => {
        retrieveServiceTokenFn.restore();
    });
    it('should retrieve token from the API for the first time', async () => {
        expect(await new serviceTokenFactoryImpl_1.ServiceAuthTokenFactoryImpl().get()).to.be.deep.equal(new serviceAuthToken_1.ServiceAuthToken(serviceAuthToken));
        expect(retrieveServiceTokenFn).to.be.called;
    });
    it('should retrieve token from the cache for the second time', async () => {
        expect(await new serviceTokenFactoryImpl_1.ServiceAuthTokenFactoryImpl().get()).to.be.deep.equal(new serviceAuthToken_1.ServiceAuthToken(serviceAuthToken));
        expect(retrieveServiceTokenFn).to.not.be.called;
    });
});
