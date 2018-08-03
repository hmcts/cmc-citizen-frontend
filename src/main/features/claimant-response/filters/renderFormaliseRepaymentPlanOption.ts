import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'

export namespace FormaliseRepaymentPlanOptionFilter {
  export function render (option: FormaliseRepaymentPlanOption): string {
    return option.displayValue
  }
}
