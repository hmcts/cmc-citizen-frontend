import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { Response } from 'response/form/models/response'
import { FreeMediation } from 'response/form/models/freeMediation'
import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { Defence } from 'response/form/models/defence'
import { MoreTimeNeeded, MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { ResponseType } from 'response/form/models/responseType'
import { isNullOrUndefined } from 'util'
import { Defendant } from 'drafts/models/defendant'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { QualifiedStatementOfTruth } from 'forms/models/qualifiedStatementOfTruth'
import { HowMuchOwed } from 'response/form/models/howMuchOwed'
import {
  DefendantPaymentOption as PaymentOption,
  DefendantPaymentType
} from 'response/form/models/defendantPaymentOption'
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
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'

export class FullAdmission {
  paymentOption: PaymentOption
  paymentDate?: PaymentDate
  paymentPlan?: PaymentPlan


  deserialize (input: any): FullAdmission {
    if (input) {
      this.paymentOption = new PaymentOption().deserialize(input.paymentOption)
      this.paymentDate = new PaymentDate().deserialize(input.paymentDate)
      this.paymentPlan = new PaymentPlan().deserialize(input.paymentPlan)
    }

    return this
  }
}

export class PartialAdmission {

  alreadyPaid?: AlreadyPaid
  howMuchHaveYouPaid?: HowMuchHaveYouPaid
  whyDoYouDisagree?: Defence
  timeline?: DefendantTimeline
  evidence?: DefendantEvidence

  deserialize (input: any): PartialAdmission {
    if (input) {
      this.alreadyPaid = new AlreadyPaid().deserialize(input.alreadyPaid && input.alreadyPaid.option)
      this.howMuchHaveYouPaid = new HowMuchHaveYouPaid().deserialize(input.howMuchHaveYouPaid)
      this.whyDoYouDisagree = new Defence().deserialize(input.whyDoYouDisagree)
      this.timeline = new DefendantTimeline().deserialize(input.timeline)
      this.evidence = new DefendantEvidence().deserialize(input.evidence)
    }

    return this
  }
}

export class ResponseDraft extends DraftDocument {

  response?: Response
  defence?: Defence
  freeMediation?: FreeMediation
  moreTimeNeeded?: MoreTimeNeeded
  defendantDetails?: Defendant = new Defendant()
  timeline: DefendantTimeline
  evidence: DefendantEvidence
  qualifiedStatementOfTruth?: QualifiedStatementOfTruth
  howMuchOwed?: HowMuchOwed
  rejectAllOfClaim?: RejectAllOfClaim
  paidAmount?: PaidAmount
  impactOfDispute?: ImpactOfDispute
  whenDidYouPay?: WhenDidYouPay
  howMuchPaidClaimant?: HowMuchPaidClaimant

  fullAdmission?: FullAdmission
  partialAdmission?: PartialAdmission
  statementOfMeans?: StatementOfMeans

  deserialize (input: any): ResponseDraft {
    if (input) {
      this.externalId = input.externalId
      this.response = Response.fromObject(input.response)
      this.defence = new Defence().deserialize(input.defence)
      this.freeMediation = new FreeMediation(input.freeMediation && input.freeMediation.option)
      this.moreTimeNeeded = new MoreTimeNeeded(input.moreTimeNeeded && input.moreTimeNeeded.option)
      this.defendantDetails = new Defendant().deserialize(input.defendantDetails)
      this.howMuchOwed = new HowMuchOwed().deserialize(input.howMuchOwed)
      this.evidence = new DefendantEvidence().deserialize(input.evidence)
      this.timeline = new DefendantTimeline().deserialize(input.timeline)
      if (input.qualifiedStatementOfTruth) {
        this.qualifiedStatementOfTruth = new QualifiedStatementOfTruth().deserialize(input.qualifiedStatementOfTruth)
      }
      this.rejectAllOfClaim = new RejectAllOfClaim(input.rejectAllOfClaim && input.rejectAllOfClaim.option)
      this.paidAmount = new PaidAmount().deserialize(input.paidAmount)
      this.impactOfDispute = new ImpactOfDispute().deserialize(input.impactOfDispute)
      this.whenDidYouPay = new WhenDidYouPay().deserialize(input.whenDidYouPay)
      this.howMuchPaidClaimant = new HowMuchPaidClaimant(input.howMuchPaidClaimant && input.howMuchPaidClaimant.option)

      if (input.fullAdmission) {
        this.fullAdmission = new FullAdmission().deserialize(input.fullAdmission)
      }

      if (input.partialAdmission) {
        this.partialAdmission = new PartialAdmission().deserialize(input.partialAdmission)
      }

      if (input.statementOfMeans) {
        this.statementOfMeans = new StatementOfMeans().deserialize(input.statementOfMeans)
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

  // TODO: Because of an overlap between two stories (ROC-3657, ROC-3658), the logic of this function
  // is incomplete. ROC-3658 should revisit once 'statement of means' flow is complete.
  public isResponseFullyAdmittedWithInstalments (): boolean {
    return this.isResponseFullyAdmitted()
      && this.fullAdmission
      && this.fullAdmission.paymentOption
      && (this.fullAdmission.paymentOption.option === DefendantPaymentType.INSTALMENTS)
  }

  public isResponsePartiallyAdmitted (): boolean {
    if (!toBoolean(config.get<boolean>('featureToggles.partialAdmission'))) {
      return false
    }

    return this.isResponsePopulated()
      && this.response.type === ResponseType.PART_ADMISSION
      && this.partialAdmission !== undefined
  }

  public isResponseRejectedFullyWithDispute (): boolean {
    if (!this.isResponsePopulated()) {
      return false
    }

    return this.response.type === ResponseType.DEFENCE
      && this.rejectAllOfClaim !== undefined && this.rejectAllOfClaim.option === RejectAllOfClaimOption.DISPUTE
  }

  public isResponseRejected (): boolean {
    if (!this.isResponsePopulated()) {
      return false
    }

    return this.response.type === ResponseType.DEFENCE
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

  public isResponseFullyAdmittedWithPayBySetDate (): boolean {
    return this.fullAdmission !== undefined
      && this.fullAdmission.paymentOption.option === DefendantPaymentType.BY_SET_DATE
  }
}
