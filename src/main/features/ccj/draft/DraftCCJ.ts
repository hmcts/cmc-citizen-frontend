import { Defendant } from 'app/drafts/models/defendant'

export class DraftCCJ {
  defendant: Defendant = new Defendant()

  deserialize (input: any): DraftCCJ {
    if (input) {
      this.defendant = new Defendant().deserialize(input.defendant)
    }
    return this
  }

}
