import { Defendant } from 'app/drafts/models/defendant'
import { PaidAmount } from 'ccj/form/models/paidAmount'

export class DraftCCJ {
  defendant: Defendant = new Defendant()
  paidAmount?: PaidAmount

  deserialize (input: any): DraftCCJ {
    if (input) {
      this.defendant = new Defendant().deserialize(input.defendant)
      this.paidAmount = new PaidAmount().deserialize(input.paidAmount)
    }
    return this
  }
}
