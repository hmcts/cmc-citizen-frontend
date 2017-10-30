import { Response } from 'response/form/models/response'
import { Serializable } from 'models/serializable'
import { FreeMediation } from 'response/form/models/freeMediation'
import { RejectPartOfClaim, RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import Defence from 'response/form/models/defence'
import { MoreTimeNeeded, MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { ResponseType } from 'response/form/models/responseType'
import { isNullOrUndefined } from 'util'
import { Defendant } from 'app/drafts/models/defendant'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { QualifiedStatementOfTruth } from 'app/forms/models/qualifiedStatementOfTruth'
import { HowMuchPaid } from 'response/form/models/howMuchPaid'
import { HowMuchOwed } from 'response/form/models/howMuchOwed'
import { Timeline } from 'response/form/models/timeline'
import { DefendantPaymentOption } from 'response/form/models/defendantPaymentOption'
import { PaymentPlan } from 'response/form/models/paymentPlan'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PayBySetDate } from 'ccj/form/models/payBySetDate'
import { Evidence } from 'response/form/models/evidence'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

export class ResponseDraft extends DraftDocument implements Serializable<ResponseDraft> {

  response?: Response
  defence?: Defence
  freeMediation?: FreeMediation
  moreTimeNeeded?: MoreTimeNeeded
  defendantDetails?: Defendant = new Defendant()
  howMuchIsPaid?: HowMuchPaid
  timeline: Timeline
  evidence: Evidence
  qualifiedStatementOfTruth?: QualifiedStatementOfTruth
  howMuchOwed?: HowMuchOwed
  rejectPartOfClaim?: RejectPartOfClaim
  rejectAllOfClaim?: RejectAllOfClaim
  defendantPaymentOption: DefendantPaymentOption = new DefendantPaymentOption()
  paymentPlan?: PaymentPlan
  paidAmount?: PaidAmount
  payBySetDate?: PayBySetDate

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
      this.timeline = new Timeline().deserialize(input.timeline)
      this.evidence = new Evidence().deserialize(input.evidence)
      if (input.qualifiedStatementOfTruth) {
        this.qualifiedStatementOfTruth = new QualifiedStatementOfTruth().deserialize(input.qualifiedStatementOfTruth)
      }
      this.rejectPartOfClaim = new RejectPartOfClaim(input.rejectPartOfClaim && input.rejectPartOfClaim.option)
      this.rejectAllOfClaim = new RejectAllOfClaim(input.rejectAllOfClaim && input.rejectAllOfClaim.option)
      this.defendantPaymentOption = new DefendantPaymentOption().deserialize(input.paymentOption)
      this.paymentPlan = new PaymentPlan().deserialize(input.repaymentPlan)
      this.paidAmount = new PaidAmount().deserialize(input.paidAmount)
      this.payBySetDate = new PayBySetDate().deserialize(input.payBySetDate)
    }
    return this
  }

  public isMoreTimeRequested (): boolean {
    return !isNullOrUndefined(this.moreTimeNeeded) && this.moreTimeNeeded.option === MoreTimeNeededOption.YES
  }

  public requireDefence (): boolean {
    if (!(this.response && this.response.type)) {
      return false
    }
    return this.response.type === ResponseType.OWE_NONE && this.rejectAllOfClaim !== undefined
      && RejectAllOfClaimOption.except(RejectAllOfClaimOption.COUNTER_CLAIM).includes(this.rejectAllOfClaim.option)
  }

  public requireHowMuchPaid (): boolean {
    if (!toBoolean(config.get<boolean>('featureToggles.partialAdmission')) || !(this.response && this.response.type)) {
      return false
    }

    return this.response.type === ResponseType.OWE_SOME_PAID_NONE
      && this.rejectPartOfClaim !== undefined
      && this.rejectPartOfClaim.option === RejectPartOfClaimOption.AMOUNT_TOO_HIGH
  }

  public requireHowMuchOwed (): boolean {
    if (!toBoolean(config.get<boolean>('featureToggles.partialAdmission')) || !(this.response && this.response.type)) {
      return false
    }

    return this.response.type === ResponseType.OWE_SOME_PAID_NONE
      && this.rejectPartOfClaim !== undefined
      && this.rejectPartOfClaim.option === RejectPartOfClaimOption.PAID_WHAT_BELIEVED_WAS_OWED
  }
}
