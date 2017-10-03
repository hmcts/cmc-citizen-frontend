import { Response } from 'response/form/models/response'
import { Serializable } from 'models/serializable'
import { FreeMediation } from 'response/form/models/freeMediation'
import { RejectPartOfClaim } from 'response/form/models/rejectPartOfClaim'
import { RejectAllOfClaim } from 'response/form/models/rejectAllOfClaim'
import Defence from 'response/form/models/defence'
import { MoreTimeNeeded, MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { CounterClaim } from 'response/form/models/counterClaim'
import { ResponseType } from 'response/form/models/responseType'
import { isNullOrUndefined } from 'util'
import { Defendant } from 'app/drafts/models/defendant'
import { Draft } from 'app/models/draft'
import { QualifiedStatementOfTruth } from 'app/forms/models/qualifiedStatementOfTruth'

export class ResponseDraft extends Draft implements Serializable<ResponseDraft> {

  response?: Response
  defence?: Defence
  freeMediation?: FreeMediation
  moreTimeNeeded?: MoreTimeNeeded
  counterClaim?: CounterClaim
  defendantDetails?: Defendant = new Defendant()
  qualifiedStatementOfTruth?: QualifiedStatementOfTruth
  rejectPartOfClaim?: RejectPartOfClaim
  rejectAllOfClaim?: RejectAllOfClaim

  deserialize (input: any): ResponseDraft {
    if (input) {
      this.response = Response.fromObject(input.response)
      this.defence = new Defence().deserialize(input.defence)
      this.freeMediation = new FreeMediation(input.freeMediation && input.freeMediation.option)
      this.moreTimeNeeded = new MoreTimeNeeded(input.moreTimeNeeded && input.moreTimeNeeded.option)
      this.counterClaim = CounterClaim.fromObject(input.counterClaim)
      this.defendantDetails = new Defendant().deserialize(input.defendantDetails)
      this.lastUpdateTimestamp = input.lastUpdateTimestamp
      if (input.qualifiedStatementOfTruth) {
        this.qualifiedStatementOfTruth = new QualifiedStatementOfTruth().deserialize(input.qualifiedStatementOfTruth)
      }
      this.rejectPartOfClaim = new RejectPartOfClaim(input.rejectPartOfClaim && input.rejectPartOfClaim.option)
      this.rejectAllOfClaim = new RejectPartOfClaim(input.rejectAllOfClaim && input.rejectAllOfClaim.option)
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

    return !!(this.response.type === ResponseType.OWE_NONE)
  }
}
