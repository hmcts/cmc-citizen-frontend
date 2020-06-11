"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const partyStatement_1 = require("claims/models/partyStatement");
const statementType_1 = require("offer/form/models/statementType");
const madeBy_1 = require("claims/models/madeBy");
class Settlement {
    constructor(partyStatements) {
        this.partyStatements = partyStatements;
    }
    deserialize(input) {
        if (input) {
            this.partyStatements = this.deserializePartyStatement(input.partyStatements);
        }
        return this;
    }
    getDefendantOffer() {
        if (!this.partyStatements) {
            return undefined;
        }
        const partyStatement = this.partyStatements
            .filter(this.isOfferMadeByDefendant)
            .pop();
        return partyStatement ? partyStatement.offer : undefined;
    }
    getLastOffer() {
        const partyStatement = this.getOfferedPartyStatement();
        return partyStatement ? partyStatement.offer : undefined;
    }
    getLastOfferAsPartyStatement() {
        return this.getOfferedPartyStatement();
    }
    isOfferAccepted() {
        if (!this.partyStatements) {
            return false;
        }
        const statement = this.partyStatements
            .filter(o => o.type === statementType_1.StatementType.ACCEPTATION.value)
            .pop();
        return !!statement;
    }
    isOfferRejected() {
        if (!this.partyStatements) {
            return false;
        }
        const statement = this.partyStatements
            .filter(o => o.type === statementType_1.StatementType.REJECTION.value)
            .pop();
        return !!statement;
    }
    isOfferResponded() {
        return this.isOfferAccepted() || this.isOfferRejected();
    }
    isThroughAdmissions() {
        const lastOffer = this.getLastOffer();
        return lastOffer && !!lastOffer.paymentIntention;
    }
    isThroughAdmissionsAndSettled() {
        return this.isSettled() && this.isThroughAdmissions();
    }
    isSettled() {
        return this.partyStatements && this.partyStatements.some(statement => statement.type === 'COUNTERSIGNATURE');
    }
    isOfferRejectedByDefendant() {
        const statement = this.partyStatements
            .filter(o => o.type === statementType_1.StatementType.REJECTION.value && o.madeBy === madeBy_1.MadeBy.DEFENDANT.value)
            .pop();
        return !!statement;
    }
    isOfferMadeByDefendant(partyStatement) {
        return partyStatement.type === statementType_1.StatementType.OFFER.value && partyStatement.madeBy === madeBy_1.MadeBy.DEFENDANT.value;
    }
    deserializePartyStatement(settlements) {
        if (!settlements) {
            return settlements;
        }
        return settlements.map(settlement => new partyStatement_1.PartyStatement(undefined, undefined).deserialize(settlement));
    }
    getOfferedPartyStatement() {
        if (!this.partyStatements) {
            return undefined;
        }
        const partyStatement = this.partyStatements.reverse()
            .find(statement => statement.type === statementType_1.StatementType.OFFER.value);
        return partyStatement;
    }
}
exports.Settlement = Settlement;
