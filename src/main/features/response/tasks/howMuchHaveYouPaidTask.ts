import { Validator } from 'class-validator'
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'

const validator = new Validator()

export class HowMuchHaveYouPaidTask {
  static isCompleted (howMuchHaveYouPaid: HowMuchHaveYouPaid): boolean {
    return HowMuchHaveYouPaidTask.isHowMuchHaveYouPaidValid(howMuchHaveYouPaid)
  }

  private static isHowMuchHaveYouPaidValid (model: HowMuchHaveYouPaid): boolean {
    return !!model && validator.validateSync(model).length === 0
  }
}
