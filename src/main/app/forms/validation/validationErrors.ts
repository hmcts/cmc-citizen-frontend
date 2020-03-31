export class ValidationErrors {
  static readonly TEXT_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly AMOUNT_TOO_HIGH: string = 'Are you sure this is a valid value?'
  static readonly AMOUNT_ENTERED_TOO_LARGE: string = 'Enter a value less then the amount claimed'

  static readonly WHY_NOT_OWE_FULL_AMOUNT_REQUIRED: string = 'Explain why you don’t owe the full amount'
  static readonly YES_NO_REQUIRED: string = 'Please select yes or no'
  static readonly SELECT_AN_OPTION: string = 'Select an option'
  static readonly NUMBER_REQUIRED: string = 'Enter a valid number'
  static readonly VALID_OWED_AMOUNT_REQUIRED: string = 'Enter a valid amount owed'
  static readonly AMOUNT_REQUIRED: string = 'Enter an amount'
  static readonly AMOUNT_INVALID_LESS_THAN_ONE_POUND: string = 'Enter an amount of £1 or more'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter a valid amount, maximum two decimal places'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED: string = 'Don’t enter a negative number'
  static readonly POSITIVE_NUMBER_REQUIRED: string = 'Enter a number higher than 0'
  static readonly BELOW_OR_EQUAL_TO_100_REQUIRED: string = 'Enter a number lesser than or equal to 100'
  static readonly INTEGER_REQUIRED: string = 'Enter a numeric, for example 3'
  static readonly DEFENDANT_AGE_REQUIRED: string = 'Select yes, no, or company/organisation'

  static readonly DATE_REQUIRED: string = 'Enter a date'
  static readonly DATE_NOT_VALID: string = 'Enter a valid date'
  static readonly DATE_IN_FUTURE: string = 'Correct the date. You can’t use a future date.'

  static readonly REASON_TOO_LONG: string = 'Enter reason no longer than $constraint1 characters'
  static readonly AMOUNT_NOT_VALID: string = 'Enter a valid amount'

  static readonly DECLARATION_REQUIRED: string = 'Please select I confirm I’ve read and accept the terms of the agreement.'
}
