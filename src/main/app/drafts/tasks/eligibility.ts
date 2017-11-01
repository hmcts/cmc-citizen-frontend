import DraftClaim from 'drafts/models/draftClaim'
import { Validator } from 'class-validator'

export class Eligibility {
  static isCompleted (claim: DraftClaim): boolean {
    return new Validator().validateSync(claim.eligibility).length === 0
  }

}
