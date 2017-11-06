import { Serializable } from 'app/models/serializable'
import { PartyStatement } from 'claims/models/partyStatement'
import { Offer } from 'claims/models/offer'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'offer/form/models/madeBy'

export default class Settlement implements Serializable<Settlement> {
  partyStatements: PartyStatement[]

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

    const partyStatements: PartyStatement[] = this.partyStatements
      .map(o => this.isOfferMadeByDefendant(o) ? o : undefined)

    return partyStatements ? partyStatements.pop().offer : undefined
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
}
