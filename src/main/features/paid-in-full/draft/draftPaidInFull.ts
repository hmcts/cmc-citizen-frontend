import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { DatePaid } from 'paid-in-full/form/models/datePaid'

export class DraftPaidInFull extends DraftDocument {
  datePaid: DatePaid

  constructor (datePaid: DatePaid = new DatePaid()) {
    super()
    this.datePaid = datePaid
  }

  deserialize (input: any): DraftPaidInFull {
    if (input) {
      this.externalId = input.externalId

      if (input.datePaid) {
        this.datePaid = new DatePaid().deserialize(input.datePaid)
      }
    }
    return this
  }
}
