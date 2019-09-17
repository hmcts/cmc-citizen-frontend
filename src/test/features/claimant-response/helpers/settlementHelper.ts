/* tslint:disable:no-unused-expression */

import {
  acceptOffer,
  getRepaymentPlanOrigin,
  prepareDefendantPartyStatement,
  prepareSettlement
} from 'claimant-response/helpers/settlementHelper'
import { PartyStatement } from 'claims/models/partyStatement'
import { expect } from 'chai'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'claims/models/madeBy'
import { Settlement } from 'claims/models/settlement'
import { Offer } from 'claims/models/offer'
import { MomentFactory } from 'shared/momentFactory'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { sampleClaimantResponseDraftObj } from 'test/http-mocks/draft-store'

describe('settlementHelper', () => {

  describe('prepare defendant party statement and settlement ', () => {
    let claim: Claim
    let draft: DraftClaimantResponse

    beforeEach(() => {
      claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
      draft = new DraftClaimantResponse().deserialize({ ...sampleClaimantResponseDraftObj })
    })

    it('should return defendant party statement by installment option', () => {
      const partyStatement: PartyStatement = prepareDefendantPartyStatement(claim, draft)
      expect(partyStatement).is.not.undefined
      expect(partyStatement.madeBy).to.be.eql('DEFENDANT')
      expect(partyStatement.type).to.be.eql('OFFER')
      expect(partyStatement.offer).is.not.undefined
      expect(partyStatement.offer.paymentIntention).is.not.undefined
      expect(partyStatement.offer.paymentIntention.paymentOption).to.be.eql('INSTALMENTS')
      expect(partyStatement.offer.paymentIntention.repaymentPlan).is.not.undefined
      expect(partyStatement.offer.paymentIntention.paymentDate).is.undefined
      expect(partyStatement.offer.content).to.be.eql('John Smith will repay £200 in instalments of £100 each week. The first instalment will be paid by 31 December 2050.')

    })

    it('should return defendant party statement by set date option', () => {
      claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj })
      const partyStatement: PartyStatement = prepareDefendantPartyStatement(claim, draft)
      expect(partyStatement).is.not.undefined
      expect(partyStatement.madeBy).to.be.eql('DEFENDANT')
      expect(partyStatement.type).to.be.eql('OFFER')
      expect(partyStatement.offer).is.not.undefined
      expect(partyStatement.offer.content).to.be.eql('John Smith will pay £200, no later than 31 December 2050')
      expect(partyStatement.offer.completionDate).to.be.eql(MomentFactory.parse('2050-12-31'))
      expect(partyStatement.offer.paymentIntention).is.not.undefined
      expect(partyStatement.offer.paymentIntention.paymentOption).to.be.eql('BY_SPECIFIED_DATE')
      expect(partyStatement.offer.paymentIntention.paymentDate).is.not.undefined
      expect(partyStatement.offer.paymentIntention.repaymentPlan).is.undefined

    })

    it('should return settlement object', () => {
      const settlement: Settlement = prepareSettlement(claim, draft)
      expect(settlement).is.not.undefined
      expect(settlement.partyStatements.length).to.be.eql(2)
      expect(settlement.partyStatements[0].type).to.be.eql('OFFER')
      expect(settlement.partyStatements[0].madeBy).to.be.eql('DEFENDANT')
      expect(settlement.partyStatements[1].type).to.be.eql('ACCEPTATION')
      expect(settlement.partyStatements[1].madeBy).to.be.eql('CLAIMANT')
    })

    it('should throw error when settlement agreement is undefined', () => {
      draft = new DraftClaimantResponse().deserialize({ ...sampleClaimantResponseDraftObj, ...{ settlementAgreement: undefined } })
      expect(() => prepareSettlement(claim, draft)).to.throw(Error, 'SettlementAgreement should be signed by claimant')
    })

    it('should throw error when settlement is not signed', () => {
      draft = new DraftClaimantResponse().deserialize({ ...sampleClaimantResponseDraftObj, ...{ settlementAgreement: { signed: false } } })
      expect(() => prepareSettlement(claim, draft)).to.throw(Error, 'SettlementAgreement should be signed by claimant')
    })
  })

  describe('getRepaymentPlanOrigin', () => {
    it('should return DEFENDANT if offer accepted was made by defendant', () => {
      const defendantStatement = new PartyStatement(StatementType.OFFER.value, 'DEFENDANT', new Offer('contents', MomentFactory.currentDate()))
      const partyStatements: PartyStatement[] = [defendantStatement, acceptOffer()]
      const settlement: Settlement = new Settlement(partyStatements)

      const repaymentPlanOrigin: string = getRepaymentPlanOrigin(settlement)
      expect(repaymentPlanOrigin).is.not.undefined
      expect(repaymentPlanOrigin).to.be.eql('DEFENDANT')
    })

    it('should return CLAIMANT if offer accepted was made by claimant', () => {
      const defendantStatement = new PartyStatement(StatementType.OFFER.value, 'CLAIMANT', new Offer('contents', MomentFactory.currentDate()))
      const partyStatements: PartyStatement[] = [defendantStatement, acceptOffer()]
      const settlement: Settlement = new Settlement(partyStatements)

      const repaymentPlanOrigin: string = getRepaymentPlanOrigin(settlement)
      expect(repaymentPlanOrigin).is.not.undefined
      expect(repaymentPlanOrigin).to.be.eql('CLAIMANT')
    })

    it('should return COURT if offer accepted was made by court', () => {
      const defendantStatement = new PartyStatement(StatementType.OFFER.value, 'COURT', new Offer('contents', MomentFactory.currentDate()))
      const partyStatements: PartyStatement[] = [defendantStatement, acceptOffer()]
      const settlement: Settlement = new Settlement(partyStatements)

      const repaymentPlanOrigin: string = getRepaymentPlanOrigin(settlement)
      expect(repaymentPlanOrigin).is.not.undefined
      expect(repaymentPlanOrigin).to.be.eql('COURT')
    })

    it('should throw error if settlement is undefined', () => {
      expect(() => getRepaymentPlanOrigin(undefined)).to.throw(Error, 'settlement must not be null')
    })

    it('should throw error if partyStatement is undefined', () => {
      expect(() => getRepaymentPlanOrigin(new Settlement([undefined, acceptOffer()]))).to.throw(Error, 'partyStatement must not be null')
    })
  })

  describe('acceptOffer', () => {
    it('should generate acceptation party statement', () => {
      const partyStatement: PartyStatement = acceptOffer()
      expect(partyStatement).is.not.undefined
      expect(partyStatement.type).to.be.eql(StatementType.ACCEPTATION.value)
      expect(partyStatement.madeBy).to.be.eql(MadeBy.CLAIMANT.value)
    })
  })
})
