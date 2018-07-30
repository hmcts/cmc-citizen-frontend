import { IsDefined, IsIn } from 'class-validator'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class FormaliseRepaymentPlan {
  @IsDefined({ message: GlobalValidationErrors.SELECT_AN_OPTION })
  @IsIn(FormaliseRepaymentPlanOption.all(), { message: GlobalValidationErrors.SELECT_AN_OPTION })
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
      this.option = FormaliseRepaymentPlanOption.fromObject(input.option.value)
    }
    return this
  }
}
