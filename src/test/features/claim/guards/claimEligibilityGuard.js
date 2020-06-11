"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const sinon = require("sinon");
const spies = require("sinon-chai");
const sinon_express_mock_1 = require("sinon-express-mock");
const moment = require("moment");
const paths_1 = require("eligibility/paths");
const claimEligibilityGuard_1 = require("claim/guards/claimEligibilityGuard");
const store_1 = require("eligibility/store");
const eligibility_1 = require("test/data/cookie/eligibility");
const user_1 = require("idam/user");
const draft_store_client_1 = require("@hmcts/draft-store-client");
const draftClaim_1 = require("drafts/models/draftClaim");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const hooks_1 = require("test/hooks");
chai.use(spies);
describe('Claim eligibility guard', () => {
    hooks_1.attachDefaultHooks();
    let claimDraft;
    const next = (e) => {
        return void 0;
    };
    beforeEach(() => {
        claimDraft = new draft_store_client_1.Draft(100, 'claim', new draftClaim_1.DraftClaim(), moment(), moment());
        sinon_express_mock_1.mockRes.locals = {
            claimDraft: claimDraft,
            user: new user_1.User('1', 'user@example.com', 'John', 'Smith', [], 'citizen', '')
        };
        sinon_express_mock_1.mockRes.redirect = sinon.spy((location) => {
            return void 0;
        });
    });
    context('when draft is marked as eligible', () => {
        beforeEach(() => {
            claimDraft.document.eligibility = true;
            sinon_express_mock_1.mockReq.cookies = {};
        });
        it('should pass request through', async () => {
            const spy = sinon.spy(next);
            await claimEligibilityGuard_1.ClaimEligibilityGuard.requestHandler()(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, spy);
            chai.expect(spy).to.have.been.called;
        });
    });
    context('when draft is not marked as eligible but eligibility cookie exists', () => {
        beforeEach(() => {
            claimDraft.document.eligibility = false;
            sinon_express_mock_1.mockReq.cookies = {
                [store_1.cookieName]: eligibility_1.eligibleCookie
            };
            idamServiceMock.resolveRetrieveServiceToken();
            draftStoreServiceMock.resolveUpdate();
        });
        it('should mark draft as eligible', async () => {
            await claimEligibilityGuard_1.ClaimEligibilityGuard.requestHandler()(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, next);
            chai.expect(claimDraft.document.eligibility).to.be.equal(true);
        });
        it('should pass request through', async () => {
            const spy = sinon.spy(next);
            await claimEligibilityGuard_1.ClaimEligibilityGuard.requestHandler()(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, spy);
            chai.expect(spy).to.have.been.called;
        });
    });
    context('when draft is not marked as eligible and eligibility cookie does not exist', () => {
        beforeEach(() => {
            claimDraft.document.eligibility = false;
            sinon_express_mock_1.mockReq.cookies = {};
        });
        it('should redirect to eligibility page', async () => {
            await claimEligibilityGuard_1.ClaimEligibilityGuard.requestHandler()(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, next);
            chai.expect(sinon_express_mock_1.mockRes.redirect).to.have.been.calledWith(paths_1.Paths.startPage.uri);
        });
    });
});
