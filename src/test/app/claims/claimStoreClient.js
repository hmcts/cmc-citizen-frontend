"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mock = require("nock");
const request_1 = require("client/request");
const HttpStatus = require("http-status-codes");
const claimDraft_1 = require("test/data/draft/claimDraft");
const claimData_1 = require("test/data/entity/claimData");
const claimStoreClient_1 = require("claims/claimStoreClient");
const draft_store_client_1 = require("@hmcts/draft-store-client");
const draftClaim_1 = require("drafts/models/draftClaim");
const claim_1 = require("claims/models/claim");
const claimData_2 = require("claims/models/claimData");
const interestType_1 = require("claims/models/interestType");
const moment = require("moment");
const draft_store_1 = require("test/http-mocks/draft-store");
const reviewOrder_1 = require("claims/models/reviewOrder");
const ordersDraft_1 = require("orders/draft/ordersDraft");
const claim_store_1 = require("test/http-mocks/claim-store");
const madeBy_1 = require("claims/models/madeBy");
const claimDraft = new draft_store_client_1.Draft(123, 'claim', new draftClaim_1.DraftClaim().deserialize(claimDraft_1.claimDraft), moment(), moment());
const claimantId = 123456;
const returnedClaim = {
    submitterId: claimantId,
    createdAt: moment().toISOString(),
    responseDeadline: moment().toISOString(),
    issuedOn: moment().toISOString(),
    claim: Object.assign(Object.assign({}, claimData_1.claimData), { interest: { type: interestType_1.InterestType.NO_INTEREST, interestDate: undefined } })
};
const expectedClaimData = Object.assign(Object.assign({}, claimData_1.claimData), { interest: { type: interestType_1.InterestType.NO_INTEREST }, interestDate: undefined });
const claimant = {
    id: claimantId,
    bearerToken: 'SuperSecretToken'
};
const paymentResponse = {
    nextUrl: 'http://localhost/payment-page'
};
describe('ClaimStoreClient', () => {
    context('timeouts and retries handling', () => {
        const requestDelayInMillis = 500;
        const retryAttempts = 3;
        const retryingRequest = request_1.request.defaults({
            retryDelay: requestDelayInMillis,
            maxAttempts: retryAttempts
        });
        const claimStoreClient = new claimStoreClient_1.ClaimStoreClient(retryingRequest);
        describe('saveClaim', () => {
            function mockSuccessOnFirstSaveAttempt() {
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .post(`/${claimant.id}`)
                    .reply(HttpStatus.OK, returnedClaim);
            }
            it('should retrieve a claim that was successfully saved on first attempt with feature toggles', async () => {
                mockSuccessOnFirstSaveAttempt();
                const claim = await claimStoreClient.saveClaim(claimDraft, claimant, 'admissions');
                chai_1.expect(claim.claimData).to.deep.equal(new claimData_2.ClaimData().deserialize(expectedClaimData));
            });
            it('should retrieve a claim that was successfully saved on first attempt without feature toggles', async () => {
                mockSuccessOnFirstSaveAttempt();
                const claim = await claimStoreClient.saveClaim(claimDraft, claimant);
                chai_1.expect(claim.claimData).to.deep.equal(new claimData_2.ClaimData().deserialize(expectedClaimData));
            });
            function mockTimeoutOnFirstSaveAttemptAndConflictOnSecondOne() {
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .post(`/${claimant.id}`)
                    .socketDelay(requestDelayInMillis + 10);
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .post(`/${claimant.id}`)
                    .reply(HttpStatus.CONFLICT, `Duplicate claim for external id ${claimDraft_1.claimDraft.externalId}`);
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .get(`/${claimDraft_1.claimDraft.externalId}`)
                    .reply(HttpStatus.OK, returnedClaim);
            }
            it('should retrieve claim saved on first attempt that timed out and caused a 409 on retry', async () => {
                resolveLinkDefendant();
                mockTimeoutOnFirstSaveAttemptAndConflictOnSecondOne();
                const claim = await claimStoreClient.saveClaim(claimDraft, claimant, 'admissions');
                chai_1.expect(claim.claimData).to.deep.equal(new claimData_2.ClaimData().deserialize(expectedClaimData));
            });
            function resolveLinkDefendant() {
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .put('/defendant/link')
                    .reply(HttpStatus.OK);
            }
            function mockInternalServerErrorOnAllAttempts() {
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .post(`/${claimant.id}`)
                    .times(retryAttempts)
                    .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
            }
            it('should propagate error responses other than 409', async () => {
                mockInternalServerErrorOnAllAttempts();
                try {
                    await claimStoreClient.saveClaim(claimDraft, claimant, 'admissions');
                }
                catch (err) {
                    chai_1.expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
                    chai_1.expect(err.error).to.equal('An unexpected error occurred');
                    return;
                }
                chai_1.expect.fail(); // Exception should have been thrown due to 500 response code
            });
        });
        describe('saveOrder', () => {
            const expectedData = {
                reason: 'some reason',
                requestedBy: madeBy_1.MadeBy.CLAIMANT,
                requestedAt: '2017-07-25T22:45:51.785'
            };
            const ordersDraft = new ordersDraft_1.OrdersDraft().deserialize(draft_store_1.sampleOrdersDraftObj);
            it('should retrieve an order that was successfully saved', async () => {
                claim_store_1.resolveSaveOrder();
                const claim = await claimStoreClient.saveOrder(ordersDraft, new claim_1.Claim().deserialize(claim_store_1.sampleClaimIssueObj), claimant);
                chai_1.expect(claim.reviewOrder).to.deep.equal(new reviewOrder_1.ReviewOrder().deserialize(expectedData));
            });
            function mockInternalServerErrorOnAllAttempts() {
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .put(`/${ordersDraft.externalId}/review-order`)
                    .times(retryAttempts)
                    .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
            }
            it('should propagate error responses other than 409 for orders', async () => {
                mockInternalServerErrorOnAllAttempts();
                try {
                    await claimStoreClient.saveOrder(ordersDraft, new claim_1.Claim().deserialize(claim_store_1.sampleClaimIssueObj), claimant);
                }
                catch (err) {
                    chai_1.expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
                    chai_1.expect(err.error).to.equal('An unexpected error occurred');
                    return;
                }
                chai_1.expect.fail(); // Exception should have been thrown due to 500 response code
            });
        });
        describe('Initiate citizen payment', async () => {
            function resolveInitiatePayment() {
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .post(`/initiate-citizen-payment`)
                    .reply(HttpStatus.OK, paymentResponse);
            }
            it('should return nextUrl on successful initiate payment call', async () => {
                resolveInitiatePayment();
                const returnedUrl = await claimStoreClient.initiatePayment(claimDraft, claimant);
                chai_1.expect(returnedUrl).to.deep.equal(paymentResponse.nextUrl);
            });
            function mockInternalServerErrorOnInitiatePayment() {
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .post(`/initiate-citizen-payment`)
                    .times(retryAttempts)
                    .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
            }
            it('should propagate error responses', async () => {
                mockInternalServerErrorOnInitiatePayment();
                try {
                    await claimStoreClient.initiatePayment(claimDraft, claimant);
                }
                catch (err) {
                    chai_1.expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
                    chai_1.expect(err.error).to.equal('An unexpected error occurred');
                    return;
                }
                chai_1.expect.fail(); // Exception should have been thrown due to 500 response code
            });
        });
        describe('Resume citizen payment', async () => {
            function resolveInitiatePayment() {
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .put(`/resume-citizen-payment`)
                    .reply(HttpStatus.OK, paymentResponse);
            }
            it('should return nextUrl on successful resume payment call', async () => {
                resolveInitiatePayment();
                const returnedUrl = await claimStoreClient.resumePayment(claimDraft, claimant);
                chai_1.expect(returnedUrl).to.deep.equal(paymentResponse.nextUrl);
            });
            function mockInternalServerErrorOnResumePayment() {
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .put(`/resume-citizen-payment`)
                    .times(retryAttempts)
                    .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
            }
            it('should propagate error responses', async () => {
                mockInternalServerErrorOnResumePayment();
                try {
                    await claimStoreClient.resumePayment(claimDraft, claimant);
                }
                catch (err) {
                    chai_1.expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
                    chai_1.expect(err.error).to.equal('An unexpected error occurred');
                    return;
                }
                chai_1.expect.fail(); // Exception should have been thrown due to 500 response code
            });
        });
        describe('createCitizenClaim', async () => {
            function mockCreateCitizenClaimCall() {
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .put(`/create-citizen-claim`)
                    .reply(HttpStatus.OK, returnedClaim);
            }
            it('should return a claim that was successfully saved', async () => {
                mockCreateCitizenClaimCall();
                const claim = await claimStoreClient.createCitizenClaim(claimDraft, claimant, 'admissions');
                chai_1.expect(claim.claimData).to.deep.equal(new claimData_2.ClaimData().deserialize(expectedClaimData));
            });
            function mockInternalServerErrorOnAllAttempts() {
                mock(`${claimStoreClient_1.claimStoreApiUrl}`)
                    .put(`/create-citizen-claim`)
                    .times(retryAttempts)
                    .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
            }
            it('should propagate error responses', async () => {
                mockInternalServerErrorOnAllAttempts();
                try {
                    await claimStoreClient.createCitizenClaim(claimDraft, claimant, 'admissions');
                }
                catch (err) {
                    chai_1.expect(err.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
                    chai_1.expect(err.error).to.equal('An unexpected error occurred');
                    return;
                }
                chai_1.expect.fail(); // Exception should have been thrown due to 500 response code
            });
        });
    });
});
