import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { LocalDate } from 'forms/models/localDate'

export class DraftPaidInFull extends DraftDocument {
  datePaid: LocalDate

  constructor () {
    super()
  }

  deserialize (input: any): DraftPaidInFull {
    if (input) {
      this.externalId = input.externalId

      if (input.datePaid) {
        this.datePaid = input.datePaid
      }
    }
    return this
  }
}
