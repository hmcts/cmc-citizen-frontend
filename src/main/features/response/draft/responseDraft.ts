import { Response } from 'response/form/models/response'
import { FreeMediation } from 'forms/models/freeMediation'
import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { Defence } from 'response/form/models/defence'
import { MoreTimeNeeded, MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { ResponseType } from 'response/form/models/responseType'
import { Defendant } from 'drafts/models/defendant'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { QualifiedStatementOfTruth } from 'forms/models/qualifiedStatementOfTruth'
import { HowMuchOwed } from 'response/form/models/howMuchOwed'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { ImpactOfDispute } from 'response/form/models/impactOfDispute'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { WhenDidYouPay } from 'response/form/models/whenDidYouPay'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'

import { WhyDoYouDisagree } from 'response/form/models/whyDoYouDisagree'
import { YesNoOption } from 'models/yesNoOption'
import { HowMuchDoYouOwe } from 'response/form/models/howMuchDoYouOwe'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'

export class FullAdmission {
  paymentIntention: PaymentIntention

  deserialize (input: any): FullAdmission {
    if (input) {
      this.paymentIntention = PaymentIntention.deserialize(input.paymentIntention)
      return this
    }
  }
}

export class PartialAdmission {

  alreadyPaid?: AlreadyPaid
  howMuchHaveYouPaid?: HowMuchHaveYouPaid
  howMuchDoYouOwe?: HowMuchDoYouOwe
  whyDoYouDisagree?: WhyDoYouDisagree
  timeline?: DefendantTimeline
  evidence?: DefendantEvidence
  paymentIntention?: PaymentIntention

  deserialize (input: any): PartialAdmission {
    if (input) {
      this.alreadyPaid = new AlreadyPaid().deserialize(input.alreadyPaid && input.alreadyPaid.option)
      this.howMuchHaveYouPaid = new HowMuchHaveYouPaid().deserialize(input.howMuchHaveYouPaid)
      this.howMuchDoYouOwe = new HowMuchDoYouOwe().deserialize(input.howMuchDoYouOwe)
      this.whyDoYouDisagree = new WhyDoYouDisagree().deserialize(input.whyDoYouDisagree)
      this.timeline = new DefendantTimeline().deserialize(input.timeline)
      this.evidence = new DefendantEvidence().deserialize(input.evidence)
      if (input.paymentIntention) {
        this.paymentIntention = PaymentIntention.deserialize(input.paymentIntention)
      }
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
  paidAmount?: PaidAmount
  impactOfDispute?: ImpactOfDispute
  whenDidYouPay?: WhenDidYouPay

  fullAdmission?: FullAdmission
  partialAdmission?: PartialAdmission
  rejectAllOfClaim?: RejectAllOfClaim

  statementOfMeans?: StatementOfMeans
  companyDefendantResponseViewed: boolean

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
      this.paidAmount = new PaidAmount().deserialize(input.paidAmount)
      this.impactOfDispute = new ImpactOfDispute().deserialize(input.impactOfDispute)
      this.whenDidYouPay = new WhenDidYouPay().deserialize(input.whenDidYouPay)

      if (input.fullAdmission) {
        this.fullAdmission = new FullAdmission().deserialize(input.fullAdmission)
      }

      if (input.partialAdmission) {
        this.partialAdmission = new PartialAdmission().deserialize(input.partialAdmission)
      }

      if (input.rejectAllOfClaim) {
        this.rejectAllOfClaim = new RejectAllOfClaim().deserialize(input.rejectAllOfClaim)
      }

      if (input.statementOfMeans) {
        this.statementOfMeans = new StatementOfMeans().deserialize(input.statementOfMeans)
      }
      if (input.companyDefendantResponseViewed) {
        this.companyDefendantResponseViewed = input.companyDefendantResponseViewed
      }
    }

    if (this.isImmediatePaymentOptionSelected(this.fullAdmission) || this.isImmediatePaymentOptionSelected(this.partialAdmission)) {
      delete this.statementOfMeans
    }

    return this
  }

  public isImmediatePaymentOptionSelected (data: FullAdmission | PartialAdmission): boolean {
    const isPaymentOptionPopulated = (): boolean => {
      return data !== undefined
        && data.paymentIntention !== undefined
        && data.paymentIntention.paymentOption !== undefined
    }
    return isPaymentOptionPopulated() && data.paymentIntention.paymentOption.isOfType(PaymentType.IMMEDIATELY)
  }

  public isMoreTimeRequested (): boolean {
    return this.moreTimeNeeded !== undefined && this.moreTimeNeeded.option === MoreTimeNeededOption.YES
  }

  public isResponseFullyAdmitted (): boolean {
    return this.isResponsePopulated() && this.response.type === ResponseType.FULL_ADMISSION
  }

  // TODO: Because of an overlap between two stories (ROC-3657, ROC-3658), the logic of this function
  // is incomplete. ROC-3658 should revisit once 'statement of means' flow is complete.
  public isResponseFullyAdmittedWithInstalments (): boolean {

    return this.isResponseFullyAdmitted()
      && this.fullAdmission !== undefined
      && this.fullAdmission.paymentIntention !== undefined
      && this.fullAdmission.paymentIntention.paymentOption !== undefined
      && this.fullAdmission.paymentIntention.paymentOption.option === PaymentType.INSTALMENTS
  }

  public isResponsePartiallyAdmittedWithInstalments (): boolean {

    return this.isResponsePartiallyAdmitted()
      && this.partialAdmission !== undefined
      && this.partialAdmission.paymentIntention !== undefined
      && this.partialAdmission.paymentIntention.paymentOption !== undefined
      && this.partialAdmission.paymentIntention.paymentOption.option === PaymentType.INSTALMENTS
  }

  public isResponsePartiallyAdmitted (): boolean {

    return this.isResponsePopulated()
      && this.response.type === ResponseType.PART_ADMISSION
      && this.partialAdmission !== undefined
  }

  public isResponsePartiallyAdmittedAndAlreadyPaid (): boolean {
    return this.isResponsePartiallyAdmitted() && this.partialAdmission.alreadyPaid.option === YesNoOption.YES
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

  public isResponseRejectedFullyBecausePaidWhatOwed (): boolean {
    return this.isResponseRejected()
      && this.rejectAllOfClaim !== undefined
      && this.rejectAllOfClaim.option === RejectAllOfClaimOption.ALREADY_PAID
  }

  public isResponsePopulated (): boolean {
    return !!this.response && !!this.response.type
  }

  public isResponseFullyAdmittedWithPayBySetDate (): boolean {
    return this.fullAdmission !== undefined
      && this.fullAdmission.paymentIntention !== undefined
      && this.fullAdmission.paymentIntention.paymentOption !== undefined
      && this.fullAdmission.paymentIntention.paymentOption.option === PaymentType.BY_SET_DATE
  }

  public isResponsePartiallyAdmittedWithPayBySetDate (): boolean {
    return this.partialAdmission !== undefined
      && this.partialAdmission.paymentIntention !== undefined
      && this.partialAdmission.paymentIntention.paymentOption !== undefined
      && this.partialAdmission.paymentIntention.paymentOption.option === PaymentType.BY_SET_DATE
  }
}
