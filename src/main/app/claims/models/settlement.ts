import { PartyStatement } from 'claims/models/partyStatement'
import { Offer } from 'claims/models/offer'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'claims/models/madeBy'

export class Settlement {
  partyStatements: PartyStatement[]

  constructor (partyStatements?: PartyStatement[]) {
    this.partyStatements = partyStatements
  }

  deserialize (input: any): Settlement {
    if (input) {
      this.partyStatements = this.deserializePartyStatement(input.partyStatements)
    }
    return this
  }

  getDefendantOffer (): Offer {
    if (!this.partyStatements) {
      return undefined
    }

    const partyStatement: PartyStatement = this.partyStatements
      .filter(this.isOfferMadeByDefendant)
      .pop()

    return partyStatement ? partyStatement.offer : undefined
  }

  getLastOffer (): Offer {
    const partyStatement = this.getOfferedPartyStatement()
    return partyStatement ? partyStatement.offer : undefined
  }

  getLastOfferAsPartyStatement (): PartyStatement {
    return this.getOfferedPartyStatement()
  }

  isOfferAccepted (): boolean {
    if (!this.partyStatements) {
      return false
    }

    const statement: PartyStatement = this.partyStatements
      .filter(o => o.type === StatementType.ACCEPTATION.value)
      .pop()

    return !!statement
  }

  isOfferRejected (): boolean {
    if (!this.partyStatements) {
      return false
    }

    const statement: PartyStatement = this.partyStatements
      .filter(o => o.type === StatementType.REJECTION.value)
      .pop()

    return !!statement
  }

  isOfferResponded (): boolean {
    return this.isOfferAccepted() || this.isOfferRejected()
  }

  isThroughAdmissions (): boolean {
    const lastOffer: Offer = this.getLastOffer()
    return lastOffer && !!lastOffer.paymentIntention
  }

  isThroughAdmissionsAndSettled (): boolean {
    return this.isSettled() && this.isThroughAdmissions()
  }

  isSettled (): boolean {
    return this.partyStatements && this.partyStatements.some(statement => statement.type === 'COUNTERSIGNATURE')
  }

  isOfferRejectedByDefendant (): boolean {
    const statement: PartyStatement = this.partyStatements
      .filter(o => o.type === StatementType.REJECTION.value && o.madeBy === MadeBy.DEFENDANT.value)
      .pop()

    return !!statement
  }

  private isOfferMadeByDefendant (partyStatement: PartyStatement): boolean {
    return partyStatement.type === StatementType.OFFER.value && partyStatement.madeBy === MadeBy.DEFENDANT.value
  }

  private deserializePartyStatement (settlements: any[]): PartyStatement[] {
    if (!settlements) {
      return settlements
    }
    return settlements.map(settlement => new PartyStatement(undefined, undefined).deserialize(settlement))
  }

  private getOfferedPartyStatement (): PartyStatement {
    if (!this.partyStatements) {
      return undefined
    }

    const partyStatement: PartyStatement = this.partyStatements.reverse()
      .find(statement => statement.type === StatementType.OFFER.value)
    return partyStatement
  }
}
