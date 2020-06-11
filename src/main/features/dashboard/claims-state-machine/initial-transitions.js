"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachine = require("@taoqf/javascript-state-machine");
const responseType_1 = require("claims/models/response/responseType");
const isPastDeadline_1 = require("claims/isPastDeadline");
const momentFactory_1 = require("shared/momentFactory");
const _ = require("lodash");
const path = require("path");
const initial_states_1 = require("claims/models/claim-states/initial-states");
const full_defence_states_1 = require("claims/models/claim-states/full-defence-states");
function initialTransitions(claim) {
    return new StateMachine({
        init: 'init',
        transitions: [
            {
                name: 'checkNoResponse',
                from: initial_states_1.InitialStates.INIT,
                to: initial_states_1.InitialStates.NO_RESPONSE
            },
            {
                name: 'checkMoreTimeRequested',
                from: [initial_states_1.InitialStates.INIT, initial_states_1.InitialStates.NO_RESPONSE],
                to: initial_states_1.InitialStates.MORE_TIME_REQUESTED
            },
            {
                name: 'checkCCJEnabled',
                from: [initial_states_1.InitialStates.INIT, initial_states_1.InitialStates.NO_RESPONSE, initial_states_1.InitialStates.MORE_TIME_REQUESTED],
                to: initial_states_1.InitialStates.NO_RESPONSE_PAST_DEADLINE
            },
            {
                name: 'checkIsFullDefence',
                from: [initial_states_1.InitialStates.INIT],
                to: full_defence_states_1.FullDefenceStates.FULL_DEFENCE
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
            onBeforeCheckNoResponse() {
                return !claim.response;
            },
            onBeforeCheckMoreTimeRequested() {
                return this.state !== 'init' && claim.moreTimeRequested;
            },
            onBeforeCheckIsFullDefence() {
                return (claim.response.responseType && claim.response.responseType === responseType_1.ResponseType.FULL_DEFENCE);
            },
            onBeforeCheckCCJEnabled() {
                return this.state !== 'init' && isPastDeadline_1.isPastDeadline(momentFactory_1.MomentFactory.currentDateTime(), claim.responseDeadline);
            },
            findState(currentSate) {
                _.each(currentSate.transitions(), function (eachTransaction) {
                    currentSate[eachTransaction]();
                });
            },
            getTemplate(type) {
                return {
                    dashboard: path.join(__dirname, '../views', 'status', type, this.state + '.njk'),
                    state: this.state
                };
            }
        }
    });
}
exports.initialTransitions = initialTransitions;
