"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachine = require("@taoqf/javascript-state-machine");
const freeMediation_1 = require("forms/models/freeMediation");
const defenceType_1 = require("claims/models/response/defenceType");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const _ = require("lodash");
const path = require("path");
const full_defence_states_1 = require("claims/models/claim-states/full-defence-states");
function fullDefenceTransitions(claim) {
    return new StateMachine({
        init: full_defence_states_1.FullDefenceStates.FULL_DEFENCE,
        transitions: [
            {
                name: 'checkAlreadyPaid',
                from: full_defence_states_1.FullDefenceStates.FULL_DEFENCE,
                to: full_defence_states_1.FullDefenceStates.FD_ALREADY_PAID
            },
            {
                name: 'checkAlreadyPaidResponse',
                from: [full_defence_states_1.FullDefenceStates.FULL_DEFENCE, full_defence_states_1.FullDefenceStates.FD_ALREADY_PAID],
                to: full_defence_states_1.FullDefenceStates.FD_ALREADY_PAID_RESPONSE
            },
            {
                name: 'checkAlreadyPaidAccept',
                from: [full_defence_states_1.FullDefenceStates.FULL_DEFENCE, full_defence_states_1.FullDefenceStates.FD_ALREADY_PAID_RESPONSE],
                to: full_defence_states_1.FullDefenceStates.FD_ALREADY_PAID_ACCEPT
            },
            {
                name: 'checkAlreadyPaidReject',
                from: [full_defence_states_1.FullDefenceStates.FULL_DEFENCE, full_defence_states_1.FullDefenceStates.FD_ALREADY_PAID_RESPONSE],
                to: full_defence_states_1.FullDefenceStates.FD_ALREADY_PAID_REJECT
            },
            {
                name: 'checkRejectWithMediation',
                from: full_defence_states_1.FullDefenceStates.FULL_DEFENCE,
                to: full_defence_states_1.FullDefenceStates.FD_REJECT_WITH_MEDIATION
            },
            {
                name: 'checkRejectWithoutMediation',
                from: full_defence_states_1.FullDefenceStates.FULL_DEFENCE,
                to: full_defence_states_1.FullDefenceStates.FD_REJECT_WITHOUT_MEDIATION
            },
            {
                name: 'checkSettlementOfferWithMediation',
                from: [full_defence_states_1.FullDefenceStates.FULL_DEFENCE, full_defence_states_1.FullDefenceStates.FD_REJECT_WITH_MEDIATION],
                to: full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_WITH_MEDIATION
            },
            {
                name: 'checkSettlementOfferWithoutMediation',
                from: [full_defence_states_1.FullDefenceStates.FULL_DEFENCE, full_defence_states_1.FullDefenceStates.FD_REJECT_WITHOUT_MEDIATION],
                to: full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_WITHOUT_MEDIATION
            },
            {
                name: 'checkSettlementOfferRejectWithMediation',
                from: [full_defence_states_1.FullDefenceStates.FULL_DEFENCE, full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_WITH_MEDIATION],
                to: full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_REJECT_WITH_MEDIATION
            },
            {
                name: 'checkSettlementOfferRejectWithoutMediation',
                from: [full_defence_states_1.FullDefenceStates.FULL_DEFENCE, full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_WITHOUT_MEDIATION],
                to: full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_REJECT_WITHOUT_MEDIATION
            },
            {
                name: 'checkSettlementOfferAcceptWithMediation',
                from: [full_defence_states_1.FullDefenceStates.FULL_DEFENCE, full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_WITH_MEDIATION],
                to: full_defence_states_1.FullDefenceStates.FD_MADE_AGREEMENT_WITH_MEDIATION
            },
            {
                name: 'checkSettlementOfferAcceptWithoutMediation',
                from: [full_defence_states_1.FullDefenceStates.FULL_DEFENCE, full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_WITHOUT_MEDIATION],
                to: full_defence_states_1.FullDefenceStates.FD_MADE_AGREEMENT_WITHOUT_MEDIATION
            },
            {
                name: 'checkSettledByAgreement',
                from: [full_defence_states_1.FullDefenceStates.FULL_DEFENCE, full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_WITH_MEDIATION, full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_WITHOUT_MEDIATION, full_defence_states_1.FullDefenceStates.FD_MADE_AGREEMENT_WITH_MEDIATION, full_defence_states_1.FullDefenceStates.FD_MADE_AGREEMENT_WITHOUT_MEDIATION],
                to: full_defence_states_1.FullDefenceStates.FD_SETTLED_WITH_AGREEMENT
            },
            {
                name: 'checkSettledByAgreement',
                from: [full_defence_states_1.FullDefenceStates.FULL_DEFENCE, full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_REJECT_WITHOUT_MEDIATION],
                to: full_defence_states_1.FullDefenceStates.FD_SETTLED
            }
        ],
        data: {
            log: {
                invalidTransitions: []
            }
        },
        methods: {
            onInvalidTransition(transition, from, to) {
                this.log.invalidTransitions.push({ transition: transition, from: from, to: to });
            },
            onBeforeCheckAlreadyPaid() {
                return claim.response.defenceType === defenceType_1.DefenceType.ALREADY_PAID;
            },
            onBeforeCheckRejectWithoutMediation() {
                return claim.response.freeMediation === freeMediation_1.FreeMediationOption.NO;
            },
            onBeforeCheckRejectWithMediation() {
                return claim.response.freeMediation === freeMediation_1.FreeMediationOption.YES;
            },
            onBeforeCheckAlreadyPaidResponse() {
                return !!claim.claimantResponse
                    && !!claim.claimantResponse.type
                    && !!claim.response.paymentDeclaration
                    && (claim.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.REJECTION || claim.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.ACCEPTATION);
            },
            onBeforeCheckAlreadyPaidAccept() {
                return this.state === full_defence_states_1.FullDefenceStates.FD_ALREADY_PAID_RESPONSE && claim.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.ACCEPTATION;
            },
            onBeforeCheckAlreadyPaidReject() {
                return this.state === full_defence_states_1.FullDefenceStates.FD_ALREADY_PAID_RESPONSE && claim.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.REJECTION;
            },
            onBeforeCheckSettlementOfferWithMediation() {
                return this.state === full_defence_states_1.FullDefenceStates.FD_REJECT_WITH_MEDIATION && !!claim.settlement && !claim.settlement.isThroughAdmissions() && !this.moneyReceivedOn;
            },
            onBeforeCheckSettlementOfferWithoutMediation() {
                return this.state === full_defence_states_1.FullDefenceStates.FD_REJECT_WITHOUT_MEDIATION && !!claim.settlement && !claim.settlement.isThroughAdmissions() && !this.moneyReceivedOn;
            },
            onBeforeCheckSettlementOfferRejectWithMediation() {
                return this.state === full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_WITH_MEDIATION && claim.settlement.isOfferRejected() && !claim.settlementReachedAt;
            },
            onBeforeCheckSettlementOfferRejectWithoutMediation() {
                return this.state === full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_WITHOUT_MEDIATION && claim.settlement.isOfferRejected() && !claim.settlementReachedAt;
            },
            onBeforeCheckSettlementOfferAcceptWithMediation() {
                return this.state === full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_WITH_MEDIATION && claim.settlement.isOfferAccepted() && !claim.settlementReachedAt;
            },
            onBeforeCheckSettlementOfferAcceptWithoutMediation() {
                return this.state === full_defence_states_1.FullDefenceStates.FD_SETTLEMENT_OFFER_WITHOUT_MEDIATION && claim.settlement.isOfferAccepted() && !claim.settlementReachedAt;
            },
            onBeforeCheckSettledByAgreement() {
                return this.state !== full_defence_states_1.FullDefenceStates.FULL_DEFENCE && claim.settlement && !!claim.settlementReachedAt;
            },
            findState(currentSate) {
                _.each(currentSate.transitions(), function (eachTransaction) {
                    currentSate[eachTransaction]();
                });
            },
            getTemplate(type) {
                return {
                    dashboard: path.join(__dirname, '../views', 'status', type, full_defence_states_1.FullDefenceStates.FULL_DEFENCE, this.state + '.njk'),
                    state: this.state
                };
            }
        }
    });
}
exports.fullDefenceTransitions = fullDefenceTransitions;
