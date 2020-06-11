"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const sinon = require("sinon");
const spies = require("sinon-chai");
const sinon_express_mock_1 = require("sinon-express-mock");
const user_1 = require("idam/user");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const hooks_1 = require("test/hooks");
const claimantResponseGuard_1 = require("claimant-response/guards/claimantResponseGuard");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
chai.use(spies);
describe('Claimant Response guard', () => {
    hooks_1.attachDefaultHooks();
    const next = (e) => {
        return void 0;
    };
    beforeEach(() => {
        const claim = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { claimantResponse: { type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION, amountPaid: 100 } });
        sinon_express_mock_1.mockRes.locals = {
            claim: claim,
            user: new user_1.User('1', 'user@example.com', 'John', 'Smith', [], 'citizen', '')
        };
        sinon_express_mock_1.mockRes.redirect = sinon.spy((location) => {
            return void 0;
        });
    });
    context('When the claim has a claimant response', () => {
        it('should not pass the request through', async () => {
            const spy = sinon.spy(next);
            await claimantResponseGuard_1.ClaimantResponseGuard.checkClaimantResponseDoesNotExist()(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, spy);
            chai.expect(spy).to.have.not.been.called;
        });
    });
    context('When the claim has no claimant response', () => {
        beforeEach(() => {
            sinon_express_mock_1.mockRes.locals.claim.claimantResponse = undefined;
        });
        it('should pass the request through', async () => {
            const spy = sinon.spy(next);
            await claimantResponseGuard_1.ClaimantResponseGuard.checkClaimantResponseDoesNotExist()(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, spy);
            chai.expect(spy).to.have.been.called;
        });
    });
});
