"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.TEXT_TOO_LONG = 'You’ve entered too many characters';
ValidationErrors.AMOUNT_TOO_HIGH = 'Are you sure this is a valid value?';
ValidationErrors.AMOUNT_ENTERED_TOO_LARGE = 'Enter a value less then the amount claimed';
ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED = 'Explain why you don’t owe the full amount';
ValidationErrors.YES_NO_REQUIRED = 'Please select yes or no';
ValidationErrors.SELECT_AN_OPTION = 'Select an option';
ValidationErrors.NUMBER_REQUIRED = 'Enter a valid number';
ValidationErrors.VALID_OWED_AMOUNT_REQUIRED = 'Enter a valid amount owed';
ValidationErrors.AMOUNT_REQUIRED = 'Enter an amount';
ValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND = 'Enter an amount of £1 or more';
ValidationErrors.AMOUNT_INVALID_DECIMALS = 'Enter a valid amount, maximum two decimal places';
ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED = 'Don’t enter a negative number';
ValidationErrors.POSITIVE_NUMBER_REQUIRED = 'Enter a number higher than 0';
ValidationErrors.BELOW_OR_EQUAL_TO_100_REQUIRED = 'Enter a number lesser than or equal to 100';
ValidationErrors.INTEGER_REQUIRED = 'Enter a numeric, for example 3';
ValidationErrors.DEFENDANT_AGE_REQUIRED = 'Select yes, no, or company/organisation';
ValidationErrors.DATE_REQUIRED = 'Enter a date';
ValidationErrors.DATE_NOT_VALID = 'Enter a valid date';
ValidationErrors.DATE_IN_FUTURE = 'Correct the date. You can’t use a future date.';
ValidationErrors.REASON_TOO_LONG = 'Enter reason no longer than $constraint1 characters';
ValidationErrors.AMOUNT_NOT_VALID = 'Enter a valid amount';
ValidationErrors.DECLARATION_REQUIRED = 'Please select I confirm I’ve read and accept the terms of the agreement.';
