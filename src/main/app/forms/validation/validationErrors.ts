export class ValidationErrors {
  static readonly FREE_TEXT_TOO_LONG: string = 'You’ve entered too many characters'

  // static readonly NOT_OWE_FULL_AMOUNT_REQUIRED: string = 'Explain why you don’t owe the full amount'
  static readonly WHY_NOT_OWE_FULL_AMOUNT_REQUIRED: string = 'Explain why you don’t owe the full amount'
  static readonly YES_NO_REQUIRED: string = 'Please select yes or no'
  static readonly SELECT_AN_OPTION: string = 'Select an option'
  static readonly VALID_OWED_AMOUNT_REQUIRED: string = 'Enter a valid amount owed'
  static readonly AMOUNT_REQUIRED: string = 'Enter an amount'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter valid amount, maximum two decimal places'
}

export class RepaymentValidationErrors {
  static readonly WHEN_WILL_YOU_PAY_OPTION_REQUIRED: string = 'Please select when you will pay'
  static readonly FIRST_PAYMENT_AMOUNT_INVALID: string = 'Enter a valid amount of first payment'
  static readonly INSTALMENTS_AMOUNT_INVALID: string = 'Enter a valid amount for equal instalments'
  static readonly FUTURE_DATE: string = 'Enter a first payment date in the future'
  static readonly INVALID_DATE: string = 'Enter a valid date of first payment'
  static readonly SELECT_PAYMENT_SCHEDULE: string = 'Select how often they should pay'
  static readonly OPTION_REQUIRED: string = 'Choose option'
}
