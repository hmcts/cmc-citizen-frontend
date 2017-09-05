import { Serializable } from 'models/serializable'

import { Moment } from 'moment'
import ClaimData from 'app/claims/models/claimData'
import { MomentFactory } from 'common/momentFactory'
import InterestDateType from 'app/common/interestDateType'
import { calculateInterest } from 'app/common/calculateInterest'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

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
      this.claimantId = input.submitterId
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
      this.claimantEmail = input.submitterEmail
    }
    return this
  }

  get totalAmount (): number {
    const interestRate = this.claimData.interest
    const interestDate = this.claimData.interestDate
    const claimAmount: number = this.claimData.amount
    const date = interestDate.type === InterestDateType.SUBMISSION ? this.createdAt : interestDate.date

    return claimAmount + this.claimData.paidFeeAmount + calculateInterest(claimAmount, interestRate, date)
  }

  // noinspection JSUnusedGlobalSymbols Called in the view
  get remainingDays (): number {
    return this.responseDeadline.diff(MomentFactory.currentDate(), 'days')
  }

  get eligibleForCCJ (): boolean {
    if (!toBoolean(config.get<boolean>('featureToggles.countyCourtJudgment'))) {
      return false
    }

    return this.remainingDays < 0 && !this.respondedAt
  }
}
