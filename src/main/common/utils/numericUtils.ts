import * as numeral from 'numeral'

function containsAThousandSeparator (input: string): boolean {
  const THOUSAND_SEPERATOR_REGULAR_EXPRESSION = /^[1-9]\d{0,2}(\,\d{3})+(\.\d*)?$/
  return THOUSAND_SEPERATOR_REGULAR_EXPRESSION.test(input.trim())
}

function convert (strVal: string): number {
  if (strVal.length > 0 && (!strVal.includes(',') || containsAThousandSeparator(strVal))) {
    return numeral(strVal).value()
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
  const numberVal: number = convert(strVal)
  return !numberVal || isNaN(numberVal) ? undefined : numberVal
}
