import { Serializable } from 'app/models/serializable'
import { QualifiedStatementOfTruth } from 'app/forms/models/qualifiedStatementOfTruth'

export class DefendantResponseData implements Serializable<DefendantResponseData> {
  type: string
  defence: string
  freeMediation: string
  statementOfTruth?: QualifiedStatementOfTruth

  deserialize (input: any): DefendantResponseData {
    if (input) {
      this.type = input.type
      this.defence = input.defence
      this.freeMediation = input.freeMediation
      if (input.statementOfTruth) {
        this.statementOfTruth = new QualifiedStatementOfTruth().deserialize(input.statementOfTruth)
      }
    }
    return this
  }
}
