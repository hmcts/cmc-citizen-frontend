import { IsDefined, IsIn } from '@hmcts/class-validator'
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
    return new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.valueOf(input.option))
  }

  deserialize (input?: any): FormaliseRepaymentPlan {
    if (input && input.option) {
      this.option = FormaliseRepaymentPlanOption.valueOf(input.option.value)
    }
    return this
  }
}
