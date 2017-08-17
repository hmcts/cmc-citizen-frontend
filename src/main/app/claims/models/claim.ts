import { Serializable } from 'models/serializable'

import { Moment } from 'moment'
import ClaimData from 'app/claims/models/claimData'
import { MomentFactory } from 'common/momentFactory'

export default class Claim implements Serializable<Claim> {
  id: number
  claimantId: number
  externalId: string
  defendantId: number
  claimNumber: string
  responseDeadline: Moment
  createdAt: Moment
  issuedOn: Moment
  claimData: ClaimData
  moreTimeRequested: boolean
  respondedAt: Moment
  claimantEmail: string
  deserialize (input: any): Claim {
    if (input) {
      this.id = input.id
      this.claimantId = input.claimantId
      this.externalId = input.externalId
      this.defendantId = input.defendantId
      this.claimNumber = input.referenceNumber
      this.createdAt = MomentFactory.parse(input.createdAt)
      this.responseDeadline = MomentFactory.parse(input.responseDeadline)
      this.issuedOn = MomentFactory.parse(input.issuedOn)
      this.claimData = new ClaimData().deserialize(input.claim)
      this.moreTimeRequested = input.moreTimeRequested
      if (input.respondedAt) {
        this.respondedAt = MomentFactory.parse(input.respondedAt)
      }
      this.claimantEmail = input.claimantEmail
    }
    return this
  }
}
