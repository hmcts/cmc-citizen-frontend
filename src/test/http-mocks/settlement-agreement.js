"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status-codes");
const config = require("config");
const mock = require("nock");
const madeBy_1 = require("claims/models/madeBy");
const statementType_1 = require("offer/form/models/statementType");
const serviceBaseURL = config.get('claim-store.url');
const externalIdPattern = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}';
exports.sampleSettlementAgreementOffer = {
    partyStatements: [
        {
            type: statementType_1.StatementType.OFFER.value,
            madeBy: madeBy_1.MadeBy.CLAIMANT.value,
            offer: { content: 'offer text', completionDate: '2017-08-08' }
        },
        {
            type: statementType_1.StatementType.ACCEPTATION.value,
            madeBy: madeBy_1.MadeBy.CLAIMANT.value
        }
    ]
};
exports.sampleSettlementAgreementOfferMadeByCourt = {
    partyStatements: [
        {
            type: statementType_1.StatementType.OFFER.value,
            madeBy: madeBy_1.MadeBy.COURT.value,
            offer: { content: 'offer text', completionDate: '2017-08-08' }
        },
        {
            type: statementType_1.StatementType.ACCEPTATION.value,
            madeBy: madeBy_1.MadeBy.CLAIMANT.value
        }
    ]
};
exports.sampleSettlementAgreementAcceptation = {
    partyStatements: [
        {
            type: statementType_1.StatementType.OFFER.value,
            madeBy: madeBy_1.MadeBy.CLAIMANT.value,
            offer: { content: 'offer text', completionDate: '2017-08-08' }
        },
        {
            type: statementType_1.StatementType.ACCEPTATION.value,
            madeBy: madeBy_1.MadeBy.CLAIMANT.value
        },
        {
            type: statementType_1.StatementType.ACCEPTATION.value,
            madeBy: madeBy_1.MadeBy.DEFENDANT.value
        }
    ]
};
exports.sampleSettlementAgreementRejection = {
    partyStatements: [
        {
            type: statementType_1.StatementType.OFFER.value,
            madeBy: madeBy_1.MadeBy.CLAIMANT.value,
            offer: { content: 'offer text', completionDate: '2017-08-08' }
        },
        {
            type: statementType_1.StatementType.ACCEPTATION.value,
            madeBy: madeBy_1.MadeBy.CLAIMANT.value
        },
        {
            type: statementType_1.StatementType.REJECTION.value,
            madeBy: madeBy_1.MadeBy.DEFENDANT.value
        }
    ]
};
function resolveRejectSettlementAgreement() {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp(`/${externalIdPattern}/settlement-agreement/reject`))
        .reply(HttpStatus.CREATED);
}
exports.resolveRejectSettlementAgreement = resolveRejectSettlementAgreement;
function rejectRejectSettlementAgreement(reason = 'HTTP Error') {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp(`/${externalIdPattern}/settlement-agreement/reject`))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectRejectSettlementAgreement = rejectRejectSettlementAgreement;
function resolveCountersignSettlementAgreement() {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp(`/${externalIdPattern}/settlement-agreement/countersign`))
        .reply(HttpStatus.CREATED);
}
exports.resolveCountersignSettlementAgreement = resolveCountersignSettlementAgreement;
