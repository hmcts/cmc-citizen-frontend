import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'

export namespace BankAccountTypeViewFilter {
  export function render (value: string): string {
    return BankAccountType.valueOf(value).displayValue
  }
}
