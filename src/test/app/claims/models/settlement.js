"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const settlement_1 = require("claims/models/settlement");
const madeBy_1 = require("claims/models/madeBy");
const statementType_1 = require("offer/form/models/statementType");
const partyStatement_1 = require("claims/models/partyStatement");
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
const momentFactory_1 = require("shared/momentFactory");
const paymentOption_1 = require("claims/models/paymentOption");
describe('Settlement', () => {
    describe('deserialize', () => {
        it('should return undefined when undefined input given', () => {
            const actual = new settlement_1.Settlement().deserialize(undefined);
            chai_1.expect(actual.partyStatements).to.be.eq(undefined);
        });
        it('should deserialize valid JSON to valid Settlement object', () => {
            const actual = new settlement_1.Settlement().deserialize(input());
            chai_1.expect(actual).to.be.instanceof(settlement_1.Settlement);
            chai_1.expect(actual.partyStatements.length).to.be.eq(1);
            chai_1.expect(actual.partyStatements[0]).to.be.instanceof(partyStatement_1.PartyStatement);
        });
    });
    describe('getDefendantOffer', () => {
        it('should return undefined when no settlement', () => {
            const actual = new settlement_1.Settlement().deserialize(undefined);
            chai_1.expect(actual.getDefendantOffer()).to.be.eq(undefined);
        });
        it('should return undefined when only claimant offer given', () => {
            const actual = new settlement_1.Settlement().deserialize(input(statementType_1.StatementType.OFFER, madeBy_1.MadeBy.CLAIMANT));
            chai_1.expect(actual.getDefendantOffer()).to.be.eq(undefined);
        });
        it('should return undefined when only settlement accepted', () => {
            const actual = new settlement_1.Settlement().deserialize(input(statementType_1.StatementType.ACCEPTATION));
            chai_1.expect(actual.getDefendantOffer()).to.be.eq(undefined);
        });
        it('should return undefined when only settlement rejected', () => {
            const actual = new settlement_1.Settlement().deserialize(input(statementType_1.StatementType.REJECTION));
            chai_1.expect(actual.getDefendantOffer()).to.be.eq(undefined);
        });
        it('should return Offer when defendant made an offer', () => {
            const myInput = input();
            const offer = myInput.partyStatements[0].offer;
            const actual = new settlement_1.Settlement().deserialize(myInput);
            chai_1.expect(actual.getDefendantOffer().completionDate.format('YYYY-DD-MM')).to.be.eq(offer.completionDate);
            chai_1.expect(actual.getDefendantOffer().content).to.be.eq(offer.content);
        });
    });
    describe('isOfferAccepted', () => {
        it('should return false when no offer', () => {
            const actual = new settlement_1.Settlement().deserialize(undefined);
            chai_1.expect(actual.isOfferAccepted()).to.be.eq(false);
        });
        it('should return false when there is offer but no acceptation', () => {
            const actual = new settlement_1.Settlement().deserialize(input(statementType_1.StatementType.OFFER));
            chai_1.expect(actual.isOfferAccepted()).to.be.eq(false);
        });
        it('should return false when offer is rejected', () => {
            const actual = new settlement_1.Settlement().deserialize(input(statementType_1.StatementType.REJECTION, madeBy_1.MadeBy.CLAIMANT));
            chai_1.expect(actual.isOfferAccepted()).to.be.eq(false);
        });
        it('should return true when offer is accepted', () => {
            const actual = new settlement_1.Settlement().deserialize(input(statementType_1.StatementType.ACCEPTATION, madeBy_1.MadeBy.CLAIMANT));
            chai_1.expect(actual.isOfferAccepted()).to.be.eq(true);
        });
    });
    describe('isOfferRejected', () => {
        it('should return false when no offer', () => {
            const settlement = new settlement_1.Settlement().deserialize(undefined);
            chai_1.expect(settlement.isOfferRejected()).to.be.eq(false);
        });
        it('should return false when there is offer but no rejection', () => {
            const settlement = new settlement_1.Settlement().deserialize(input(statementType_1.StatementType.OFFER));
            chai_1.expect(settlement.isOfferRejected()).to.be.eq(false);
        });
        it('should return false when offer is accepted', () => {
            const settlement = new settlement_1.Settlement().deserialize(input(statementType_1.StatementType.ACCEPTATION, madeBy_1.MadeBy.CLAIMANT));
            chai_1.expect(settlement.isOfferRejected()).to.be.eq(false);
        });
        it('should return true when offer is rejected', () => {
            const settlement = new settlement_1.Settlement().deserialize(input(statementType_1.StatementType.REJECTION, madeBy_1.MadeBy.CLAIMANT));
            chai_1.expect(settlement.isOfferRejected()).to.be.eq(true);
        });
    });
    describe('isThroughAdmissions', () => {
        it('should return true when settlement is through admissions', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate()
            };
            const actual = prepareSettlement(paymentIntention_1.PaymentIntention.deserialize(paymentIntention));
            chai_1.expect(actual.isThroughAdmissions()).to.be.eq(true);
        });
        it('should return false when settlement is through offers', () => {
            const actual = prepareSettlement(undefined);
            chai_1.expect(actual.isThroughAdmissions()).to.be.eq(false);
        });
    });
});
function prepareSettlement(paymentIntention) {
    const settlement = {
        partyStatements: [
            {
                type: statementType_1.StatementType.OFFER.value,
                madeBy: madeBy_1.MadeBy.DEFENDANT.value,
                offer: {
                    content: 'My offer contents here.',
                    completionDate: '2020-10-10',
                    paymentIntention: paymentIntention
                }
            },
            {
                madeBy: madeBy_1.MadeBy.CLAIMANT.value,
                type: statementType_1.StatementType.ACCEPTATION.value
            }
        ]
    };
    return new settlement_1.Settlement().deserialize(settlement);
}
function input(type = statementType_1.StatementType.OFFER, madeBy = madeBy_1.MadeBy.DEFENDANT) {
    return {
        partyStatements: [
            {
                type: type.value,
                madeBy: madeBy.value,
                offer: {
                    content: 'bla',
                    completionDate: '2019-10-10'
                }
            }
        ]
    };
}
