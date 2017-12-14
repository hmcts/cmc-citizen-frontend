export class ValidationErrors {
  static readonly TEXT_TOO_LONG: string = 'You’ve entered too many characters'

  static readonly WHY_NOT_OWE_FULL_AMOUNT_REQUIRED: string = 'Explain why you don’t owe the full amount'
  static readonly YES_NO_REQUIRED: string = 'Please select yes or no'
  static readonly SELECT_AN_OPTION: string = 'Select an option'
  static readonly NUMBER_REQUIRED: string = 'Enter a valid number'
  static readonly VALID_OWED_AMOUNT_REQUIRED: string = 'Enter a valid amount owed'
  static readonly AMOUNT_REQUIRED: string = 'Enter an amount'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter valid amount, maximum two decimal places'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED: string = 'Don’t enter a negative number'
  static readonly POSITIVE_NUMBER_REQUIRED: string = 'Enter a number higher than 0'
  static readonly INTEGER_REQUIRED: string = 'Enter a numeric, for example 3'
}
