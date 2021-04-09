import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { Address } from 'claims/models/address'

export class TransferContents {
  dateOfTransfer: Moment
  reasonForTransfer: string
  hearingCourtName: string
  hearingCourtAddress: Address

  deserialize (input: any): TransferContents {
    if (input) {
      if (input.dateOfTransfer) {
        this.dateOfTransfer = MomentFactory.parse(input.dateOfTransfer)
      }
      this.reasonForTransfer = input.reasonForTransfer
      this.hearingCourtName = input.hearingCourtName
      this.hearingCourtAddress = new Address().deserialize(input.hearingCourtAddress)
    }

    return this
  }
}
