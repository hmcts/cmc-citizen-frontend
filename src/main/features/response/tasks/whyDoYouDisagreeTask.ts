import { Validator } from 'class-validator'
import { Defence } from 'response/form/models/defence'
import { WhyDoYouDisagree } from 'response/form/models/whyDoYouDisagree'

const validator = new Validator()

export class WhyDoYouDisagreeTask {
  static isCompleted (whyDoYouDisagree: WhyDoYouDisagree): boolean {
    return WhyDoYouDisagreeTask.isWhyDoYouDisagreeValid(whyDoYouDisagree)
  }

  private static isWhyDoYouDisagreeValid (model: Defence): boolean {
    return !!model && validator.validateSync(model).length === 0
  }
}
