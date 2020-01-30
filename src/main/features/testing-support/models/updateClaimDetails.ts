import { IsNotBlank } from '@hmcts/cmc-validators'
import * as _ from 'lodash'

class ValidationErrors {
  static readonly EMAIL_REQUIRED: string = 'Enter a Email ID'
  static readonly CLAIM_REASON_REQUIRED: string = 'Enter Claim Description'
}

export class UpdateClaimDetails {

  @IsNotBlank({ message: ValidationErrors.EMAIL_REQUIRED })
  email?: string

  @IsNotBlank({ message: ValidationErrors.CLAIM_REASON_REQUIRED })
  description?: string

  claimAmount?: number
  claimantType?: string
  defendantType?: string
  interest?: boolean
  evidence?: boolean
  timeline?: boolean

  constructor (email?: string, claimAmount?: number, description?: string, claimantType?: string, defendantType?: string, interest?: boolean, evidence?: boolean, timeline?: boolean) {
    this.email = email
    this.claimAmount = claimAmount
    this.description = description
    this.claimantType = claimantType
    this.defendantType = defendantType
    this.interest = interest
    this.evidence = evidence
    this.timeline = timeline
  }

  public static fromObject (value?: any): UpdateClaimDetails {
    if (!value) {
      return value
    }

    if (value.updateClaim) {
      return new UpdateClaimDetails().deserialize(value)
    }

    return new UpdateClaimDetails(value.defendant.email.address, value.amount.rows[0].amount, value.reason.reason, value.claimant.partyDetails.type, value.defendant.partyDetails.type, false, (value.evidence.rows.length > 0), (value.timeline.rows.length > 0))
  }

  deserialize (value?: any) {
    if (value) {
      this.email = value.email
      this.claimAmount = _.toInteger(value.claimAmount)
      this.description = value.description
      this.claimantType = value.claimantType
      this.defendantType = value.defendantType
      this.interest = !!(value.interest)
      this.evidence = !!(value.evidence)
      this.timeline = true
    }

    return this
  }

}
