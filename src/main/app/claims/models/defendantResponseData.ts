import { Serializable } from 'app/models/serializable'
import StatementOfTruthCompany from 'app/forms/models/statementOfTruthCompany'

export class DefendantResponseData implements Serializable<DefendantResponseData> {
  type: string
  defence: string
  freeMediation: string
  statementOfTruth?: StatementOfTruthCompany

  deserialize (input: any): DefendantResponseData {
    if (input) {
      this.type = input.type
      this.defence = input.defence
      this.freeMediation = input.freeMediation
      if (input.statementOfTruth) {
        this.statementOfTruth = new StatementOfTruthCompany().deserialize(input.statementOfTruth)
      }
    }
    return this
  }
}
