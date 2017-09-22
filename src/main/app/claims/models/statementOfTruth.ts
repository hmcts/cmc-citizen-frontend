import { Serializable } from 'models/serializable'

export class StatementOfTruth implements Serializable<StatementOfTruth> {
  signerName: string
  signerRole: string

  constructor (signerName?: string, signerRole?: string) {
    this.signerName = signerName
    this.signerRole = signerRole
  }

  deserialize (input: any): StatementOfTruth {
    if (input) {
      return new StatementOfTruth(input.signerName, input.signerRole)
    }
    return undefined
  }
}
