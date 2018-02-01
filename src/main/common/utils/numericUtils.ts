import * as numeral from 'numeral'
import * as _ from 'lodash'

function convert (strVal: string) {
  // checks length, followed by a filter by not containing ',' or valid thousand separators

  if (strVal.length > 0) {

    if ((!strVal.includes(',') || containsAThousandSeparator(strVal))) {
      return numeral(strVal).value()
    } else {
      return _.toNumber(strVal)
    }
  } else {
    return undefined
  }
}

export function toNumberOrUndefined (value: any): number {
  if ([undefined, NaN, '', null, false].indexOf(value) !== -1) {
    return undefined
  }

  if (value === 0 || value === '0') {
    return 0
  }

  const strVal: string = value && value.toString().trim()

  // convert to number
  const numberVal = convert(strVal)

  // checks whether is null or not a number then undefined else  number
  return !numberVal || isNaN(numberVal) ? undefined : numberVal
}

function containsAThousandSeparator (input: string): boolean {
  const THOUSAND_SEPERATOR_REGULAR_EXPRESSION = /^[1-9]\d{0,2}(\,\d{3})+(\.\d*)?$/
  return THOUSAND_SEPERATOR_REGULAR_EXPRESSION.test(input.trim())
}
