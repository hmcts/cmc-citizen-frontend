/* tslint:disable:no-unused-expression */

import { getRepaymentPlanOrigin, prepareSettlement } from 'claimant-response/helpers/settlementHelper'
import { PartyStatement } from 'claims/models/partyStatement'
import { expect } from 'chai'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'offer/form/models/madeBy'
import { Settlement } from 'claims/models/settlement'
import { Offer } from 'claims/models/offer'
import { MomentFactory } from 'shared/momentFactory'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { PaymentOption } from 'claims/models/paymentOption'
import { Moment } from 'moment'
import { immediatePayment, paymentBySetDate, paymentByInstallments } from 'test/data/draft/fragments/paymentIntention'

describe('SettlementHelper', () => {

  describe('prepare party statements and settlement ', () => {
    let claim: Claim
    let draft: DraftClaimantResponse

    beforeEach(() => {
      claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
    })

    it('should return settlement with defendant payment method if claimant accepted it', () => {
      draft = new DraftClaimantResponse().deserialize({
        acceptPaymentMethod: {
          accept: {
            option: 'yes'
          }
        },
        settlementAgreement: {
          signed: true
        }
      })

      const settlement: Settlement = prepareSettlement(claim, draft)
      expect(settlement).is.not.undefined
      expect(settlement.partyStatements.length).to.be.eql(2)
      expect(settlement.partyStatements[0].type).to.be.eql('OFFER')
      expect(settlement.partyStatements[0].madeBy).to.be.eql(MadeBy.DEFENDANT.value)
      expect(settlement.partyStatements[0].offer.paymentIntention).to.be.not.undefined
      expect(settlement.partyStatements[1].type).to.be.eql('ACCEPTATION')
      expect(settlement.partyStatements[1].madeBy).to.be.eql(MadeBy.CLAIMANT.value)
    })

    it('should return settlement with claimant payment method if claimant rejected defendant one (immediately)', () => {
      draft = new DraftClaimantResponse().deserialize({
        acceptPaymentMethod: {
          accept: {
            option: 'no'
          }
        },
        alternatePaymentMethod: {
          ...immediatePayment
        },
        settlementAgreement: {
          signed: true
        }
      })

      const fiveDaysFromNow: Moment = MomentFactory.currentDate().add(5, 'days')

      const settlement: Settlement = prepareSettlement(claim, draft)
      expect(settlement).is.not.undefined
      expect(settlement.partyStatements.length).to.be.eql(4)
      expect(settlement.partyStatements[0].type).to.be.eql('OFFER')
      expect(settlement.partyStatements[0].madeBy).to.be.eql(MadeBy.DEFENDANT.value)
      expect(settlement.partyStatements[0].offer.paymentIntention).to.be.not.undefined
      expect(settlement.partyStatements[1].type).to.be.eql('REJECTION')
      expect(settlement.partyStatements[1].madeBy).to.be.eql(MadeBy.CLAIMANT.value)
      expect(settlement.partyStatements[2].type).to.be.eql('OFFER')
      expect(settlement.partyStatements[2].madeBy).to.be.eql(MadeBy.CLAIMANT.value)
      expect(settlement.partyStatements[2].offer.paymentIntention.paymentOption).to.be.equal(PaymentOption.IMMEDIATELY)
      expect(settlement.partyStatements[2].offer.completionDate.toISOString()).to.be.equal(fiveDaysFromNow.toISOString())
      expect(settlement.partyStatements[3].type).to.be.eql('ACCEPTATION')
      expect(settlement.partyStatements[3].madeBy).to.be.eql(MadeBy.CLAIMANT.value)
    })

    it('should return settlement with claimant payment method if claimant rejected defendant one (by set date)', () => {
      draft = new DraftClaimantResponse().deserialize({
        acceptPaymentMethod: {
          accept: {
            option: 'no'
          }
        },
        alternatePaymentMethod: {
          ...paymentBySetDate
        },
        settlementAgreement: {
          signed: true
        }
      })

      const settlement: Settlement = prepareSettlement(claim, draft)
      expect(settlement).is.not.undefined
      expect(settlement.partyStatements.length).to.be.eql(4)
      expect(settlement.partyStatements[0].type).to.be.eql('OFFER')
      expect(settlement.partyStatements[0].madeBy).to.be.eql(MadeBy.DEFENDANT.value)
      expect(settlement.partyStatements[0].offer.paymentIntention).to.be.not.undefined
      expect(settlement.partyStatements[1].type).to.be.eql('REJECTION')
      expect(settlement.partyStatements[1].madeBy).to.be.eql(MadeBy.CLAIMANT.value)
      expect(settlement.partyStatements[2].type).to.be.eql('OFFER')
      expect(settlement.partyStatements[2].madeBy).to.be.eql(MadeBy.CLAIMANT.value)
      expect(settlement.partyStatements[2].offer.paymentIntention.paymentOption).to.be.equal(PaymentOption.BY_SPECIFIED_DATE)
      expect(settlement.partyStatements[2].offer.completionDate.toISOString()).to.be.equal(MomentFactory.parse('2025-12-31').toISOString())
      expect(settlement.partyStatements[3].type).to.be.eql('ACCEPTATION')
      expect(settlement.partyStatements[3].madeBy).to.be.eql(MadeBy.CLAIMANT.value)
    })

    it('should return settlement with claimant payment method if claimant rejected defendant one (installments)', () => {
      draft = new DraftClaimantResponse().deserialize({
        acceptPaymentMethod: {
          accept: {
            option: 'no'
          }
        },
        alternatePaymentMethod: {
          ...paymentByInstallments
        },
        settlementAgreement: {
          signed: true
        }
      })

      const settlement: Settlement = prepareSettlement(claim, draft)
      expect(settlement).is.not.undefined
      expect(settlement.partyStatements.length).to.be.eql(4)
      expect(settlement.partyStatements[0].type).to.be.eql('OFFER')
      expect(settlement.partyStatements[0].madeBy).to.be.eql(MadeBy.DEFENDANT.value)
      expect(settlement.partyStatements[0].offer.paymentIntention).to.be.not.undefined
      expect(settlement.partyStatements[1].type).to.be.eql('REJECTION')
      expect(settlement.partyStatements[1].madeBy).to.be.eql(MadeBy.CLAIMANT.value)
      expect(settlement.partyStatements[2].type).to.be.eql('OFFER')
      expect(settlement.partyStatements[2].madeBy).to.be.eql(MadeBy.CLAIMANT.value)
      expect(settlement.partyStatements[2].offer.paymentIntention.paymentOption).to.be.equal(PaymentOption.INSTALMENTS)
      expect(settlement.partyStatements[2].offer.completionDate.toISOString()).to.be.equal(MomentFactory.parse('2026-02-25').toISOString())
      expect(settlement.partyStatements[3].type).to.be.eql('ACCEPTATION')
      expect(settlement.partyStatements[3].madeBy).to.be.eql(MadeBy.CLAIMANT.value)
    })

    it('should throw error when settlement agreement is undefined', () => {
      draft = new DraftClaimantResponse().deserialize({ settlementAgreement: undefined })
      expect(() => prepareSettlement(claim, draft)).to.throw(Error, 'SettlementAgreement should be signed by claimant')
    })

    it('should throw error when settlement is not signed', () => {
      draft = new DraftClaimantResponse().deserialize({ settlementAgreement: { signed: false } })
      expect(() => prepareSettlement(claim, draft)).to.throw(Error, 'SettlementAgreement should be signed by claimant')
    })
  })

  describe('getRepaymentPlanOrigin', () => {
    it('should return DEFENDANT if offer accepted was made by defendant', () => {
      const partyStatements: PartyStatement[] = [
        new PartyStatement(StatementType.OFFER.value, MadeBy.DEFENDANT.value, new Offer('contents', MomentFactory.currentDate())),
        new PartyStatement(StatementType.ACCEPTATION.value, MadeBy.CLAIMANT.value)
      ]
      const settlement: Settlement = new Settlement(partyStatements)

      const repaymentPlanOrigin: string = getRepaymentPlanOrigin(settlement)
      expect(repaymentPlanOrigin).is.not.undefined
      expect(repaymentPlanOrigin).to.be.eql(MadeBy.DEFENDANT.value)
    })

    it('should return CLAIMANT if offer accepted was made by claimant', () => {
      const partyStatements: PartyStatement[] = [
        new PartyStatement(StatementType.OFFER.value, MadeBy.CLAIMANT.value, new Offer('contents', MomentFactory.currentDate())),
        new PartyStatement(StatementType.ACCEPTATION.value, MadeBy.CLAIMANT.value)
      ]
      const settlement: Settlement = new Settlement(partyStatements)

      const repaymentPlanOrigin: string = getRepaymentPlanOrigin(settlement)
      expect(repaymentPlanOrigin).is.not.undefined
      expect(repaymentPlanOrigin).to.be.eql(MadeBy.CLAIMANT.value)
    })

    it('should return COURT if offer accepted was made by court', () => {
      const partyStatements: PartyStatement[] = [
        new PartyStatement(StatementType.OFFER.value, 'COURT', new Offer('contents', MomentFactory.currentDate())),
        new PartyStatement(StatementType.ACCEPTATION.value, MadeBy.CLAIMANT.value)
      ]
      const settlement: Settlement = new Settlement(partyStatements)

      const repaymentPlanOrigin: string = getRepaymentPlanOrigin(settlement)
      expect(repaymentPlanOrigin).is.not.undefined
      expect(repaymentPlanOrigin).to.be.eql('COURT')
    })

    it('should return CLAIMANT if offer accepted was made by claimant in response to rejected defendant offer', () => {
      const partyStatements: PartyStatement[] = [
        new PartyStatement(StatementType.OFFER.value, MadeBy.DEFENDANT.value, new Offer('contents', MomentFactory.currentDate())),
        new PartyStatement(StatementType.REJECTION.value, MadeBy.CLAIMANT.value),
        new PartyStatement(StatementType.OFFER.value, MadeBy.CLAIMANT.value, new Offer('contents', MomentFactory.currentDate())),
        new PartyStatement(StatementType.ACCEPTATION.value, MadeBy.CLAIMANT.value)
      ]
      const settlement: Settlement = new Settlement(partyStatements)

      const repaymentPlanOrigin: string = getRepaymentPlanOrigin(settlement)
      expect(repaymentPlanOrigin).is.not.undefined
      expect(repaymentPlanOrigin).to.be.eql(MadeBy.CLAIMANT.value)
    })

    it('should throw error if settlement is undefined', () => {
      expect(() => getRepaymentPlanOrigin(undefined)).to.throw(Error, 'settlement must not be null')
    })

    it('should throw error if partyStatement is undefined', () => {
      expect(() => getRepaymentPlanOrigin(new Settlement([undefined, new PartyStatement(StatementType.ACCEPTATION.value, MadeBy.CLAIMANT.value)]))).to.throw(Error, 'partyStatement must not be null')
    })
  })
})
