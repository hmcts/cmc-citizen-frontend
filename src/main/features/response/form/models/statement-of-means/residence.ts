import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { Serializable } from 'models/serializable'

export class Residence implements Serializable<Residence> {
  type?: ResidenceType
  otherTypeDetails?: string

  constructor (type?: ResidenceType, otherTypeDetails?: string) {
    this.type = type
    this.otherTypeDetails = otherTypeDetails
  }

  static fromObject (input?: any) {
    if (!input) {
      return input
    }
    const type: ResidenceType = ResidenceType.valueOf(input.type)
    return new Residence(
      type,
      type.value === ResidenceType.OTHER.value ? input.otherTypeDetails : undefined
    )
  }

  deserialize (input: any): Residence {
    if (input) {
      this.type = input.type
      this.otherTypeDetails = input.otherTypeDetails
    }
    return this
  }
}
