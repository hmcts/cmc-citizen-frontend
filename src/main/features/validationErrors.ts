export class ValidationErrors {
  static readonly NOT_OWE_FULL_AMOUNT_REQUIRED: string = 'Explain why you don’t owe the full amount'
  static readonly REASON_NOT_OWE_MONEY_TOO_LONG: string = 'Enter reason no longer than $constraint1 characters'
  static readonly VALID_OWED_AMOUNT_REQUIRED: string = 'Enter a valid amount owed'
  static readonly AMOUNT_REQUIRED: string = 'Enter an amount'
  static readonly VALID_AMOUNT_REQUIRED: string = 'Enter a valid amount between £1 and $constraint1'
}
