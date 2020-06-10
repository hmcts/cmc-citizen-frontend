import { Moment } from 'moment';
import { MomentFactory } from 'shared/momentFactory';
import { Address } from 'claims/models/address';

export class TransferContent {
  dateOfTransfer: Moment
  reasonForTransfer: string
  hearingCourtName: string
  hearingCourtAddress: Address

  constructor (dateOfTransfer?: Moment, reasonForTransfer?: string, hearingCourtName?: string, hearingCourtAddress?: Address) {
    this.dateOfTransfer = dateOfTransfer
    this.reasonForTransfer = reasonForTransfer
    this.hearingCourtName = hearingCourtName
    this.hearingCourtAddress = hearingCourtAddress
  }

  deserialize (input: any): TransferContent {
    if (input) {
      this.dateOfTransfer = MomentFactory.parse(input.dateOfTransfer)
      this.reasonForTransfer = input.reasonForTransfer
      this.hearingCourtName = input.hearingCourtName
      this.hearingCourtAddress = new Address().deserialize(input.hearingCourtAddress)
    }

    return this
  }
}
