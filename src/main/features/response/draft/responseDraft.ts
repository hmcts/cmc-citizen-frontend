import { Response } from 'response/form/models/response'
import { Serializable } from 'models/serializable'
import { FreeMediation } from 'response/form/models/freeMediation'
import Defence from 'response/form/models/defence'
import { MoreTimeNeeded, MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { CounterClaim } from 'response/form/models/counterClaim'
import { ResponseType } from 'response/form/models/responseType'
import { isNullOrUndefined } from 'util'
import { Defendant } from 'app/drafts/models/defendant'
import { DraftDocument } from 'app/models/draftDocument'
import { QualifiedStatementOfTruth } from 'app/forms/models/qualifiedStatementOfTruth'
import { Timeline } from 'response/form/models/timeline'

export class ResponseDraft extends DraftDocument implements Serializable<ResponseDraft> {

  response?: Response
  defence?: Defence
  freeMediation?: FreeMediation
  moreTimeNeeded?: MoreTimeNeeded
  counterClaim?: CounterClaim
  defendantDetails?: Defendant = new Defendant()
  timeline: Timeline = new Timeline()
  qualifiedStatementOfTruth?: QualifiedStatementOfTruth

  deserialize (input: any): ResponseDraft {
    if (input) {
      this.externalId = input.externalId
      this.response = Response.fromObject(input.response)
      this.defence = new Defence().deserialize(input.defence)
      this.freeMediation = new FreeMediation(input.freeMediation && input.freeMediation.option)
      this.moreTimeNeeded = new MoreTimeNeeded(input.moreTimeNeeded && input.moreTimeNeeded.option)
      this.counterClaim = CounterClaim.fromObject(input.counterClaim)
      this.defendantDetails = new Defendant().deserialize(input.defendantDetails)
      this.timeline = new Timeline().deserialize(input.timeline)
      if (input.qualifiedStatementOfTruth) {
        this.qualifiedStatementOfTruth = new QualifiedStatementOfTruth().deserialize(input.qualifiedStatementOfTruth)
      }
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

    if (this.response.type === ResponseType.OWE_ALL_PAID_ALL) {
      return true
    }

    return !!(this.response.type === ResponseType.OWE_NONE && this.counterClaim && this.counterClaim.counterClaim === false)
  }
}
