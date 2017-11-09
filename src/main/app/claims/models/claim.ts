import { Serializable } from 'models/serializable'

import { Moment } from 'moment'
import { ClaimData } from 'app/claims/models/claimData'
import { MomentFactory } from 'common/momentFactory'
import { InterestDateType } from 'app/common/interestDateType'
import { calculateInterest } from 'app/common/calculateInterest'
import * as config from 'config'
import * as toBoolean from 'to-boolean'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { DefendantResponse } from 'claims/models/defendantResponse'
import { Settlement } from 'claims/models/settlement'
import { Offer } from 'claims/models/offer'

export class Claim implements Serializable<Claim> {
  id: number
  claimantId: string
  externalId: string
  defendantId: string
  claimNumber: string
  responseDeadline: Moment
  createdAt: Moment
  issuedOn: Moment
  claimData: ClaimData
  moreTimeRequested: boolean
  respondedAt: Moment
  claimantEmail: string
  countyCourtJudgment: CountyCourtJudgment
  countyCourtJudgmentRequestedAt: Moment
  response: DefendantResponse
  defendantEmail: string
  settlement: Settlement

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
      if (input.defendantEmail) {
        this.defendantEmail = input.defendantEmail
      }
      if (input.response) {
        this.response = new DefendantResponse().deserialize(input.response)
      }
      this.claimantEmail = input.submitterEmail
      this.countyCourtJudgment = new CountyCourtJudgment().deserialize(input.countyCourtJudgment)
      if (input.countyCourtJudgmentRequestedAt) {
        this.countyCourtJudgmentRequestedAt = MomentFactory.parse(input.countyCourtJudgmentRequestedAt)
      }
      if (input.settlement) {
        this.settlement = new Settlement().deserialize(input.settlement)
      }
    }
    return this
  }

  get defendantOffer (): Offer {
    if (!this.settlement) {
      return undefined
    }

    return this.settlement.getDefendantOffer()
  }

  get totalAmountTillToday (): number {
    return this.calculateTotalAmountTillDate(MomentFactory.currentDateTime())
  }

  get totalAmountTillDateOfIssue (): number {
    return this.calculateTotalAmountTillDate(this.createdAt)
  }

  private calculateTotalAmountTillDate (toDate: Moment): number {
    const interestRate = this.claimData.interest
    const interestDate = this.claimData.interestDate
    let claimAmount: number = this.claimData.amount.totalAmount()
    const date = interestDate.type === InterestDateType.SUBMISSION ? this.createdAt : interestDate.date

    return claimAmount + this.claimData.paidFeeAmount + calculateInterest(claimAmount, interestRate, date, toDate)
  }

  // noinspection JSUnusedGlobalSymbols Called in the view
  get remainingDays (): number {
    return this.responseDeadline.diff(MomentFactory.currentDate(), 'days')
  }

  get eligibleForCCJ (): boolean {
    if (!toBoolean(config.get<boolean>('featureToggles.countyCourtJudgment'))) {
      return false
    }

    return !this.countyCourtJudgmentRequestedAt && this.remainingDays < 0 && !this.respondedAt
  }
}
