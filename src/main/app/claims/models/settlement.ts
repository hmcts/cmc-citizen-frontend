import { Serializable } from 'app/models/serializable'
import { PartyStatement } from 'claims/models/partyStatement'

export default class Settlement implements Serializable<Settlement> {
  partyStatements: PartyStatement[]

  deserialize (input: any): Settlement {
    if (input) {
      this.partyStatements = this.deserializePartyStatement(input.partyStatements)
    }
    return this
  }

  private deserializePartyStatement (settlements: any[]): PartyStatement[] {
    if (!settlements) {
      return settlements
    }
    return settlements.map(settlement => new PartyStatement(undefined, undefined).deserialize(settlement))
  }
}
