"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const settlementHelper_1 = require("claimant-response/helpers/settlementHelper");
const partyStatement_1 = require("claims/models/partyStatement");
const chai_1 = require("chai");
const statementType_1 = require("offer/form/models/statementType");
const madeBy_1 = require("claims/models/madeBy");
const settlement_1 = require("claims/models/settlement");
const offer_1 = require("claims/models/offer");
const momentFactory_1 = require("shared/momentFactory");
const claim_1 = require("claims/models/claim");
const draftClaimantResponse_1 = require("claimant-response/draft/draftClaimantResponse");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draft_store_1 = require("test/http-mocks/draft-store");
describe('settlementHelper', () => {
    describe('prepare defendant party statement and settlement ', () => {
        let claim;
        let draft;
        beforeEach(() => {
            claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj));
            draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign({}, draft_store_1.sampleClaimantResponseDraftObj));
        });
        it('should return defendant party statement by installment option', () => {
            const partyStatement = settlementHelper_1.prepareDefendantPartyStatement(claim, draft);
            chai_1.expect(partyStatement).is.not.undefined;
            chai_1.expect(partyStatement.madeBy).to.be.eql('DEFENDANT');
            chai_1.expect(partyStatement.type).to.be.eql('OFFER');
            chai_1.expect(partyStatement.offer).is.not.undefined;
            chai_1.expect(partyStatement.offer.paymentIntention).is.not.undefined;
            chai_1.expect(partyStatement.offer.paymentIntention.paymentOption).to.be.eql('INSTALMENTS');
            chai_1.expect(partyStatement.offer.paymentIntention.repaymentPlan).is.not.undefined;
            chai_1.expect(partyStatement.offer.paymentIntention.paymentDate).is.undefined;
            chai_1.expect(partyStatement.offer.content).to.be.eql('John Smith will repay £200 in instalments of £100 each week. The first instalment will be paid by 31 December 2050.');
        });
        it('should return defendant party statement by set date option', () => {
            claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj));
            const partyStatement = settlementHelper_1.prepareDefendantPartyStatement(claim, draft);
            chai_1.expect(partyStatement).is.not.undefined;
            chai_1.expect(partyStatement.madeBy).to.be.eql('DEFENDANT');
            chai_1.expect(partyStatement.type).to.be.eql('OFFER');
            chai_1.expect(partyStatement.offer).is.not.undefined;
            chai_1.expect(partyStatement.offer.content).to.be.eql('John Smith will pay £200, no later than 31 December 2050');
            chai_1.expect(partyStatement.offer.completionDate).to.be.eql(momentFactory_1.MomentFactory.parse('2050-12-31'));
            chai_1.expect(partyStatement.offer.paymentIntention).is.not.undefined;
            chai_1.expect(partyStatement.offer.paymentIntention.paymentOption).to.be.eql('BY_SPECIFIED_DATE');
            chai_1.expect(partyStatement.offer.paymentIntention.paymentDate).is.not.undefined;
            chai_1.expect(partyStatement.offer.paymentIntention.repaymentPlan).is.undefined;
        });
        it('should return settlement object', () => {
            const settlement = settlementHelper_1.prepareSettlement(claim, draft);
            chai_1.expect(settlement).is.not.undefined;
            chai_1.expect(settlement.partyStatements.length).to.be.eql(2);
            chai_1.expect(settlement.partyStatements[0].type).to.be.eql('OFFER');
            chai_1.expect(settlement.partyStatements[0].madeBy).to.be.eql('DEFENDANT');
            chai_1.expect(settlement.partyStatements[1].type).to.be.eql('ACCEPTATION');
            chai_1.expect(settlement.partyStatements[1].madeBy).to.be.eql('CLAIMANT');
        });
        it('should throw error when settlement agreement is undefined', () => {
            draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draft_store_1.sampleClaimantResponseDraftObj), { settlementAgreement: undefined }));
            chai_1.expect(() => settlementHelper_1.prepareSettlement(claim, draft)).to.throw(Error, 'SettlementAgreement should be signed by claimant');
        });
        it('should throw error when settlement is not signed', () => {
            draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draft_store_1.sampleClaimantResponseDraftObj), { settlementAgreement: { signed: false } }));
            chai_1.expect(() => settlementHelper_1.prepareSettlement(claim, draft)).to.throw(Error, 'SettlementAgreement should be signed by claimant');
        });
    });
    describe('getRepaymentPlanOrigin', () => {
        it('should return DEFENDANT if offer accepted was made by defendant', () => {
            const defendantStatement = new partyStatement_1.PartyStatement(statementType_1.StatementType.OFFER.value, 'DEFENDANT', new offer_1.Offer('contents', momentFactory_1.MomentFactory.currentDate()));
            const partyStatements = [defendantStatement, settlementHelper_1.acceptOffer()];
            const settlement = new settlement_1.Settlement(partyStatements);
            const repaymentPlanOrigin = settlementHelper_1.getRepaymentPlanOrigin(settlement);
            chai_1.expect(repaymentPlanOrigin).is.not.undefined;
            chai_1.expect(repaymentPlanOrigin).to.be.eql('DEFENDANT');
        });
        it('should return CLAIMANT if offer accepted was made by claimant', () => {
            const defendantStatement = new partyStatement_1.PartyStatement(statementType_1.StatementType.OFFER.value, 'CLAIMANT', new offer_1.Offer('contents', momentFactory_1.MomentFactory.currentDate()));
            const partyStatements = [defendantStatement, settlementHelper_1.acceptOffer()];
            const settlement = new settlement_1.Settlement(partyStatements);
            const repaymentPlanOrigin = settlementHelper_1.getRepaymentPlanOrigin(settlement);
            chai_1.expect(repaymentPlanOrigin).is.not.undefined;
            chai_1.expect(repaymentPlanOrigin).to.be.eql('CLAIMANT');
        });
        it('should return COURT if offer accepted was made by court', () => {
            const defendantStatement = new partyStatement_1.PartyStatement(statementType_1.StatementType.OFFER.value, 'COURT', new offer_1.Offer('contents', momentFactory_1.MomentFactory.currentDate()));
            const partyStatements = [defendantStatement, settlementHelper_1.acceptOffer()];
            const settlement = new settlement_1.Settlement(partyStatements);
            const repaymentPlanOrigin = settlementHelper_1.getRepaymentPlanOrigin(settlement);
            chai_1.expect(repaymentPlanOrigin).is.not.undefined;
            chai_1.expect(repaymentPlanOrigin).to.be.eql('COURT');
        });
        it('should throw error if settlement is undefined', () => {
            chai_1.expect(() => settlementHelper_1.getRepaymentPlanOrigin(undefined)).to.throw(Error, 'settlement must not be null');
        });
        it('should throw error if partyStatement is undefined', () => {
            chai_1.expect(() => settlementHelper_1.getRepaymentPlanOrigin(new settlement_1.Settlement([undefined, settlementHelper_1.acceptOffer()]))).to.throw(Error, 'partyStatement must not be null');
        });
    });
    describe('acceptOffer', () => {
        it('should generate acceptation party statement', () => {
            const partyStatement = settlementHelper_1.acceptOffer();
            chai_1.expect(partyStatement).is.not.undefined;
            chai_1.expect(partyStatement.type).to.be.eql(statementType_1.StatementType.ACCEPTATION.value);
            chai_1.expect(partyStatement.madeBy).to.be.eql(madeBy_1.MadeBy.CLAIMANT.value);
        });
    });
});
