import { Serializable } from 'models/serializable'
import { SettleOutOfCourt, SettleOutOfCourtOption } from 'response/form/models/settleOutOfCourt'
import { isNullOrUndefined } from 'util'
import Offer from 'response/form/models/offer'
import { Draft } from 'app/models/draft'

export class OfferDraft extends Draft implements Serializable<OfferDraft> {

  offer?: Offer
  settleOutOfCourt?: SettleOutOfCourt

  deserialize (input: any): OfferDraft {
    if (input) {
      this.offer = new Offer().deserialize(input.offer)
      this.lastUpdateTimestamp = input.lastUpdateTimestamp
      this.settleOutOfCourt = new SettleOutOfCourt(input.settleOutOfCourt && input.settleOutOfCourt.option)
    }
    return this
  }

  public isSettleOutOfCourt (): boolean {
    return !isNullOrUndefined(this.settleOutOfCourt) && this.settleOutOfCourt.option === SettleOutOfCourtOption.YES
  }
}
