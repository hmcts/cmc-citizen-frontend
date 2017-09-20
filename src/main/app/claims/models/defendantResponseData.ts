import { Serializable } from 'app/models/serializable'
import { StatementOfTruth } from 'claims/models/statementOfTruth'

export class DefendantResponseData implements Serializable<DefendantResponseData> {
  type: string
  defence: string
  freeMediation: string
  statementOfTruth?: StatementOfTruth

  deserialize (input: any): DefendantResponseData {
    if (input) {
      this.type = input.type
      this.defence = input.defence
      this.freeMediation = input.freeMediation
      if (input.statementOfTruth) {
        this.statementOfTruth = new StatementOfTruth().deserialize(input.statementOfTruth)
      }
    }
    return this
  }
}
