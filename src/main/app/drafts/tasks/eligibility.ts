import DraftClaim from 'drafts/models/draftClaim'
import { Validator } from 'class-validator'

export class Eligibility {
  static isCompleted (claim: DraftClaim): boolean {
    const isCompleted = new Validator().validateSync(claim.eligibility).length === 0

    const eligible = claim.eligibility.eligible
    return isCompleted && eligible
  }

}
