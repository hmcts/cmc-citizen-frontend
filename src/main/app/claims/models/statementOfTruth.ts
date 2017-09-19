import { Serializable } from 'models/serializable'

export class StatementOfTruth implements Serializable<StatementOfTruth> {
  signerName: string
  signerRole: string

  constructor (signerName?: string, signerRole?: string) {
    this.signerName = signerName
    this.signerRole = signerRole
  }

  deserialize (obj: any): StatementOfTruth {
    if (obj) {
      return new StatementOfTruth(obj.signerName, obj.signerRole)
    }
    return undefined
  }
}
