export class ValidationErrors {
  static readonly NOT_OWE_FULL_AMOUNT_REQUIRED: string = 'Explain why you don’t owe the full amount'
  static readonly YES_NO_REQUIRED: string = 'Please select yes or no'
  static readonly REASON_NOT_OWE_MONEY_TOO_LONG: string = 'Enter reason no longer than $constraint1 characters'
  static readonly VALID_OWED_AMOUNT_REQUIRED: string = 'Enter a valid amount owed'
  static readonly AMOUNT_REQUIRED: string = 'Enter an amount'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter valid amount, maximum two decimal places'
}
