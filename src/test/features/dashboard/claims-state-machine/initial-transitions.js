"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const claim_1 = require("claims/models/claim");
const claim_store_1 = require("test/http-mocks/claim-store");
const initial_transitions_1 = require("dashboard/claims-state-machine/initial-transitions");
const momentFactory_1 = require("shared/momentFactory");
const responseType_1 = require("claims/models/response/responseType");
describe('State Machine for the dashboard status before response', () => {
    describe('given the claim with no response', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(claim_store_1.sampleClaimIssueObj);
            let claimState = initial_transitions_1.initialTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('no-response');
        });
    });
    describe('given the claim with more time requested', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { moreTimeRequested: true }));
            let claimState = initial_transitions_1.initialTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('more-time-requested');
        });
    });
    describe('given the claim with response deadline passed', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { responseDeadline: momentFactory_1.MomentFactory.currentDate().add(-1, 'days') }));
            let claimState = initial_transitions_1.initialTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('no-response-past-deadline');
        });
    });
    describe('given the claim with full defence response', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: { responseType: responseType_1.ResponseType.FULL_DEFENCE } }));
            let claimState = initial_transitions_1.initialTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('full-defence');
        });
    });
    describe('given the claim with full admission response', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: { responseType: responseType_1.ResponseType.FULL_ADMISSION } }));
            let claimState = initial_transitions_1.initialTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('init');
        });
    });
});
