import { IsDefined, IsIn } from 'class-validator'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/FormaliseRepaymentPlanOption'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Select an option'
}

export class FormaliseRepaymentPlan {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(FormaliseRepaymentPlanOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: FormaliseRepaymentPlanOption

  constructor (option?: FormaliseRepaymentPlanOption) {
    this.option = option
  }

  static fromObject (input?: any): FormaliseRepaymentPlan {
    if (!input) {
      return input
    }
    return new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.fromObject(input.option))
  }

  deserialize (input?: any): FormaliseRepaymentPlan {
    if (input && input.option) {
      this.option = FormaliseRepaymentPlanOption.fromObject(input.option)
    }
    return this
  }
}
