import { Serializable } from 'models/serializable'
import { SettleOutOfCourt, SettleOutOfCourtOption } from 'response/form/models/settleOutOfCourt'
import { isNullOrUndefined } from 'util'
import Offer from 'response/form/models/offer'
import { DraftDocument } from 'app/models/draftDocument'

export class OfferDraft extends DraftDocument implements Serializable<OfferDraft> {

  offer?: Offer
  settleOutOfCourt?: SettleOutOfCourt

  deserialize (input: any): OfferDraft {
    if (input) {
      this.offer = new Offer().deserialize(input.offer)
      this.settleOutOfCourt = new SettleOutOfCourt(input.settleOutOfCourt && input.settleOutOfCourt.option)
    }
    return this
  }

  public isSettleOutOfCourt (): boolean {
    return !isNullOrUndefined(this.settleOutOfCourt) && this.settleOutOfCourt.option === SettleOutOfCourtOption.YES
  }
}
