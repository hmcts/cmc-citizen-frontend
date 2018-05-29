import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { Response } from 'response/form/models/response'
import { FreeMediation } from 'response/form/models/freeMediation'
import { RejectPartOfClaim } from 'response/form/models/rejectPartOfClaim'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { Defence } from 'response/form/models/defence'
import { MoreTimeNeeded, MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { ResponseType } from 'response/form/models/responseType'
import { isNullOrUndefined } from 'util'
import { Defendant } from 'drafts/models/defendant'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { QualifiedStatementOfTruth } from 'forms/models/qualifiedStatementOfTruth'
import { HowMuchPaid } from 'response/form/models/howMuchPaid'
import { HowMuchOwed } from 'response/form/models/howMuchOwed'
import { DefendantPaymentOption as PaymentOption } from 'response/form/models/defendantPaymentOption'
import { DefendantPaymentPlan as PaymentPlan } from 'response/form/models/defendantPaymentPlan'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { ImpactOfDispute } from 'response/form/models/impactOfDispute'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { WhenDidYouPay } from 'response/form/models/whenDidYouPay'
import { HowMuchPaidClaimant, HowMuchPaidClaimantOption } from 'response/form/models/howMuchPaidClaimant'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

export class FullAdmission {
  paymentOption: PaymentOption
  paymentDate?: PaymentDate
  paymentPlan?: PaymentPlan

  deserialize (input: any): FullAdmission {
    if (input) {
      this.paymentOption = new PaymentOption().deserialize(input.paymentOption)
      this.paymentDate = new PaymentDate().deserialize(input.paymentDate)
      this.paymentPlan = new PaymentPlan().deserialize(input.paymentPlan)
      return this
    }
  }
}

export class ResponseDraft extends DraftDocument {

  response?: Response
  defence?: Defence
  freeMediation?: FreeMediation
  moreTimeNeeded?: MoreTimeNeeded
  defendantDetails?: Defendant = new Defendant()
  howMuchIsPaid?: HowMuchPaid
  timeline: DefendantTimeline
  evidence: DefendantEvidence
  qualifiedStatementOfTruth?: QualifiedStatementOfTruth
  howMuchOwed?: HowMuchOwed
  rejectPartOfClaim?: RejectPartOfClaim
  rejectAllOfClaim?: RejectAllOfClaim
  paidAmount?: PaidAmount
  impactOfDispute?: ImpactOfDispute
  statementOfMeans?: StatementOfMeans
  whenDidYouPay?: WhenDidYouPay
  howMuchPaidClaimant?: HowMuchPaidClaimant

  fullAdmission?: FullAdmission

  deserialize (input: any): ResponseDraft {
    if (input) {
      this.externalId = input.externalId
      this.response = Response.fromObject(input.response)
      this.defence = new Defence().deserialize(input.defence)
      this.freeMediation = new FreeMediation(input.freeMediation && input.freeMediation.option)
      this.moreTimeNeeded = new MoreTimeNeeded(input.moreTimeNeeded && input.moreTimeNeeded.option)
      this.defendantDetails = new Defendant().deserialize(input.defendantDetails)
      this.howMuchIsPaid = new HowMuchPaid().deserialize(input.howMuchIsPaid)
      this.howMuchOwed = new HowMuchOwed().deserialize(input.howMuchOwed)
      this.evidence = new DefendantEvidence().deserialize(input.evidence)
      this.timeline = new DefendantTimeline().deserialize(input.timeline)
      if (input.qualifiedStatementOfTruth) {
        this.qualifiedStatementOfTruth = new QualifiedStatementOfTruth().deserialize(input.qualifiedStatementOfTruth)
      }
      this.rejectPartOfClaim = new RejectPartOfClaim(input.rejectPartOfClaim && input.rejectPartOfClaim.option)
      this.rejectAllOfClaim = new RejectAllOfClaim(input.rejectAllOfClaim && input.rejectAllOfClaim.option)
      this.paidAmount = new PaidAmount().deserialize(input.paidAmount)
      this.impactOfDispute = new ImpactOfDispute().deserialize(input.impactOfDispute)
      this.statementOfMeans = new StatementOfMeans().deserialize(input.statementOfMeans)
      this.whenDidYouPay = new WhenDidYouPay().deserialize(input.whenDidYouPay)
      this.howMuchPaidClaimant = new HowMuchPaidClaimant(input.howMuchPaidClaimant && input.howMuchPaidClaimant.option)

      if (input.fullAdmission) {
        this.fullAdmission = new FullAdmission().deserialize(input.fullAdmission)
      }
    }
    return this
  }

  public isMoreTimeRequested (): boolean {
    return !isNullOrUndefined(this.moreTimeNeeded) && this.moreTimeNeeded.option === MoreTimeNeededOption.YES
  }

  public isResponseFullyAdmitted (): boolean {
    if (!toBoolean(config.get<boolean>('featureToggles.fullAdmission'))) {
      return false
    }

    return this.isResponsePopulated() && this.response.type === ResponseType.FULL_ADMISSION
  }

  public isResponsePartiallyRejectedDueTo (option: String): boolean {
    if (!toBoolean(config.get<boolean>('featureToggles.partialAdmission'))) {
      return false
    }

    if (option === undefined) {
      throw new Error('Option is undefined')
    }

    return this.isResponsePopulated()
      && this.response.type === ResponseType.PART_ADMISSION
      && this.rejectPartOfClaim !== undefined
      && this.rejectPartOfClaim.option === option
  }

  public isResponseRejectedFullyWithDispute (): boolean {
    if (!this.isResponsePopulated()) {
      return false
    }

    return this.response.type === ResponseType.DEFENCE
      && this.rejectAllOfClaim !== undefined && this.rejectAllOfClaim.option === RejectAllOfClaimOption.DISPUTE
  }

  public isResponseRejectedFullyWithAmountClaimedPaid (): boolean {
    if (!this.isResponsePopulated()) {
      return false
    }

    return this.response.type === ResponseType.DEFENCE
      && this.rejectAllOfClaim !== undefined
      && this.rejectAllOfClaim.option === RejectAllOfClaimOption.ALREADY_PAID
      && this.howMuchPaidClaimant !== undefined
      && this.howMuchPaidClaimant.option === HowMuchPaidClaimantOption.AMOUNT_CLAIMED
  }

  public isResponsePopulated (): boolean {
    return !!this.response && !!this.response.type
  }
}
